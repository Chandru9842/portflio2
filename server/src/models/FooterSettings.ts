import { Schema, model, Document } from 'mongoose';

interface IQuickLink {
  label: string;
  href: string;
}

export interface IFooterSettings extends Document {
  description: string;
  copyrightText: string;
  showAdminLogin: boolean;
  quickLinks: IQuickLink[];
  createdAt: Date;
  updatedAt: Date;
}

const QuickLinkSchema = new Schema<IQuickLink>({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  href: {
    type: String,
    required: true,
    trim: true,
  }
}, { _id: false });

const FooterSettingsSchema = new Schema<IFooterSettings>(
  {
    description: {
      type: String,
      required: [true, 'Footer description is required'],
      trim: true,
      maxlength: [200, 'Footer description cannot exceed 200 characters'],
    },
    copyrightText: {
      type: String,
      required: [true, 'Copyright text is required'],
      trim: true,
    },
    showAdminLogin: {
      type: Boolean,
      default: true,
    },
    quickLinks: {
      type: [QuickLinkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const FooterSettings = model<IFooterSettings>('FooterSettings', FooterSettingsSchema);
