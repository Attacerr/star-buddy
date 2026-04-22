import mongoose, { Schema, Document } from "mongoose";

interface ISSLocationDoc extends Document {
  latitude: number;
  longitude: number;
  timestamp: number;
  createdAt: Date;
}

const issLocationSchema = new Schema<ISSLocationDoc>(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ISSLocation = mongoose.model<ISSLocationDoc>("ISSLocation", issLocationSchema);
