export interface WardModel {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  available: number;
  rate: number;
  active: boolean;
  created_by: {
    id: string;
    name: string;
  };
  created_at: string;
}
