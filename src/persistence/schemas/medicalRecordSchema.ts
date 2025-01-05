import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';
import { Allergy } from './allergySchema';
import { MedicalCondition } from './medicalConditionSchema';
const uuid = require('uuid').v4; // Added by JRT

export const MedicalRecordSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    patient: { type: String, unique: true },
    allergies: { type: [Allergy], required: false }, // Use the schema here
    conditions: { type: [MedicalCondition], required: false }, // Use the schema here
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', MedicalRecordSchema);
