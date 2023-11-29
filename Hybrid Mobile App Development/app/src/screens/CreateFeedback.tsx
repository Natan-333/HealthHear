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
import { IProduct } from 'src/interfaces/IProduct';
import { api } from '@services/api';

// Component import
import {
  FeedbackImage,
  FeedbackImageLoading,
  FeedbackImageUpload
} from '@components/index';

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

  const params = route.params as IProduct;

  // State
  const [images, setImages] = useState<IPhoto[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState<string>('');
  const [price, setPrice] = useState('');
  const [acceptTrade, setAcceptTrade] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethods[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [headerTitle, setHeaderTitle] = useState('Criar feedback');

  async function handlePhotoSelect() {
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
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${String(uuid.v4())}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        return setImages((prev) => [photoFile, ...prev]);
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

  function handleRemovePhoto(photo: IPhoto) {
    setImages(prev => prev.filter((item) => {
      if (
        item.name === photo.name &&
        photo.uri.match(`${api.defaults.baseURL}/images/`)
      ) {
        setImagesToDelete((prev) => [...prev, photo.name]);
      }
      return item.name !== photo.name;
    })
    );
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

    if (images.length <= 0)
      return toast.show({ ...defaultToastProps, title: 'Adicione uma foto.' });

    if (name.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe o título.' });

    if (description.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe a descrição' });

    const rawPrice = Number(maskedPriceToNumber(price)) * 100;

    if (paymentMethods.length <= 0) {
      return toast.show({
        title: 'Informe ao menos um método de pagamento.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    navigate('previewAd', {
      user,
      product_images: images,
      name,
      description,
      is_new: isNew === 'Produto novo',
      price: rawPrice,
      accept_trade: acceptTrade,
      payment_methods: paymentMethods,
      imagesToDelete: imagesToDelete,
      id: params?.id,
      is_active: isActive,
    });
  }

  useEffect(() => {
    if (params) {
      setImages(params.product_images);
      setName(params.name);
      setDescription(params.description);
      setIsNew(params.is_new ? 'Produto novo' : 'Produto usado');
      setPrice(toMaskedPrice(String(params.price)));
      setAcceptTrade(params.accept_trade);
      setPaymentMethods(params.payment_methods);
      setIsActive(params?.is_active ?? true);
      setImagesToDelete([]);
      setHeaderTitle('Editar anúncio');
    }
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
        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={1}>
          Imagens
        </Text>

        <Text color='gray.500' fontFamily='regular' fontSize='sm'>
          Selecione uma imagem para expressar sua crítica, denúncia ou elogio.
        </Text>

        <FlatList
          data={images}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <FeedbackImage image={item} handleRemovePhoto={handleRemovePhoto} />
          )}
          ListHeaderComponent={photoIsLoading ? <FeedbackImageLoading /> : null}
          ListFooterComponent={
            images.length < 1 && !photoIsLoading ?
              <FeedbackImageUpload onPress={handlePhotoSelect} /> :
              null
          }
          contentContainerStyle={{ paddingVertical: sizes[6], gap: 8 }}
          horizontal
        />

        <Text color='gray.600' fontFamily='bold' fontSize='md' mb='3'>
          Comece sua avaliação
        </Text>

        <Input
          placeholder='Título'
          value={name}
          onChangeText={setName}
        />

        <Input
          placeholder='Mais detalhes...'
          value={description}
          onChangeText={setDescription}
          minH='20'
          h='auto'
          multiline
          textAlignVertical="top"
        />

        <Radio
          data={['Produto novo', 'Produto usado']}
          name='Estado do produto'
          accessibilityLabel='Escolha o estado do produto'
          value={isNew}
          onChange={(newValue) => {
            setIsNew(newValue);
          }}
        />

        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
          Venda
        </Text>

        <Input
          leftElement={
            <Text color='gray.700' fontFamily='regular' fontSize='md' ml='4'>
              R$
            </Text>
          }
          placeholder='Valor do produto'
          value={price}
          onChangeText={(text) => {
            if (text === '0,0' || text === '0,') {
              setPrice('');
              return;
            }

            const firstMaskedText = toMaskedPrice(text);
            const firstMaskedTextConvertToNumber =
              maskedPriceToNumber(firstMaskedText);
            const cleanMaskedText = toMaskedPrice(
              firstMaskedTextConvertToNumber
            );
            setPrice(cleanMaskedText);
          }}
        />

        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
          Deseja manter o comentário anônimo?
        </Text>

        <Switch
          size='md'
          alignSelf='flex-start'
          offTrackColor='gray.300'
          onTrackColor='blue.400'
          isChecked={acceptTrade}
          onToggle={setAcceptTrade}
        />

        <Text fontSize='md' fontFamily='bold' color='gray.600' mt={6} mb={3}>
          Meios de pagamento aceitos
        </Text>
        <Checkbox
          value='boleto'
          isChecked={findPaymentMethod('boleto')}
          onChange={() => {
            handlePaymentMethods('boleto');
          }}
          label={'Boleto'}
        />
        <Checkbox
          value='pix'
          isChecked={findPaymentMethod('pix')}
          onChange={() => {
            handlePaymentMethods('pix');
          }}
          label='Pix'
        />
        <Checkbox
          value='cash'
          isChecked={findPaymentMethod('cash')}
          onChange={() => {
            handlePaymentMethods('cash');
          }}
          label='Dinheiro'
        />
        <Checkbox
          value='card'
          isChecked={findPaymentMethod('card')}
          onChange={() => {
            handlePaymentMethods('card');
          }}
          label='Cartão de Crédito'
        />
        <Checkbox
          value='deposit'
          isChecked={findPaymentMethod('deposit')}
          onChange={() => {
            handlePaymentMethods('deposit');
          }}
          label='Deposito Bancário'
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
