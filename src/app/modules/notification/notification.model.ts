import { model, Schema } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    text: {
      type: String,
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    assignCampId: {
      type: Schema.Types.ObjectId,
      ref: 'CampaignForInfluencer',
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema,
);
