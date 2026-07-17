import { Schema, model, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  location: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description: string[];
  technologies: string[];
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
      maxlength: [100, 'Role title cannot exceed 100 characters'],
    },
    employmentType: {
      type: String,
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
        message: '{VALUE} is not a valid employment type',
      },
      default: 'Full-time',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: [String],
      required: [true, 'Description bullet points are required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'Must provide at least one description point',
      },
    },
    technologies: {
      type: [String],
      default: [],
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

ExperienceSchema.index({ displayOrder: 1, startDate: -1 });

export const Experience = model<IExperience>('Experience', ExperienceSchema);
