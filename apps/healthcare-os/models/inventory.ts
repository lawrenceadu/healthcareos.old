import { SupplierModel } from './supplier';
import { LocationModel } from './location';
import { UserModel } from './user';

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

export interface ItemPurchaseModel {
  id: string;
  supplier: SupplierModel;
  date: string;
  details: {
    id: string;
    item: ItemModel;
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

export interface ItemIssueModel {
  id: string;
  issue_to: 'user' | 'department' | 'location';
  recipient: {
    id: string;
    name: string;
  };
  location: LocationModel;
  date: string;
  details: {
    id: string;
    item: ItemModel;
    quantity: number;
  }[];
  notes: string;
  status: 'pending' | 'rejected' | 'fulfilled' | 'returned';
  attachment: string;
  returned_by: string;
  returned_at: string;
  created_by: UserModel;
  created_at: string;
}

export interface ItemAdjustmentModel {
  id: string;
  reference: string;
  reason: string;
  location: LocationModel;
  date: string;
  details: { id: string; item: ItemModel; quantity: number }[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  attachment: string;
  created_by: UserModel;
  created_at: string;
}

export interface ItemTransferModel {
  id: string;
  from_location: LocationModel;
  to_location: LocationModel;
  date: string;
  details: { id: string; item: ItemModel; quantity: number }[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  attachment: string;
  created_by: UserModel;
  created_at: string;
}

export interface ItemInventoryModel {
  id: string;
  category: ItemCategoryModel;
  name: string;
  quantity: number;
  locations: {
    id: string;
    name: string;
    quantity: number;
  }[];
}
