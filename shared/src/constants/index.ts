export const ValidationContracts = {
  MenuCategory: {
    NameMinLength: 3,
    NameMaxLength: 15,
  },
  MenuItem: {
    NameMinLength: 3,
    NameMaxLength: 35,
    UnitMaxLength: 12,
    DefaultPriceBeforeVatPerUnitMinValue: 0,
    DefaultVatPercentagePerUnitMinValue: 0,
    DefaultVatPercentagePerUnitMaxValue: 100,
  },
  Seating: {
    NameMaxLength: 20
  },
  OrderItem: {
    QuantityMinValue: 1,
  },
  User: {
    UserNameMinLength: 5,
    PasswordMinLength: 5
  }
} as const;
