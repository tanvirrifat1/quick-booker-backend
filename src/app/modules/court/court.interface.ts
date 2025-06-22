export type IAvailableSlot = {
  [date: string]: {
    time: string;
    isAvailable: boolean;
  }[];
};

export type ICourt = {
  name: string;
  image: string;
  price: number;
  address: string;
  slotTime: string;
  availableSlots: IAvailableSlot[];
  isDeleted: boolean;
};
