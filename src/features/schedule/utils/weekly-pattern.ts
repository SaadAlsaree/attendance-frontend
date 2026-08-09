import { FixedShiftDay } from '../types/schedules';

// 0=Sunday … 6=Saturday — the API/.NET convention used by the weekly pattern
// (NOT the 1-based DAYS_OF_WEEK in types/schedules.ts, which belongs to the
// schedule form's own day model).
export const WEEK_DAYS_0_SUNDAY = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

const compactTime = (t: string) => {
  // "09:00:00" → "9", "16:30:00" → "16:30"
  const [h, m] = t.split(':');
  const hour = String(parseInt(h, 10));
  return m === '00' ? hour : `${hour}:${m}`;
};

// Most shift names already carry their hours (e.g. «صباحي (9-4)») — only append
// times when the name has no digits (e.g. «خفر» → «خفر (20:03-8:07)»).
const shiftLabel = (day: FixedShiftDay) =>
  /\d/.test(day.shiftName)
    ? day.shiftName
    : `${day.shiftName} (${compactTime(day.startTime)}-${compactTime(day.endTime)})`;

/**
 * Compact per-day summary of a fixed weekly pattern: consecutive days on the
 * same shift are grouped into a range — e.g. «الأحد–الأربعاء: صباحي (9-4)»,
 * single days stand alone — «الخميس: خفر (20:03-8:07)».
 */
export function summarizeWeeklyPattern(days: FixedShiftDay[]): string[] {
  if (!days || days.length === 0) {
    return [];
  }

  const sorted = [...days].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const segments: string[] = [];

  let runStart = sorted[0];
  let runEnd = sorted[0];

  const flush = () => {
    const label =
      runStart.dayOfWeek === runEnd.dayOfWeek
        ? WEEK_DAYS_0_SUNDAY[runStart.dayOfWeek]
        : `${WEEK_DAYS_0_SUNDAY[runStart.dayOfWeek]}–${WEEK_DAYS_0_SUNDAY[runEnd.dayOfWeek]}`;
    segments.push(`${label}: ${shiftLabel(runStart)}`);
  };

  for (let i = 1; i < sorted.length; i++) {
    const day = sorted[i];
    const isConsecutiveSameShift =
      day.dayOfWeek === runEnd.dayOfWeek + 1 && day.shiftId === runEnd.shiftId;

    if (isConsecutiveSameShift) {
      runEnd = day;
    } else {
      flush();
      runStart = day;
      runEnd = day;
    }
  }
  flush();

  return segments;
}
