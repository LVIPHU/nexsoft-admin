import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { DateRange } from 'react-day-picker';

dayjs.extend(utc);

/** Chuyển DateRange sang chuỗi ISO UTC cho API report-metrics */
export function toIndexerDateParams(
  range: DateRange | undefined
): { from_date: string; to_date: string } {
  const from_date =
    range?.from != null ? dayjs(range.from).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' : '';
  const to_date =
    range?.to != null ? dayjs(range.to).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' : '';
  return { from_date, to_date };
}
