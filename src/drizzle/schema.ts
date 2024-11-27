// src/drizzle/schema.ts
import { defineSchema } from '@drizzle/orm'

export const ScheduleAvailabilityTable = defineSchema({
  name: 'schedule_availability',
  columns: {
    dayOfWeek: 'string',
    startTime: 'string',
    endTime: 'string',
  },
})

export const ScheduleTable = defineSchema({
  name: 'schedule',
  columns: {
    clerkUserId: 'string',
    timezone: 'string',
  },
  relations: {
    availabilities: {
      type: 'hasMany',
      target: ScheduleAvailabilityTable,
    },
  },
})
