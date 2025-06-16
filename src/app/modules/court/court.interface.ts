// export type ICourt = {
//   name: string;
//   price: string;

//   image: string;
//   date: Date;
//   startTime: string;
//   endTime: string;
// };

export type ISlot = {
  time: string;
  isAvailable: boolean;
};

export type IAvailableSlot = {
  startDate: Date;
  endDate: Date;
  isEveryday: boolean;
  slots: ISlot[];
};

export type ICourt = {
  name: string;
  image: string;
  price: number;
  address: string;
  slotTime: string;
  availableSlots: IAvailableSlot[];
};
