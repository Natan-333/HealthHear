import { useRef, useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Center,
  Heading,
  ScrollView,
  KeyboardAvoidingView,
  Box,
  Skeleton,
  useTheme,
  Button as NativeButton,
  useToast,
  Image,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PencilSimpleLine, Eye, EyeSlash } from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';

// Asset import
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

// Validation import
import { signUpSchema, SignUpFormData } from '@validations/signUpSchema';

// Component import
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { UserPhoto } from '@components/UserPhoto';

// Util import
import { toMaskedPhone, toMaskedCPF } from '@utils/Masks';
import { AppError } from '@utils/AppError';

// Service import
import { api } from '@services/api';

// Hook import
import { useAuth } from '@hooks/useAuth';
import { TextInput } from 'react-native-gesture-handler';

type PhotoProps = {
  name: string;
  uri: string;
  type: string;
};

const PHOTO_SIZE = 20;

export function SignUp() {
  // Hook
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  // State
  const [photo, setPhoto] = useState<PhotoProps>({} as PhotoProps);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => navigation.goBack();

  async function handleSignUp(data: SignUpFormData) {
    try {
      setIsLoading(true);

      const { name, password, email, phone } = data;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('tel', phone);
      formData.append('password', password);
      if (!!photo.uri) formData.append('avatar', photo as any);

      await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as FileSystem.FileInfo & { size?: number };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          setPhoto({} as PhotoProps);
          return toast.show({
            title: 'Essa Imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${String(uuid.v4())}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        setPhoto(photoFile);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível utilizar a foto. Tente novamente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setPhotoIsLoading(false);
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
        <VStack flex={1} px={10} pb={10}>
          <Center mt={12} mb={6}>
            <Heading color='blue.400' fontFamily='bold' fontSize='lg+'>
              Boas vindas!
            </Heading>

            <Text
              color='gray.600'
              fontFamily='regular'
              textAlign='center'
              marginTop="3"
            >
              Compartilhe suas experiências com profissionais de saúde. Suas críticas e elogios ajudam a comunidade!
            </Text>
          </Center>

          <Center flex={1}>
            <Box mb={6}>
              {photoIsLoading ? (
                <Skeleton
                  w={PHOTO_SIZE}
                  h={PHOTO_SIZE}
                  rounded='full'
                  startColor='gray.500'
                  endColor='gray.400'
                />
              ) : (
                <UserPhoto
                  source={
                    !!photo.uri ? { uri: photo.uri } : defaultUserPhotoImg
                  }
                  alt='Foto do usuário'
                  size={PHOTO_SIZE}
                />
              )}

              <NativeButton
                bg='blue.400'
                w='10'
                h='10'
                rounded='full'
                _pressed={{ bg: 'blue.300' }}
                alignItems='center'
                justifyContent='center'
                position='absolute'
                right={-10}
                bottom={0}
                onPress={handleUserPhotoSelect}
              >
                <PencilSimpleLine size={sizes[4]} color={colors.gray[200]} />
              </NativeButton>
            </Box>

            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Nome'
                  value={value}
                  autoCorrect={false}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='document'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='CPF'
                  value={value}
                  onChangeText={(text) => onChange(toMaskedCPF(text))}
                  errorMessage={errors.document?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='phone'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Telefone'
                  keyboardType='phone-pad'
                  value={value}
                  onChangeText={(text) => onChange(toMaskedPhone(text))}
                  errorMessage={errors.phone?.message}
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
              mt={3}
              title='Criar'
              bgColor='blue.400'
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>

          <Center flex={1} py={10}>
            <Text color='black' fontSize='lg' mb={3} fontFamily='regular'>
              Já tem uma conta?
            </Text>
            <Button
              title='Ir para o login'
              bgColor='gray.300'
              onPress={handleGoBack}
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
