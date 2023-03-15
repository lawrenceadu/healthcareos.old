export interface ItemCategoryModel {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface ItemModel {
  id: string;
  category: ItemCategoryModel;
  name: string;
  code: string;
  group: string;
  description: string;
  unit: string;
  quantity: number;
  minimum_level: number;
  reorder_level: number;
}

export interface ItemStockModel {
  id: string;
  supplier: { id: string; name: string };
  date: string;
  details: {
    id: string;
    item: { id: string; name: string };
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
