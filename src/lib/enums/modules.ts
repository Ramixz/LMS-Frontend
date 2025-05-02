import moment from "moment";
export const MODULES = [
    "DASHBOARD",
    "VISUALIZATION",
    "ALERT",
    "USER",
    "ROLES",
    "CORRELATION",
    "CONNECTOR",
    "REPORTS",
    "CONTACT",
    "NOTIFICATIONCHANNEL"
  ] as const;
  
  export const ALL_MODULES = MODULES.reduce(
    (acc, permission) => {
      acc[permission] = permission;
      return acc;
    },
    {} as Record<(typeof MODULES)[number], (typeof MODULES)[number]>,
  );
export function toLocalFormattedDate(createdOn: any) {
    const dateStr = typeof createdOn === 'object' && createdOn?.$date ? createdOn.$date : createdOn;
    const stillUtc = moment.utc(dateStr).toDate();
    return moment(stillUtc).local().format('LLL');
}
  