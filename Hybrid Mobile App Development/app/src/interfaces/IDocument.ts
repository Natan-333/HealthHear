import { ISpecialty } from './ISpecialty';
import { IUser } from './IUser';

export interface IDocument {
  id: number | null;
  numero: string;
  tipoRegistro: string;
  uf: string;
  usuario: IUser | null;
  especialidades: ISpecialty[] | [];
}
