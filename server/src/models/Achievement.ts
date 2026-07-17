import { Schema, model, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  organization?: string;
  date?: Date;
  icon?: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [100, 'Organization cannot exceed 100 characters'],
    },
    date: {
      type: Date,
    },
    icon: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

AchievementSchema.index({ displayOrder: 1 });

export const Achievement = model<IAchievement>('Achievement', AchievementSchema);
