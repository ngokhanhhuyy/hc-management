import type { IServiceContainer } from "#/framework/dependencyInjection";
import type { ICallerDetailProvider } from "../common/authentication";
import type { IDtoFactory } from "../common/dtos";
import type { IDatabaseErrorHandler, IErrorFactory } from "../common/errors";
import type { PrismaClient, Seating } from "../database/client";
import type {
  SeatingBasicResponseDto,
  SeatingDetailResponseDto,
  SeatingUpsertRequestDto
} from "@hc-management/shared/dtos";

export interface ISeatingService {
  getAllAsync(): Promise<SeatingBasicResponseDto[]>;
  getDetailAsync(id: number): Promise<SeatingDetailResponseDto>;
  createAsync(requestDto: SeatingUpsertRequestDto): Promise<number>;
  updateAsync(id: number, requestDto: SeatingUpsertRequestDto): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}

export class SeatingService implements ISeatingService {
  private readonly database: PrismaClient;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;
  private readonly dtoFactory: IDtoFactory;
  private readonly errorFactory: IErrorFactory;
  private readonly callerDetailProvider: ICallerDetailProvider;

  public constructor(dependencies: IServiceContainer) {
    this.database = dependencies.prisma;
    this.databaseErrorHandler = dependencies.databaseErrorHandler;
    this.dtoFactory = dependencies.dtoFactory;
    this.errorFactory = dependencies.errorFactory;
    this.callerDetailProvider = dependencies.callerDetailProvider;
  }

  public async getAllAsync(): Promise<SeatingBasicResponseDto[]> {
    const seatings = await this.database.seating.findMany({
      where: {
        isDeleted: {
          equals: false
        }
      }
    });

    return seatings.map(s => this.dtoFactory.createSeatingBasic(s));
  }

  public async getDetailAsync(id: number): Promise<SeatingDetailResponseDto> {
    const seating = await this.database.seating.findUnique({
      include: {
        orders: {
          where: {
            finishedDateTime: {
              equals: null
            }
          }
        },
        createdUser: true,
        lastUpdatedUser: true
      },
      where: { id }
    });

    if (!seating) {
      throw this.errorFactory.createNotFoundError();
    }

    return this.dtoFactory.createSeatingDetail(seating);
  }

  public async createAsync(requestDto: SeatingUpsertRequestDto): Promise<number> {
    try {
      const menuItem = await this.database.seating.create({
        data: {
          name: requestDto.name,
          concurrencyVersion: crypto.randomUUID()
        }
      });

      return menuItem.id;
    } catch (error) {
      throw this.convertModificationError(error);
    }
  }

  public async updateAsync(id: number, requestDto: SeatingUpsertRequestDto): Promise<void> {
    try {
      await this.database.seating.update({
        data: {
          name: requestDto.name,
          concurrencyVersion: crypto.randomUUID()
        },
        where: {
          id,
          isDeleted: false
        }
      });
    } catch (error) {
      throw this.convertModificationError(error);
    }
  }

  public async deleteAsync(id: number): Promise<void> {
    try {
      await this.database.seating.update({
        data: {
          deletedDateTime: new Date(),
          concurrencyVersion: crypto.randomUUID()
        },
        where: { id }
      });
    } catch (error) {
      throw this.convertModificationError(error);
    }
  }

  private convertModificationError(error: unknown): unknown {
    const handledResult = this.databaseErrorHandler.handle<Seating>(error);

    if (handledResult?.type === "RecordNotFound") {
      throw this.errorFactory.createNotFoundError();
    }

    if (handledResult?.type === "UniqueConstraintViolation" && handledResult?.violatedColumnNames.includes("name")) {
      return this.errorFactory.createOperationErrorIndicatingDuplicatedCase("name", "name");
    }

    return error;
  }
}
