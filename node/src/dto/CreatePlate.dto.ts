export interface CreatePlateDto {
  plates_category_id: number;
  business_id: number;
  name: string;
  ingredients: string;
  price: number;
  file: File;
}
