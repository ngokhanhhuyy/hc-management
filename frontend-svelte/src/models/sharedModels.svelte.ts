import type {
  MenuCategoryBasicResponseDto,
  MenuItemBasicResponseDto,
  MenuItemDetailResponseDto,
  SeatingBasicResponseDto,
  OrderBasicResponseDto,
  UserBasicResponseDto,
} from "#/api";
import { getDisplayAmountText } from "#/helpers";

export class MenuCategoryBasicModel {
  public readonly id: number;
  public readonly name: string;

  public constructor(responseDto: MenuCategoryBasicResponseDto) {
    this.id = $state(responseDto.id);
    this.name = $state(responseDto.name);
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
  public readonly displayDefaultAmountBeforeVatPerUnit: string;

  public constructor(responseDto: MenuItemBasicResponseDto | MenuItemDetailResponseDto) {
    this.id = $state(responseDto.id);
    this.name = $state(responseDto.name);
    this.unit = $state(responseDto.unit);
    this.defaultAmountBeforeVatPerUnit = $state(responseDto.defaultAmountBeforeVatPerUnit);
    this.defaultVatPercentagePerUnit = $state(responseDto.defaultVatPercentagePerUnit);
    this.category = $state(responseDto.category ? new MenuCategoryBasicModel(responseDto.category) : null);

    const dto = responseDto as MenuItemBasicResponseDto & {
      isDeleted?: boolean;
      deletedDateTime?: string | null;
    };

    this.isDeleted = $state(Object.hasOwn(responseDto, "isDeleted") ? !!dto.isDeleted : dto.deletedDateTime == null);
    this.displayDefaultAmountBeforeVatPerUnit = $derived(
      getDisplayAmountText(this.defaultAmountBeforeVatPerUnit),
    );
  }
}

export class SeatingBasicModel {
  public readonly id: number;
  public readonly name: string;
  public readonly activeOrder: OrderBasicModel | null;
  public readonly isDeleted: boolean;

  public constructor(responseDto: SeatingBasicResponseDto) {
    this.id = $state(responseDto.id);
    this.name = $state(responseDto.name ?? `Bàn không tên ${responseDto.id}`);
    this.activeOrder = $state(responseDto.activeOrder ? new OrderBasicModel(responseDto.activeOrder) : null);
    this.isDeleted = $state(responseDto.isDeleted);
  }
}

export class OrderBasicModel {
  public readonly id: number;
  public readonly itemAmount: number;
  public readonly isFinished: boolean;
  public readonly displayItemAmount: string;

  public constructor(responseDto: OrderBasicResponseDto) {
    this.id = $state(responseDto.id);
    this.itemAmount = $state(responseDto.itemAmount);
    this.isFinished = $state(responseDto.isFinished);
    this.displayItemAmount = $derived(getDisplayAmountText(this.itemAmount));
  }
}

export class UserBasicModel {
  public readonly id: number;
  public readonly userName: string;
  public readonly isDeleted: boolean;

  public constructor(responseDto: UserBasicResponseDto) {
    this.id = $state(responseDto.id);
    this.userName = $state(responseDto.userName);
    this.isDeleted = $state(responseDto.isDeleted);
  }
}
