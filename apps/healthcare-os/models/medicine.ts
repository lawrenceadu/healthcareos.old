import { SupplierModel } from './supplier';
import { LocationModel } from './location';
import { PatientModel } from './patient';
import { UserModel } from './user';

export interface MedicineCategoryModel {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface MedicineModel {
  id: string;
  category: MedicineCategoryModel;
  name: string;
  code: string;
  group: string;
  description: string;
  unit: string;
  cost_price: number;
  regular_price: number;
  nhis_price: number;
  private_price: number;
  quantity: number;
  minimum_level: number;
  reorder_level: number;
  stocks: { batch_no: string; expiry_date: string; quantity: number }[];
}

export interface MedicinePurchaseModel {
  id: string;
  supplier: SupplierModel;
  date: string;
  details: {
    id: string;
    medicine: MedicineModel;
    batch_no: string;
    expiry_date: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    discount: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  notes: string;
  status: 'pending' | 'ordered' | 'received';
  created_by: UserModel;
  location: LocationModel;
  created_at: string;
}

export interface MedicineAdjustmentModel {
  id: string;
  reference: string;
  reason: string;
  location: LocationModel;
  date: string;
  details: {
    id: string;
    medicine: MedicineModel;
    quantity: number;
    batch_no: string;
    expiry_date: string;
  }[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  attachment: string;
  created_by: UserModel;
  created_at: string;
}

export interface MedicineTransferModel {
  id: string;
  from_location: LocationModel;
  to_location: LocationModel;
  date: string;
  details: {
    id: string;
    medicine: MedicineModel;
    quantity: number;
    batch_no: string;
    expiry_date: string;
  }[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  attachment: string;
  created_by: UserModel;
  created_at: string;
}

export interface MedicineInventoryModel {
  id: string;
  category: MedicineCategoryModel;
  name: string;
  quantity: number;
  locations: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

export interface PrescriptionModel {
  id: string;
  notes: string;
  patient: PatientModel;
  medicines: {
    dose: string;
    unit: string;
    route: string;
    schedule: string;
    start_date: string;
    stop_date: string;
    notes: string;
    administration_time: string[];
    medicine: MedicineModel;
  }[];
  status: string;
  created_by: UserModel;
  created_at: string;
}
