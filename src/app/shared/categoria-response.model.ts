import { Categoria } from "./categoria.model";

export interface CategoriaResponse {
    code: number;
    success: boolean;
    message: string;
    data: Categoria[];
  }
  