import type { OrderDetailResponseDto, OrderUpsertRequestDto } from "../dtos/index.js";

export function calculateOrderAmount(order: OrderUpsertRequestDto | OrderDetailResponseDto): number {
  return order.items.reduce((totalAmount, item) => {
    const itemAmount = Math.round(item.amountBeforeVatPerUnit * (item.vatPercentagePerUnit / 100) / 1000) * 1000;
    return totalAmount + itemAmount;
  }, 0);
}
