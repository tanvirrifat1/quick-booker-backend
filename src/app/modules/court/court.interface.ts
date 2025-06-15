export type ICourt = {
  name: string;
  price: string;
  location: {
    type: { type: String; enum: ['Point']; default: 'Point' };
    coordinates: [number, number];
  };
  image: string;
  date: Date;
  startTime: string;
  endTime: string;
};
