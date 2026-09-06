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
  searchContent: "Nội dung tìm kiếm"
};

export function getDisplayNameByKey(key: string): string | null {
  return displayNames[key as keyof typeof displayNames] ?? null;
}
