export function getSignInRoutePath(): string {
  return "/sign-in";
}

export function getHomeRoutePath(): string {
  return getDashboardRoutePath();
}

export function getSeatingListRoutePath(): string {
  return "/dashboard/seatings";
}

export function getSeatingOrderUpsertRoutePath(seatingId: number): string {
  return `/dashboard/seatings/${seatingId}`;
}

export function getDashboardRoutePath(): string {
  return "/dashboard";
}
