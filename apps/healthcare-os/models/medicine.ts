import { PatientModel } from './patient';

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
}

export interface MedicineStockModel {
  id: string;
  supplier: { id: string; name: string };
  date: string;
  details: {
    id: string;
    medicine: { id: string; name: string };
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
  created_by: { id: string; name: string };
  location: { id: string; name: string };
  created_at: string;
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
    administration_time: string[];
    medicine: MedicineModel;
  }[];
  created_by: { id: string; name: string };
  created_at: string;
}
