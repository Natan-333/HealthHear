import * as yup from 'yup';

export const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  document: yup.string().required('Informe o CPF.'),
  phone: yup
    .string()
    .required('Informe o telefone.')
    .min(14, 'Informe um telefone válido'),
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;