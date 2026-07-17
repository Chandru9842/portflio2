import { Schema, model, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  themeMode: 'light' | 'dark' | 'system';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
      maxlength: [100, 'Site name cannot exceed 100 characters'],
      default: 'Chandru Portfolio',
    },
    siteDescription: {
      type: String,
      required: [true, 'Site description is required'],
      trim: true,
      maxlength: [300, 'Site description cannot exceed 300 characters'],
    },
    logo: {
      type: String,
      trim: true,
    },
    favicon: {
      type: String,
      trim: true,
    },
    primaryColor: {
      type: String,
      trim: true,
      default: '#6366F1',
    },
    themeMode: {
      type: String,
      enum: {
        values: ['light', 'dark', 'system'],
        message: '{VALUE} is not a valid theme mode',
      },
      default: 'dark',
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
