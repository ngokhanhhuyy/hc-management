import type { OrderDetailResponseDto, OrderUpsertRequestDto } from "../dtos/index.js";

type OrderAmount = {
  amountBeforeVat: number;
  vatAmount: number;
  totalAmount: number;
};

export function calculateOrderAmount(order: OrderUpsertRequestDto | OrderDetailResponseDto): OrderAmount {
  let amountBeforeVat: number = 0;
  let vatAmount: number = 0;
  let totalAmount: number = 0;

  for (const item of order.items) {
    const amountBeforeVatPerUnit = item.amountBeforeVatPerUnit;
    const vatPercentagePerUnit = item.vatPercentagePerUnit;

    amountBeforeVat += amountBeforeVatPerUnit * item.quantity;

    const vatAmountPerUnit = Math.round((amountBeforeVatPerUnit * (vatPercentagePerUnit / 100)) / 1000) * 1000;
    vatAmount += vatAmountPerUnit * item.quantity;

    const singleItemAmount = amountBeforeVatPerUnit + vatAmountPerUnit;
    totalAmount += singleItemAmount * item.quantity;
  }

  return {
    amountBeforeVat,
    vatAmount,
    totalAmount
  };
}
