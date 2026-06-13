export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  description?: string;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  description?: string;
}
