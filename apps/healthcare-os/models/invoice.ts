import { DepartmentModel } from './department';
import { PatientModel } from './patient';

export interface InvoiceModel {
  id: string;
  discount: number;
  notes: string;
  paid_by: { id: string; name: string };
  status: string;
  subtotal: number;
  total: number;
  created_at: string;
  created_by: { id: string; name: string };
  reference: string;
  readonly: boolean;
  patient: PatientModel;
  details: {
    charge: ChargeModel;
    department: DepartmentModel;
    description: string;
    id: string;
    quantity: number;
    total: number;
    unit_price: number;
  }[];
}

export interface ChargeModel {
  id: string;
  name: string;
  type: string;
  nhis_price: number;
  regular_price: number;
  private_price: number;
  created_at: string;
  created_by: {
    id: string;
    name: string;
  };
}
