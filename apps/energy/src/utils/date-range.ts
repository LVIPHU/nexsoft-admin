import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { DateRange } from 'react-day-picker';
import {
  DEFAULT_REPORT_METRICS_FROM_DAYS_AGO,
  DEFAULT_REPORT_METRICS_TO_DAYS_AGO,
} from '@/constants/report-metrics.constant';

dayjs.extend(utc);

export interface DefaultReportMetricsDateRangeOptions {
  fromDaysAgo?: number;
  toDaysAgo?: number;
}

/** Default range ổn định (startOf/endOf day) để query key không đổi khi remount */
export function getDefaultReportMetricsDateRange(
  options?: DefaultReportMetricsDateRangeOptions
): DateRange {
  const fromDaysAgo = options?.fromDaysAgo ?? DEFAULT_REPORT_METRICS_FROM_DAYS_AGO;
  const toDaysAgo = options?.toDaysAgo ?? DEFAULT_REPORT_METRICS_TO_DAYS_AGO;
  return {
    from: dayjs().subtract(fromDaysAgo, 'day').startOf('day').toDate(),
    to: dayjs().subtract(toDaysAgo, 'day').endOf('day').toDate(),
  };
}

/** Chuyển DateRange sang chuỗi ISO UTC cho API report-metrics (startOf/endOf day → query key nhất quán) */
export function toIndexerDateParams(
  range: DateRange | undefined
): { from_date: string; to_date: string } {
  const from_date =
    range?.from != null
      ? dayjs(range.from).utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss') + 'Z'
      : '';
  const to_date =
    range?.to != null
      ? dayjs(range.to).utc().endOf('day').format('YYYY-MM-DDTHH:mm:ss') + 'Z'
      : '';
  return { from_date, to_date };
}
