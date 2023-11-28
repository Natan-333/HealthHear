import * as yup from 'yup';

export const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
});

export type SignInFormData = yup.InferType<typeof signInSchema>;
