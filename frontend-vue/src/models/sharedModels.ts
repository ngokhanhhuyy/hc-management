import type {
  MenuCategoryBasicResponseDto,
  MenuItemBasicResponseDto,
  MenuItemDetailResponseDto,
  SeatingBasicResponseDto,
  OrderBasicResponseDto,
  UserBasicResponseDto,
} from '#/api';
import { getDisplayAmountText } from '#/helpers';

export class MenuCategoryBasicModel {
  public readonly id: number;
  public readonly name: string;

  public constructor(responseDto: MenuCategoryBasicResponseDto) {
    this.id = responseDto.id;
    this.name = responseDto.name;
  }
};

export class MenuItemBasicModel {
  public readonly id: number;
  public readonly name: string;
  public readonly unit: string | null;
  public readonly defaultAmountBeforeVatPerUnit: number;
  public readonly defaultVatPercentagePerUnit: number;
  public readonly category: MenuCategoryBasicModel | null;
  public readonly isDeleted: boolean;

  public constructor(responseDto: MenuItemBasicResponseDto | MenuItemDetailResponseDto) {
    this.id = responseDto.id;
    this.name = responseDto.name;
    this.unit = responseDto.unit;
    this.defaultAmountBeforeVatPerUnit = responseDto.defaultAmountBeforeVatPerUnit;
    this.defaultVatPercentagePerUnit = responseDto.defaultVatPercentagePerUnit;
    this.category = responseDto.category ? new MenuCategoryBasicModel(responseDto.category) : null;

    const dto = responseDto as MenuItemBasicResponseDto & {
      isDeleted?: boolean;
      deletedDateTime?: string | null;
    };

    this.isDeleted = Object.hasOwn(responseDto, 'isDeleted') ? !!dto.isDeleted : dto.deletedDateTime == null;
  }

  public get displayDefaultAmountBeforeVatPerUnit(): string {
    return getDisplayAmountText(this.defaultAmountBeforeVatPerUnit);
  }
}

export class SeatingBasicModel {
  public readonly id: number;
  public readonly name: string;
  public readonly activeOrder: OrderBasicModel | null;
  public readonly isDeleted: boolean;

  public constructor(responseDto: SeatingBasicResponseDto) {
    this.id = responseDto.id;
    this.name = responseDto.name ?? `Bàn không tên ${responseDto.id}`;
    this.activeOrder = responseDto.activeOrder ? new OrderBasicModel(responseDto.activeOrder) : null;
    this.isDeleted = responseDto.isDeleted;
  }
}

export class OrderBasicModel {
  public readonly id: number;
  public readonly itemAmount: number;
  public readonly isFinished: boolean;
  public readonly displayItemAmount: string;

  public constructor(responseDto: OrderBasicResponseDto) {
    this.id = responseDto.id;
    this.itemAmount = responseDto.itemAmount;
    this.isFinished = responseDto.isFinished;
    this.displayItemAmount = getDisplayAmountText(this.itemAmount);
  }
}

export class UserBasicModel {
  public readonly id: number;
  public readonly userName: string;
  public readonly isDeleted: boolean;

  public constructor(responseDto: UserBasicResponseDto) {
    this.id = responseDto.id;
    this.userName = responseDto.userName;
    this.isDeleted = responseDto.isDeleted;
  }
}
