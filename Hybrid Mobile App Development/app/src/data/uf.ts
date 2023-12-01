import { ISelectItemProps } from 'native-base';

export const uf: ISelectItemProps[] = [
    'SP', 'RJ', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SE', 'TO'
  ].map((uf) => ({ label: uf, value: uf }));