import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  fullName: string;
  professionalTitle: string;
  shortBio: string;
  about: string;
  email: string;
  phone?: string;
  location: string;
  profileImage?: string;
  resumeUrl?: string;
  availabilityStatus: 'available' | 'busy' | 'not-seeking';
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    professionalTitle: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    shortBio: {
      type: String,
      required: [true, 'Short bio is required'],
      trim: true,
      maxlength: [300, 'Short bio cannot exceed 300 characters'],
    },
    about: {
      type: String,
      required: [true, 'About text is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    availabilityStatus: {
      type: String,
      enum: {
        values: ['available', 'busy', 'not-seeking'],
        message: '{VALUE} is not a valid status',
      },
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = model<IProfile>('Profile', ProfileSchema);
