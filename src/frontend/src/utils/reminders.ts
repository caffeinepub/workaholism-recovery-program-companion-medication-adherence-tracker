import type { Medication, DoseLog } from '../backend';

export interface OverdueDose {
  medicationName: string;
  scheduledTime: string;
}

export interface UpcomingDose {
  medicationName: string;
  scheduledTime: string;
}

function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function getOverdueDoses(
  medications: Medication[],
  doseLogs: DoseLog[],
  reminderWindowMinutes: number
): OverdueDose[] {
  const now = new Date();
  const currentMinutes = getMinutesSinceMidnight(now);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const todayLogs = doseLogs.filter((log) => {
    const logDate = new Date(Number(log.timestamp) / 1000000);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === todayTimestamp;
  });

  const overdue: OverdueDose[] = [];

  for (const med of medications) {
    for (const scheduledTime of med.schedule) {
      const { hours, minutes } = parseTime(scheduledTime);
      const scheduledMinutes = hours * 60 + minutes;
      const minutesPast = currentMinutes - scheduledMinutes;

      if (minutesPast >= reminderWindowMinutes) {
        const alreadyLogged = todayLogs.some(
          (log) => log.medicationName === med.name && log.scheduledTime === scheduledTime
        );

        if (!alreadyLogged) {
          overdue.push({
            medicationName: med.name,
            scheduledTime,
          });
        }
      }
    }
  }

  return overdue;
}

export function getUpcomingDoses(medications: Medication[], doseLogs: DoseLog[]): UpcomingDose[] {
  const now = new Date();
  const currentMinutes = getMinutesSinceMidnight(now);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const todayLogs = doseLogs.filter((log) => {
    const logDate = new Date(Number(log.timestamp) / 1000000);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === todayTimestamp;
  });

  const upcoming: UpcomingDose[] = [];

  for (const med of medications) {
    for (const scheduledTime of med.schedule) {
      const { hours, minutes } = parseTime(scheduledTime);
      const scheduledMinutes = hours * 60 + minutes;

      if (scheduledMinutes > currentMinutes) {
        const alreadyLogged = todayLogs.some(
          (log) => log.medicationName === med.name && log.scheduledTime === scheduledTime
        );

        if (!alreadyLogged) {
          upcoming.push({
            medicationName: med.name,
            scheduledTime,
          });
        }
      }
    }
  }

  return upcoming.sort((a, b) => {
    const aTime = parseTime(a.scheduledTime);
    const bTime = parseTime(b.scheduledTime);
    const aMinutes = aTime.hours * 60 + aTime.minutes;
    const bMinutes = bTime.hours * 60 + bTime.minutes;
    return aMinutes - bMinutes;
  });
}
