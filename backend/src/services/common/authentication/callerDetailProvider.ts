import type { UserDetailResponseDto } from "@hc-management/shared/dtos";

export interface ICallerDetailProvider {
  getCallerId(): number;
  getCallerDetail(): UserDetailResponseDto;
}

export class CallerDetailProvider implements ICallerDetailProvider {
  private detail: UserDetailResponseDto | null = null;

  public getCallerId(): number {
    const detail = this.getCallerDetail();
    return detail.id;
  }

  public getCallerDetail(): UserDetailResponseDto {
    if (!this.detail) {
      throw new Error("Caller detail has not been set.");
    }

    return this.detail;
  }

  public setCallDetail(detail: UserDetailResponseDto): void {
    this.detail = detail;
  }
}
