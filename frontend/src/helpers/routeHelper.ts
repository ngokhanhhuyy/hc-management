export function getSignInRoutePath(): string {
  return "/sign-in";
}

export function getHomeRoutePath(): string {
  return getDashboardRoutePath();
}

// Dashboard routes.
export function getSeatingListRoutePath(): string {
  return "/dashboard/seatings";
}

export function getSeatingOrderUpsertRoutePath(seatingId: number): string {
  return `/dashboard/seatings/${seatingId}`;
}

export function getDashboardRoutePath(): string {
  return "/dashboard";
}

// Editor routes.
export function getEditorRoutePath(): string {
  return "/editors";
}

// Seating editor routes.
export function getSeatingEditorRoutePath(): string {
  return "/editors/seatings";
}

export function getSeatingEditorCreateRoutePath(): string {
  return "/editors/seatings/create";
}

export function getSeatingEditorUpdateRoutePath(id: number): string {
  return `/editors/seatings/${id}`;
}

// Menu item editor routes.
export function getMenuItemEditorRoutePath(): string {
  return "/editors/menu-items";
}

export function getMenuItemEditorCreateRoutePath(): string {
  return "/editors/menu-items/create";
}

export function getMenuItemEditorUpdateRoutePath(id: number): string {
  return `/editors/menu-items/${id}`;
}

// Menu category editor routes.
export function getMenuCategoryEditorRoutePath(): string {
  return "/editors/menu-items";
}

export function getMenuCategoryEditorCreateRoutePath(): string {
  return "/editors/menu-items/create";
}

export function getMenuCategoryEditorUpdateRoutePath(id: number): string {
  return `/editors/menu-items/${id}`;
}
