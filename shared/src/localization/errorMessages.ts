export const errorMessages = {
  notFound(resourceDisplayName: string): string {
    return `Không tìm thấy ${resourceDisplayName}.`;
  },
  incorrect(propertyDisplayName: string): string {
    return `${propertyDisplayName} không chính xác.`;
  }
};
