
// Add this to the Template interface if it's not already there
export interface Template {
  id: number;
  name: string;
  description?: string;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
  department_id?: number;
  sub_department_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

// And update the DepartmentName type to be more flexible
export type DepartmentName = 'Convention Centre' | 'Exhibition Centre' | 'Theatre' | 'IT' | 'Darling Harbor Theatre' | string;
export type DepartmentColor = 'blue' | 'green' | 'red' | 'purple' | 'sky';
