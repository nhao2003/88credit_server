export function parseTimeToMilliseconds(timeString: string): number {
  const timeRegex = /^(\d+)([smhdMy])$/;
  const match = timeString.match(timeRegex);
  if (!match) {
    throw new Error("Invalid time string");
  }
  const [, time, unit] = match;
  const timeInt = parseInt(time);
  switch (unit) {
    case "s":
      return timeInt * 1000;
    case "m":
      return timeInt * 60 * 1000;
    case "h":
      return timeInt * 60 * 60 * 1000;
    case "d":
      return timeInt * 24 * 60 * 60 * 1000;
    case "M":
      return timeInt * 30 * 24 * 60 * 60 * 1000;
    default: // "y"
      return timeInt * 365 * 24 * 60 * 60 * 1000;
  }
}
