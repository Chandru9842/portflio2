import { Schema, model, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Tools' | 'Core CS';
  icon?: string;
  proficiencyLabel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [60, 'Skill name cannot exceed 60 characters'],
    },
    category: {
      type: String,
      enum: {
        values: ['Languages', 'Frontend', 'Backend', 'Databases', 'Tools', 'Core CS'],
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Category is required'],
    },
    icon: {
      type: String,
      trim: true,
    },
    proficiencyLabel: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        message: '{VALUE} is not a valid proficiency level',
      },
      default: 'Advanced',
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

// Indexing on category and displayOrder for fast rendering queries
SkillSchema.index({ category: 1, displayOrder: 1 });

export const Skill = model<ISkill>('Skill', SkillSchema);
