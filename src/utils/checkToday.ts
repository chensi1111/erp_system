import dayjs from "dayjs";
export const checkToday = (dateString: string) => {
  return dayjs(dateString).isSame(dayjs(), 'day');
}