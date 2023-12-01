import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { Radio } from '@components/Radio';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { maskedPriceToNumber, toMaskedPrice } from '@utils/Masks';
import {
  Center,
  FlatList,
  HStack,
  IToastProps,
  Pressable,
  ScrollView,
  Skeleton,
  Switch,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base';
import { ArrowLeft, Plus, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { AppError } from '@utils/AppError';
import { ProductSmallPhoto } from '@components/ProductSmallPhoto';
import { useAuth } from '@hooks/useAuth';
import { IPhoto } from 'src/interfaces/IPhoto';
import { IPaymentMethods } from 'src/interfaces/IPaymentMethods';
import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';
import { api } from '@services/api';

// Component import
import {
  FeedbackImage,
  FeedbackImageUpload
} from '@components/index';

import { Select } from '@components/Select';
import { Rate } from '@components/Rate';

// Data import
import { feedbackTypes } from '../data/feedbackTypes';
import { documentTypes } from '../data/documentTypes';
import { uf as ufValues } from '../data/uf';

// Types import
import { IFeedback } from '../interfaces/IFeedback';

const PHOTO_SIZE = 100;

export function CreateFeedback() {
  // Hook
  const { colors, sizes } = useTheme();
  const { user } = useAuth();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();
  const toast = useToast();
  const route = useRoute();

  const params = route.params as IFeedback;

  // State
  const [tipo, setTipo] = useState('elogio');
  const [image, setImage] = useState<IPhoto | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [acao, setAcao] = useState('');
  const [acceptTrade, setAcceptTrade] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethods[]>([]);
  const [headerTitle, setHeaderTitle] = useState('Criar feedback');
  const [tipoRegistro, setTipoRegistro] = useState('CRM');
  const [registro, setRegistro] = useState('');
  const [UF, setUF] = useState('SP');
  const [nota, setNota] = useState(0);
  const [anonimo, setAnonimo] = useState(false)

  async function handlePhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      if (photoSelected.assets[0].uri) {
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${String(uuid.v4())}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        return setImage(photoFile);
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
    } 
  }

  function handleRemovePhoto(photo: IPhoto) {
    setImage(null);
  }

  function findPaymentMethod(payment_method: IPaymentMethods) {
    return paymentMethods.includes(payment_method);
  }

  function handlePaymentMethods(payment_method: IPaymentMethods) {
    const existMethod = findPaymentMethod(payment_method);

    if (existMethod)
      return setPaymentMethods(prev => prev.filter((item) =>
        item !== payment_method)
      );

    return setPaymentMethods((prev) => [...prev, payment_method]);
  }

  function handleNavigateToAdPreview() {
    const defaultToastProps: IToastProps = {
      placement: "top",
      bgColor: 'red.500'
    }

    if (image == null)
      return toast.show({ ...defaultToastProps, title: 'Adicione uma foto.' });

    if (titulo.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe o título.' });

    if (descricao.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe a descrição' });

    if (paymentMethods.length <= 0) {
      return toast.show({
        title: 'Informe ao menos um método de pagamento.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    // navigate('previewAd', {
    //   user,
    //   product_images: image,
    //   name,
    //   description,
    //   is_new: isNew === 'Produto novo',
    //   price: rawPrice,
    //   accept_trade: acceptTrade,
    //   payment_methods: paymentMethods,
    //   imagesToDelete: imagesToDelete,
    //   id: params?.id,
    //   is_active: isActive,
    // });
  }

  useEffect(() => {
    // if (params) {
    //   setImage(params.evidencia);
    //   setName(params.name);
    //   setDescription(params.description);
    //   setIsNew(params.is_new ? 'Produto novo' : 'Produto usado');
    //   setPrice(toMaskedPrice(String(params.price)));
    //   setAcceptTrade(params.accept_trade);
    //   setPaymentMethods(params.payment_methods);
    //   setIsActive(params?.is_active ?? true);
    //   setImagesToDelete([]);
    //   setHeaderTitle('Editar anúncio');
    // }
  }, [params]);

  return (
    <VStack flex={1} safeAreaTop>
      <HStack w='full' alignItems='center' justifyContent='center' px='6'>
        <Pressable
          position='absolute'
          left={0}
          ml='6'
          onPress={() => navigateTabs('myAds')}
        >
          <ArrowLeft size={sizes[6]} color={colors.gray[700]} />
        </Pressable>

        <Text color='gray.700' fontFamily='bold' fontSize='lg+'>
          {headerTitle}
        </Text>
      </HStack>

      <ScrollView px='6' contentContainerStyle={{ paddingBottom: 20 }}>

        <Text color='gray.600' fontFamily='bold' fontSize='lg' mt={5} mb={2}>
          Construa sua avaliação
        </Text>

        <Text color='gray.500' fontFamily='regular' fontSize='md' mt={2} mb={1}>
          Tipo de avaliação
        </Text>

        <Select
          items={feedbackTypes}
          selectedValue={tipo}
          onValueChange={value => setTipo(value)}
        />

        <Text color='gray.500' fontFamily='regular' fontSize='md' mt={2} mb={1}>
          Título
        </Text>

        <Input
          placeholder='Resumo de sua avaliação'
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text color='gray.500' fontFamily='regular' fontSize='md' mb={1}>
          Descrição
        </Text>

        <Input
          placeholder='Descreva seu relato com mais detalhes'
          value={descricao}
          onChangeText={setDescricao}
          minH='20'
          h='auto'
          multiline
          textAlignVertical="top"
        />

        {/* Uma ação só será tomada se for uma avaliação ruim, ou seja, uma denúncia ou reclamação */}
        {tipo !== 'elogio' && (
          <>
            <Text color='gray.500' fontFamily='regular' fontSize='md' mt={2} mb={1}>
              Ação tomada
            </Text>

            <Input
              placeholder='O que você fez em relação a isso?'
              value={acao}
              onChangeText={setAcao}
            />
          </>
        )}

        <Text color='gray.600' fontFamily='bold' fontSize='lg' mt={4} mb={1}>
          Evidência
        </Text>

        <Text color='gray.500' fontFamily='regular' fontSize='md' mb={2}>
          Selecione uma imagem para dar mais credibilidade a sua crítica, denúncia ou elogio.
        </Text>

        {image
          ?
          (<FeedbackImage image={image} handleRemovePhoto={handleRemovePhoto} />)
          :
          (<FeedbackImageUpload onPress={handlePhotoSelect} />)
        }

        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
          Profissional avaliado
        </Text>

        <Text color='gray.500' fontFamily='regular' fontSize='md' mb={2}>
          Tipo de registro
        </Text>

        <Select 
          items={documentTypes}
          selectedValue={tipoRegistro}
          onValueChange={value => setTipoRegistro(value)}
        />

        <Text color='gray.500' fontFamily='regular' fontSize='md' mb={2}>
          {tipoRegistro}
        </Text>

        <Input
          placeholder={`Digite o ${tipoRegistro} do profissional`}
          value={registro}
          onChangeText={setRegistro}
        />

        <Text color='gray.500' fontFamily='regular' fontSize='md' mb={2}>
          UF
        </Text>

        <Select 
          items={ufValues} 
          selectedValue={UF}
          onValueChange={value => setUF(value)}
        />

        {/* Se é uma denúncia, não faz sentido dar uma nota ao profissional. */}
        {tipo !== 'denuncia' && (
          <>
            <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
              Nota
            </Text>
            <Rate value={nota} setValue={setNota} />
          </>
        )}

        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
          Deseja manter o comentário anônimo?
        </Text>

        <Switch
          size='md'
          alignSelf='flex-start'
          offTrackColor='gray.300'
          onTrackColor='blue.400'
          isChecked={anonimo}
          onToggle={setAnonimo}
        />

      </ScrollView>

      <HStack w='full' safeAreaBottom bg='white' p='3' px='6'>
        <Button
          title='Cancelar'
          flex={1}
          bgColor='gray.300'
          marginRight={2}
          onPress={() => navigateTabs('myAds')}
        />

        <Button
          title='Avançar'
          flex={1}
          bgColor='gray.700'
          marginLeft={2}
          onPress={handleNavigateToAdPreview}
        />
      </HStack>
    </VStack>
  );
}
