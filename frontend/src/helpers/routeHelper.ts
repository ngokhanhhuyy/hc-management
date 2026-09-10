export function getSignInRoutePath(): string {
  return "/sign-in";
}

export function getSeatingListRoutePath(): string {
  return "/seatings";
}

export function getSeatingOrderUpsertRoutePath(seatingId: number): string {
  return `/seatings/${seatingId}`;
}

export function getDashboardRoutePath(): string {
  return "/dashboard";
}
