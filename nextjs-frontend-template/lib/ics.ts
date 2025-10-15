/**
 * ICS (iCalendar) file generation utility
 * Generates .ics files for calendar events
 */

interface ICSEvent {
  title: string
  description?: string
  location?: string
  startTime: Date
  endTime: Date
  url?: string
}

/**
 * Format date to ICS format: YYYYMMDDTHHMMSSZ
 */
function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

/**
 * Escape special characters in ICS text fields
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

/**
 * Generate ICS file content for a calendar event
 */
export function generateICS(event: ICSEvent): string {
  const now = new Date()
  const timestamp = formatICSDate(now)
  const uid = `${timestamp}-${Math.random().toString(36).substring(7)}@365hub.nl`

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//365 Hub//NONSGML Event//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:365 Hub",
    "X-WR-TIMEZONE:Europe/Amsterdam",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${formatICSDate(event.startTime)}`,
    `DTEND:${formatICSDate(event.endTime)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
  ]

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`)
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`)
  }

  if (event.url) {
    lines.push(`URL:${event.url}`)
  }

  lines.push("STATUS:CONFIRMED")
  lines.push("SEQUENCE:0")
  lines.push("END:VEVENT")
  lines.push("END:VCALENDAR")

  return lines.join("\r\n")
}

/**
 * Trigger browser download of ICS file
 */
export function downloadICS(event: ICSEvent, filename: string = "event.ics") {
  const icsContent = generateICS(event)
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
