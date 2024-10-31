import { addDays, setHours, setMinutes } from "date-fns";

export const createSentenceCase = (val: string) => {
  return val[0].toUpperCase() + val.slice(1);
};

type NotificationPayload = {
  title: string;
  body: string;
  icon?: string;
};

export type ContractorSlotType = {
  id: string;
  availability: number[];
  startHour: number;
  endHour: number;
};

export const handleNotification = (payload: NotificationPayload) => {
  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon,
  });

  notification.onclick = () => {
    console.log("Notification clicked");
  };
};

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = [];

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    if (hour < endHour - 1) {
      slots.push(`${hour}:30`);
    }
  }
  return slots;
};

export const getNextAvailableDates = (
  contractor: ContractorSlotType,
  count: number
) => {
  const dates = [];
  let currentDate = new Date();
  while (dates.length < count) {
    if (contractor.availability.includes(currentDate.getDay())) {
      const timeSlots = generateTimeSlots(
        contractor.startHour,
        contractor.endHour
      );
      const randomSlot =
        timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const [hours, minutes] = randomSlot.split(":").map(Number);
      const availableDate = setMinutes(setHours(currentDate, hours), minutes);
      dates.push(availableDate);
    }
    currentDate = addDays(currentDate, 1);
  }
  return dates;
};
