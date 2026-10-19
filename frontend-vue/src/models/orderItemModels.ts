import { MenuItemBasicModel } from './sharedModels';
import type { OrderItemDetailResponseDto, OrderItemUpsertRequestDto } from '#/api';
import { isOrderItemDetailResponseDto } from '#/helpers';

export class OrderItemDetailModel {
  public id: number;
  public amountBeforeVatPerUnit: number;
  public vatPercentagePerUnit: number;
  public quantity: number;
  public menuItem: MenuItemBasicModel;
  public guid: string;

  public constructor(responseDto: OrderItemDetailResponseDto) {
    this.id = responseDto.id;
    this.amountBeforeVatPerUnit = responseDto.amountBeforeVatPerUnit;
    this.vatPercentagePerUnit = responseDto.vatPercentagePerUnit;
    this.quantity = responseDto.quantity;
    this.menuItem = new MenuItemBasicModel(responseDto.menuItem);
    this.guid = responseDto.guid;
  }
}

export class OrderItemUpsertModel {
  public id: number | null = null;
  public amountBeforeVatPerUnit: number = 0;
  public vatPercentagePerUnit: number = 0;
  public quantity: number = 1;
  public menuItem: MenuItemBasicModel;
  public guid: string = crypto.randomUUID();

  public constructor(arg: OrderItemDetailResponseDto | MenuItemBasicModel) {
    if (isOrderItemDetailResponseDto(arg)) {
      this.id = arg.id;
      this.amountBeforeVatPerUnit = arg.amountBeforeVatPerUnit;
      this.vatPercentagePerUnit = arg.vatPercentagePerUnit;
      this.quantity = arg.quantity;
      this.menuItem = new MenuItemBasicModel(arg.menuItem);

      return;
    }
    
    this.amountBeforeVatPerUnit = arg.defaultAmountBeforeVatPerUnit;
    this.vatPercentagePerUnit = arg.defaultVatPercentagePerUnit;
    this.menuItem = arg;
  }

  public toRequestDto(): OrderItemUpsertRequestDto {
    return {
      id: this.id,
      amountBeforeVatPerUnit: this.amountBeforeVatPerUnit,
      vatPercentagePerUnit: this.vatPercentagePerUnit,
      quantity: this.quantity,
      menuItemId: this.menuItem.id,
      guid: this.guid
    };
  }
}
