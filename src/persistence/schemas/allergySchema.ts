import { IAllergyPersistence } from '../../dataschema/IAllergyPersistence';
import mongoose from 'mongoose';

const Allergy = new mongoose.Schema(
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
  },
  { timestamps: true },
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', Allergy);
