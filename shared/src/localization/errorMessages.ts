export const errorMessages = {
  // Validation errors.
  notNullOrEmpty(): string {
    return "{propertyDisplayName} không được để trống.";
  },
  greaterThan(comparisonValue: number): string {
    return `{propertyDisplayName} phải lớn hơn ${comparisonValue}.`;
  },
  greaterThanOrEqualsTo(comparisonValue: number): string {
    return `{propertyDisplayName} phải lớn hơn hoặc bằng ${comparisonValue}.`;
  },
  lessThan(comparisonValue: number): string {
    return `{propertyDisplayName} phải nhỏ hơn ${comparisonValue}.`;
  },
  lessThanOrEqualsTo(comparisonValue: number): string {
    return `{propertyDisplayName} phải nhỏ hơn hoặc bằng ${comparisonValue}.`;
  },
  minLength(length: number, collectionType: "string" | "array", itemDisplayName?: string): string {
    let defaultItemDisplayName: string;
    if (collectionType === "string") {
      defaultItemDisplayName = "kí tự";
    } else {
      defaultItemDisplayName = "phần tử";
    }

    return `{propertyDisplayName} phải chứa tối thiểu ${length} ${itemDisplayName ?? defaultItemDisplayName}.`;
  },
  maxLength(length: number, collectionType: "string" | "array", itemDisplayName?: string): string {
    let defaultItemDisplayName: string;
    if (collectionType === "string") {
      defaultItemDisplayName = "kí tự";
    } else {
      defaultItemDisplayName = "phần tử";
    }

    return `{propertyDisplayName} chỉ được chứa tối đa ${length} ${itemDisplayName ?? defaultItemDisplayName}.`;
  },
  duplicated(resourceDisplayName?: string): string {
    const computedResourceDisplayName = resourceDisplayName ?? "{resourceDisplayName}";
    return `${computedResourceDisplayName} đã tồn tại.`;
  },

  // Business logic errors.
  notFound(resourceDisplayName: string): string {
    return `Không tìm thấy ${resourceDisplayName}.`;
  },
  incorrect(propertyDisplayName: string): string {
    return `${propertyDisplayName} không chính xác.`;
  },
  seatingActiveOrderNotFinished(seatingName: string): string {
    return `${seatingName} có order chưa thanh toán.`;
  }
};
