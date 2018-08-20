import Timeago from 'timeago.js';

import {i18n} from './lang';

let localDict = (_number: number, index: number, _sec: number): string[] => {
  return [
    [i18n.TIMEAGO_JUST_NOW, i18n.TIMEAGO_A_WHILE],
    [i18n.TIMEAGO_SECONDS_AGO, i18n.TIMEAGO_IN_SECONDS],
    [i18n.TIMEAGO_1_MINUTE_AGO, i18n.TIMEAGO_IN_1_MINUTE],
    [i18n.TIMEAGO_MINUTES_AGO, i18n.TIMEAGO_IN_MINUTES],
    [i18n.TIMEAGO_1_HOUR_AGO, i18n.TIMEAGO_IN_1_HOUR],
    [i18n.TIMEAGO_HOURS_AGO, i18n.TIMEAGO_IN_HOURS],
    [i18n.TIMEAGO_1_DAY_AGO, i18n.TIMEAGO_IN_1_DAY],
    [i18n.TIMEAGO_DAYS_AGO, i18n.TIMEAGO_IN_DAYS],
    [i18n.TIMEAGO_1_WEEK_AGO, i18n.TIMEAGO_IN_1_WEEK],
    [i18n.TIMEAGO_WEEKS_AGO, i18n.TIMEAGO_IN_WEEKS],
    [i18n.TIMEAGO_1_MONTH_AGO, i18n.TIMEAGO_IN_1_MONTH],
    [i18n.TIMEAGO_MONTHS_AGO, i18n.TIMEAGO_IN_MONTHS],
    [i18n.TIMEAGO_1_YEAR_AGO, i18n.TIMEAGO_IN_1_YEAR],
    [i18n.TIMEAGO_YEARS_AGO, i18n.TIMEAGO_IN_YEARS],
  ][index];
};

Timeago.register('local', localDict);

const timeago = Timeago();

type TDate = Date | string | number;

export function formatAsTimeAgo(datetime: TDate): string {
  return timeago.format(datetime, 'local');
}

export function formatWhenTimeAgo(date: Date, before: Date): string {
  if (before.getTime() > date.getTime()) {
    return formatAsTimeAgo(date);
  }

  function fillZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  let hour = fillZero(date.getHours());
  let minute = fillZero(date.getMinutes());
  let second = fillZero(date.getSeconds());

  return `${hour}:${minute}:${second}`;
}

export function formatWhenDayAgo(dateString: string): string {
  let now = new Date();

  now.setHours(0, 0, 0, 0);

  let date = new Date(dateString);

  return formatWhenTimeAgo(date, now);
}
