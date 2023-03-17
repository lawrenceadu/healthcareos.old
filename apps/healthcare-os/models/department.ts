export interface DepartmentModel {
  id: string;
  name: string;
  description: string;
  head: {
    id: string;
    name: string;
  };
  created_by: {
    id: string;
    name: string;
  };
  created_at: string;
}
