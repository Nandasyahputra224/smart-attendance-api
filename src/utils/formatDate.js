import { format } from "date-fns";

export const formatDate = (date) =>
  format(new Date(date), "dd MMM yyyy, HH:mm");

export const getWIBTime = () => {
  const now = new Date();
  const wibTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );

  return {
    now,
    hours: wibTime.getHours(),
    minutes: wibTime.getMinutes(),
  };
};
