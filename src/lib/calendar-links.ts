function encode(value: string): string {
  return encodeURIComponent(value);
}

export function buildGoogleCalendarUrl({
  title,
  description,
  startDateTime,
  endDateTime,
  location,
}: {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
}) {
  const start = new Date(startDateTime).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const end = new Date(endDateTime).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildGoogleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encode(query)}`;
}
