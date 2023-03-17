export interface LocationModel {
  id: string;
  name: string;
  type: string;
  created_at: string;
  created_by: { id: string; name: string };
}
