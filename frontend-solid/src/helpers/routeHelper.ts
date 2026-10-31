export function getSignInRoutePath(): string {
  return "/dang-nhap";
}

export function getHomeRoutePath(): string {
  return getDashboardRoutePath();
}

// Dashboard routes.
export function getSeatingListRoutePath(): string {
  return "/bang-dieu-khien/ban-an";
}

export function getSeatingOrderUpsertRoutePath(seatingId: number): string {
  return `/bang-dieu-khien/goi-mon/${seatingId}`;
}

export function getDashboardRoutePath(): string {
  return "/bang-dieu-khien";
}

// Editor routes.
export function getEditorRoutePath(): string {
  return "/chinh-sua";
}

// Seating editor routes.
export function getSeatingEditorRoutePath(): string {
  return `${getEditorRoutePath()}/ban-an`;
}

export function getSeatingEditorCreateRoutePath(): string {
  return `${getSeatingEditorRoutePath()}/tao-moi`;
}

export function getSeatingEditorUpdateRoutePath(id: number): string {
  return `${getSeatingEditorRoutePath}/${id}`;
}

// Menu item editor routes.
export function getMenuItemEditorRoutePath(): string {
  return `${getEditorRoutePath()}/mon-an`;
}

export function getMenuItemEditorCreateRoutePath(): string {
  return `${getMenuItemEditorRoutePath()}/tao-moi`;
}

export function getMenuItemEditorUpdateRoutePath(id: number): string {
  return `${getMenuItemEditorRoutePath()}/${id}`;
}

// Menu category editor routes.
export function getMenuCategoryEditorRoutePath(): string {
  return `${getEditorRoutePath()}/phan-loai`;
}

export function getMenuCategoryEditorCreateRoutePath(): string {
  return `${getMenuCategoryEditorRoutePath()}/tao-moi`;
}

export function getMenuCategoryEditorUpdateRoutePath(id: number): string {
  return `${getMenuCategoryEditorRoutePath()}/${id}`;
}
