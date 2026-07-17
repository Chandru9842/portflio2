import { Schema, model, Document } from 'mongoose';

export interface ICertificate extends Document {
  name: string;
  issuer: string;
  issueDate: Date;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    name: {
      type: String,
      required: [true, 'Certificate name is required'],
      trim: true,
      maxlength: [120, 'Certificate name cannot exceed 120 characters'],
    },
    issuer: {
      type: String,
      required: [true, 'Issuer name is required'],
      trim: true,
      maxlength: [100, 'Issuer name cannot exceed 100 characters'],
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
    image: {
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

CertificateSchema.index({ displayOrder: 1, issueDate: -1 });

export const Certificate = model<ICertificate>('Certificate', CertificateSchema);
