export function areOnlineBookingsPaused(): boolean {
  return process.env.BOOKINGS_PAUSED !== "false";
}
