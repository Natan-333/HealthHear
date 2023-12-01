import { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import {
  VStack,
  Text,
  Center,
  Heading,
  ScrollView,
  KeyboardAvoidingView,
  Box,
  useTheme,
  useToast,
  Image,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

// Asset import
import Logo from '@assets/logo.png';

// Validation import
import { signInSchema, SignInFormData } from '@validations/signInSchema'

// Type import 
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

// Util import
import { AppError } from '@utils/AppError';

// Hook import
import { useAuth } from '@hooks/useAuth';

// Component import
import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignIn() {
  // Hook
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { colors, sizes } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({ resolver: yupResolver(signInSchema) });
  const { signIn } = useAuth();
  const toast = useToast();

  // State
  const [passwordIsVisible, setPasswordIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn({ password, email }: SignInFormData) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const title = "Não foi possível realizar login";
      toast.show({ title, placement: 'top', bgColor: 'red.500' });
    } finally {
      setIsLoading(false);
    }
  }

  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const IconComponent = passwordIsVisible ? Eye : EyeSlash;

  <IconComponent
    size={sizes[5]}
    color={colors.gray[500]}
  />

  return (
    <KeyboardAvoidingView behavior={behavior} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} bg='gray.200'>
          <Box bg='white' px={10} pb={10} flex={1} borderBottomRadius={24}>
            <Center mt={20} mb={10}>
              <Image
                source={Logo}
                width={200}
                height={200}
                alt="health hear logo"
              />

              <Text color='gray.700' fontSize='lg' fontFamily='light'>
                Compartilhe sua experiência
              </Text>
            </Center>

            <Center>
              <Heading
                color='blue.400'
                fontSize='sm'
                mb={6}
                fontFamily='regular'
              >
                Acesse sua conta
              </Heading>

              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder='E-mail'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name='password'
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder='Senha'
                    secureTextEntry={passwordIsVisible}
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                    InputRightElement={
                      <TouchableOpacity
                        onPress={() => setPasswordIsVisible((prev) => !prev)}
                      >
                        <IconComponent style={{ marginRight: 10 }} />
                      </TouchableOpacity>
                    }
                  />
                )}
              />

              <Button
                title='Entrar'
                bgColor='blue.400'
                onPress={handleSubmit(handleSignIn)}
                isLoading={isLoading}
              />
            </Center>
          </Box>

          <Center flex={1} p={10}>
            <Text color='black' fontSize='lg' mb={3} fontFamily='regular'>
              Ainda não tem acesso?
            </Text>
            <Button
              disabled={isLoading}
              title='Criar uma conta'
              bgColor='gray.300'
              onPress={() => navigation.navigate('signUp')}
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
