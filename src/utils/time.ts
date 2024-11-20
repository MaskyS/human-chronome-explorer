export function formatHoursToHRM(value: number): string {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return hours > 0 ? `${hours} hrs ${minutes} m` : `${minutes} m`;
}
