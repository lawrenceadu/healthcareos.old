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
