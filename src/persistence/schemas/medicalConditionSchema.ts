import mongoose from 'mongoose';
import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';

const MedicalCondition = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },

    code: {
      type: String,
      required: [true, 'Please enter allergy code'],
      index: true,
      unique: true
    },

    designation: {
      type: String,
      required: [true, 'Please enter designation'],
      index: true,
    },

    description: {
      type: String,
      lowercase: true,
      index: true,
      default: 'No description provided.'
    },

    commonSymptoms: {
      type: String,
      lowercase: true,
      index: true,
      default: 'No Common Symptoms provided.'
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalCondition);
