import * as yup from 'yup';

export const signUpSchema = yup.object({
  nome: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o email').email('E-mail inválido.'),
  senha: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  cpf: yup.string().required('Informe o CPF')
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;