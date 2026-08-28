import { Prisma } from "../../database/client";

type DatabaseErrorType =
  | "UniqueConstraintViolation"
  | "ForeignKeyConstraintViolation"
  | "RecordNotFound";

type P2002Meta<TEntity extends object> = {
  modelName: string;
  driverAdapterError: {
    name: string;
    cause: {
      originalCode: string;
      originalMessage: string;
      kind: "UniqueConstraintViolation",
      constraint: {
        fields: (keyof TEntity)[];
      }
    }
  };
};

export type DatabaseErrorHandledResult<TEntity extends object> = {
  type: DatabaseErrorType;
  violatedColumnNames: (keyof TEntity)[];
};

export interface IDatabaseErrorHandler {
  handle<TEntity extends object>(error: unknown): DatabaseErrorHandledResult<TEntity> | null;
}

export class PrismaDatabaseErrorHandler implements IDatabaseErrorHandler {
  public handle<TEntity extends object>(error: unknown): DatabaseErrorHandledResult<TEntity> | null {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let errorType: DatabaseErrorType;
      switch (error.code) {
        case "P2002":
        return {
          type: "UniqueConstraintViolation",
          violatedColumnNames: (error.meta as P2002Meta<TEntity>).driverAdapterError.cause.constraint.fields
        };

        case "P2003":
          errorType = "ForeignKeyConstraintViolation";
          break;

        case "P2025":
          errorType = "RecordNotFound";
          break;

        default:
          throw new Error(`Error handling logic for prisma error code [${error.code}] has not been implemented.`);
      }
      
      const target = error.meta?.target;
      return {
        type: errorType,
        violatedColumnNames: (target && Array.isArray(target)) ? (target as (keyof TEntity)[]) : []
      };
    }

    return null;
  }
}
