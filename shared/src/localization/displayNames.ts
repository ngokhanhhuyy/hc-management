export const displayNames = {
  user: "Người dùng",
  menuItem: "Mục thực đơn",
  menuCategory: "Loại thực đơn",
  seating: "Bàn",
  order: "Order",
  orderItem: "Mục order",
  userName: "Tên người dùng",
  password: "Mật khẩu",
  confirmationPassword: "Mật khẩu xác nhận",
  newPassword: "Mật khẩu mới",
  name: "Tên",
};

export function getDisplayNameByKey(key: string): string {
  if (!Object.keys(displayNames).includes(key)) {
    throw new Error(`The specified key "${key}" for display name doesn't exist.`);
  }

  return displayNames[key as keyof typeof displayNames];
}
