import dayjs from "dayjs";
export const formattedDate = (dateString: string) => {
  if(dateString)
  return dayjs(dateString).format('YYYY/MM/DD');
}
export const formattedTime = (dateString: string) => {
  if(dateString)
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}