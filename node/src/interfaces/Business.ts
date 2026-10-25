export interface Business {
  id?: number;
  state_id?: number;
  state?: string;
  category_id: number;
  category?: string;
  user_id: number;
  user?: string;
  name: string;
  slug?: string;
  email: string;
  phone_number: string;
  address: string;
  logo: string;
  location: string;
  description: string;
  date?: string;
}
