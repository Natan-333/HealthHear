import { ISpecialty } from './ISpecialty';
import { IUser } from './IUser';

export interface IDocument {
  id: number;
  numero: string;
  tipoRegistro: string;
  uf: string;
  usuario: IUser;
  especialidades: ISpecialty[];
}
