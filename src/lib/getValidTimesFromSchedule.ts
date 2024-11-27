import { DAYS_OF_WEEK_IN_ORDER } from "../data/constants"
import { db } from "../drizzle/db"
import { ScheduleAvailabilityTable } from "../drizzle/schema"
import { getCalendarEventTimes } from "../server/googleCalendar"
import {
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday
} from "date-fns" // Add this import

import { fromZonedTime } from "date-fns-tz"

export async function getValidTimesFromSchedule(
  timesInOrder: Date[],
  event: { clerkUserId: string; durationInMinutes: number }
) {
  const start = timesInOrder[0]
  const end = timesInOrder.at(-1)

  if (start == null || end == null) return []

  // Fetch the schedule from the database
  const schedule = await db.query.schedule.findFirst({
    where: {
      clerkUserId: event.clerkUserId,
    },
    include: {
      availabilities: true, // Include related availabilities
    },
  })

  if (!schedule) return []

  const groupedAvailabilities = Object.groupBy(
    schedule.availabilities,
    (a) => a.dayOfWeek
  )

  const eventTimes = await getCalendarEventTimes(event.clerkUserId, {
    start,
    end,
  })

  return timesInOrder.filter((intervalDate) => {
    const availabilities = getAvailabilities(
      groupedAvailabilities,
      intervalDate,
      schedule.timezone
    )

    const eventInterval = {
      start: intervalDate,
      end: addMinutes(intervalDate, event.durationInMinutes),
    }

    return (
      eventTimes.every((eventTime) => !areIntervalsOverlapping(eventTime, eventInterval)) &&
      availabilities.some((availability) =>
        isWithinInterval(eventInterval.start, availability) &&
        isWithinInterval(eventInterval.end, availability)
      )
    )
  })
}

function getAvailabilities(
  groupedAvailabilities: Partial<
    Record<
      string,
      ScheduleAvailabilityTable[]
    >
  >,
  date: Date,
  timezone: string
) {
  let availabilities: ScheduleAvailabilityTable[] | undefined

  // Determine which day's availability to check
  if (isMonday(date)) availabilities = groupedAvailabilities.monday
  if (isTuesday(date)) availabilities = groupedAvailabilities.tuesday
  if (isWednesday(date)) availabilities = groupedAvailabilities.wednesday
  if (isThursday(date)) availabilities = groupedAvailabilities.thursday
  if (isFriday(date)) availabilities = groupedAvailabilities.friday
  if (isSaturday(date)) availabilities = groupedAvailabilities.saturday
  if (isSunday(date)) availabilities = groupedAvailabilities.sunday

  if (!availabilities) return []

  return availabilities.map(({ startTime, endTime }) => {
    // Correct way to set hours and minutes
    const start = fromZonedTime(
      setMinutes(setHours(date, parseInt(startTime.split(":")[0])), parseInt(startTime.split(":")[1])),
      timezone
    )

    const end = fromZonedTime(
      setMinutes(setHours(date, parseInt(endTime.split(":")[0])), parseInt(endTime.split(":")[1])),
      timezone
    )

    return { start, end }
  })
}