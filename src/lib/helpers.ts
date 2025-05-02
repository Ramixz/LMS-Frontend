import moment from "moment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toLocalFormattedDate(createdOn: any) {
  const dateStr =
    typeof createdOn === "object" && createdOn?.$date ? createdOn.$date : createdOn;
  const stillUtc = moment.utc(dateStr).toDate();
  const localMoment = moment(stillUtc).local();

  const formattedDate = localMoment.format("MMMM D, YYYY");
  const formattedTime = localMoment.format("h:mm A");

  return { date: formattedDate, time: formattedTime };
}
