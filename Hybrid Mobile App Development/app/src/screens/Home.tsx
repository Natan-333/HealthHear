import { useCallback, useEffect, useRef, useState } from 'react';
import { UserPhoto } from '@components/UserPhoto';
import {
  Divider,
  FlatList,
  Flex,
  HStack,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import { Button } from '@components/Button';
import {
  Plus,
  Tag,
  ArrowRight,
  MagnifyingGlass,
  Faders,
  X,
  Chats,
} from 'phosphor-react-native';
import { Input } from '@components/Input';
import { Professionals } from '@components/Professionals';
import { Modalize } from 'react-native-modalize';
import { Dimensions } from 'react-native';
import { Portal } from 'react-native-portalize';
import { TagButton } from '@components/TagButton';
import { Checkbox } from '@components/Checkbox';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';
import { ProductDTO } from '@dtos/ProductDTO';
import { ProductMap } from '@mappers/ProductMap';
import { IFeedback } from 'src/interfaces/IFeedback';
import { IPaymentMethods } from 'src/interfaces/IPaymentMethods';
import { Loading } from '@components/Loading';
import { Feedbacks } from '@components/Feedbacks';

const PHOTO_SIZE = 12;
const { height } = Dimensions.get('screen');

export function Home() {
  const { colors, sizes } = useTheme();
  const { user, updateUserProfile } =
    useAuth();
  const toast = useToast();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();

  const modalizeRef = useRef<Modalize>(null);

  const [data, setData] = useState<IFeedback[]>([] as IFeedback[]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethods[]>([]);
  const [acceptTrade, setAcceptTrade] = useState<boolean | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const professionalsExample = [
		{
      "id": 1,
      "numero": "123456",
      "tipoRegistro": "CRM",
      "uf": "SP",
      "usuario": {
        "id": 3,
        "nome": "Stanley Bittar",
        "email": "stanley@hotmail.com",
        "cpf": "43101167873",
        "imagem": "https://istoe.com.br/wp-content/uploads/2022/07/stanley-bittar.jpg?x55394"
      },
      "especialidades": [
        {
          "id": 1,
          "nome": "Neurologia"
        }
      ]
    },
    {
      "id": 2,
      "numero": "123456",
      "tipoRegistro": "CRM",
      "uf": "SP",
      "usuario": {
        "id": 3,
        "nome": "Stanley Bittar",
        "email": "stanley@hotmail.com",
        "cpf": "43101167873",
        "imagem": "https://istoe.com.br/wp-content/uploads/2022/07/stanley-bittar.jpg?x55394"
      },
      "especialidades": [
        {
          "id": 1,
          "nome": "Neurologia"
        }
      ]
    },
	]

  const examplesFeedbacks = [
    {
      "id": 1,
      "data": "2023-02-22T00:00:00.000+00:00",
      "titulo": "Muito bom médico",
      "descricao": "Foi atencioso durante sua consulta e me atendeu da melhor forma.",
      "nota": 5,
      "paciente": {
        "id": 1,
        "nome": "Kaue Caponero",
        "email": "kaue@hotmail.com",
        "cpf": "43101167876",
        "imagem": "https://avatars.githubusercontent.com/u/111543330?v=4"
      },
      "registro": {
        "id": 2,
        "numero": "123456",
        "tipoRegistro": "CRM",
        "uf": "SP",
        "usuario": {
          "id": 3,
          "nome": "Stanley Bittar",
          "email": "stanley@hotmail.com",
          "cpf": "43101167873",
          "imagem": "https://istoe.com.br/wp-content/uploads/2022/07/stanley-bittar.jpg?x55394"
        },
        "especialidades": [
          {
            "id": 1,
            "nome": "Neurologia"
          }
        ]
      },
      "isAnonimo": false,
      "acao": null,
      "imagem": null,
      "tipo": "elogio"
    }
  ]

  function handleOpenModalize() {
    modalizeRef.current?.open();
  }

  function handleCloseModalize() {
    modalizeRef.current?.close();
  }

  function handleOpenCreateFeedback() {
    navigate('CreateFeedback');
  }

  function handleNavigateToMyAds() {
    navigateTabs('myAds');
  }

  // function countActiveFeedbacks() {
  //   let activeAds = userProducts.map((item) => item.is_active === true);
  //   return activeAds.length;
  // }

  const userProducts = [];


  function findPaymentMethod(payment_method: IPaymentMethods) {
    return paymentMethods.includes(payment_method);
  }

  function handlePaymentMethods(payment_method: IPaymentMethods) {
    const existMethod = findPaymentMethod(payment_method);

    if (existMethod) {
      setPaymentMethods((prev) =>
        prev.filter((item) => item !== payment_method)
      );
    } else {
      setPaymentMethods((prev) => [...prev, payment_method]);
    }
  }

  function handleResetFilters() {
    setPaymentMethods([]);
    setIsNew(null);
    setAcceptTrade(null);
  }

  function handleIsNew(value: boolean) {
    if (isNew !== value) {
      setIsNew(value);
    } else {
      setIsNew(null);
    }
  }

  async function fetchFilteredProducts() {
    // try {
    //   handleCloseModalize();

    //   setIsLoading(true);
    //   let filter = `?query=${search}`;

    //   if (isNew !== null) {
    //     filter += `&is_new=${isNew}`;
    //   }
    //   if (acceptTrade !== null) {
    //     filter += `&accept_trade=${acceptTrade}`;
    //   }
    //   if (paymentMethods.length > 0) {
    //     filter += `&payment_methods=${JSON.stringify(paymentMethods)}`;
    //   }
    //   console.log('filtro:', filter);

    //   const { data } = await api.get(`/products${filter}`);
    //   setData(data.map((item: ProductDTO) => ProductMap.toIFeedback(item)));
    // } catch (error) {
    //   const isAppError = error instanceof AppError;
    //   const title = isAppError
    //     ? error.message
    //     : 'Não foi possível carregar o anúncio. Tente novamente mais tarde.';

    //   toast.show({
    //     title,
    //     placement: 'top',
    //     bgColor: 'red.500',
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }

  async function fetchUserData() {
    try {
      setIsFetchLoading(true);

      await updateUserProfile();

      // await fetchUserProducts();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar seus dados. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsFetchLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  return (
    <ScrollView flex={1} px='6' pb={4} mt={10}>
      <HStack w='full' mt='2'>
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
            source={{ uri: user.imagem }}
            alt='Foto do usuário'
            borderWidth={2}
            size={PHOTO_SIZE}
          />
        )}

        <VStack flex={1} justifyContent='center' px='2'>
          <Text color='gray.700' fontSize='md' fontFamily='regular'>
            Boas vindas,
          </Text>
          <Text color='gray.700' fontSize='md' fontFamily='bold'>
            {user.nome}
          </Text>
        </VStack>

        <Button
          flex={1}
          title='Criar feedback'
          bgColor='gray.700'
          leftIcon={<Plus size={16} color={colors.gray[200]} />}
          onPress={handleOpenCreateFeedback}
        />
      </HStack>

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Seus feedbacks anteriores
      </Text>

      {isFetchLoading && userProducts?.length <= 0 ? (
        <Skeleton
          w='full'
          h={16}
          rounded={6}
          startColor='gray.500'
          endColor='gray.400'
        />
      ) : (
        <Pressable
          p='4'
          bg='blue.400:alpha.10'
          rounded={6}
          alignItems='center'
          flexDirection='row'
          onPress={handleNavigateToMyAds}
        >
          <Chats size={22} color={colors.blue[700]} />

          <VStack flex={1} justifyContent='center' px='2'>
            <Text color='gray.600' fontSize='lg+' fontFamily='bold'>
              {/* {countActiveFeedbacks()} */}
              2
            </Text>
            <Text color='gray.600' fontSize='xs' fontFamily='regular'>
              Feedbacks relevantes
            </Text>
          </VStack>

          <Text
            color='blue.700'
            fontSize='xs'
            fontFamily='bold'
            marginRight='2'
          >
            Meus feedbacks
          </Text>

          <ArrowRight size={16} color={colors.blue[700]} />
        </Pressable>
      )}

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Procure por profissionais
      </Text>

      <Input
        placeholder='Buscar'
        autoComplete='off'
        autoCorrect={false}
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={fetchFilteredProducts}
        returnKeyType='search'
        InputRightElement={
          <HStack w='16' marginRight={4}>
            <Flex direction='row'>
              <Pressable flex={1} onPress={fetchFilteredProducts}>
                <MagnifyingGlass size={20} color={colors.gray[600]} />
              </Pressable>

              <Divider bg='gray.400' orientation='vertical' />

              <Pressable
                flex={1}
                alignItems='flex-end'
                onPress={handleOpenModalize}
              >
                <Faders size={20} color={colors.gray[600]} />
              </Pressable>
            </Flex>
          </HStack>
        }
      />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={professionalsExample}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Professionals {...item} />}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            gap: 15
          }}
          contentContainerStyle={
            data.length <= 0 && {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              color='gray.500'
              fontSize='sm'
              fontFamily='regular'
              mt='6'
              mb='2'
            >
              Nenhum profissional encontrado!
            </Text>
          }
        />
      )}

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={height - height * 0.1}
          modalHeight={height - height * 0.1}
          avoidKeyboardLikeIOS
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          handlePosition='inside'
          HeaderComponent={
            <HStack mt='10' alignItems='center' justifyContent='space-between'>
              <Text fontFamily='bold' fontSize='lg+' color='gray.700'>
                Filtrar feedbacks
              </Text>

              <Pressable px='4' onPress={handleCloseModalize}>
                <X size={25} color={colors.gray[400]} />
              </Pressable>
            </HStack>
          }
          modalStyle={{
            backgroundColor: colors.gray[200],
            paddingHorizontal: sizes[6],
          }}
        >
          <VStack flex={1}>
            <Text
              fontSize='sm'
              fontFamily='bold'
              color='gray.600'
              mt={6}
              mb={3}
            >
              Condição
            </Text>
            <HStack>
              <TagButton
                title='NOVO'
                checked={isNew === true}
                onPress={() => handleIsNew(true)}
              />
              <TagButton
                title='USADO'
                checked={isNew === false}
                onPress={() => handleIsNew(false)}
              />
            </HStack>

            <Text
              fontSize='sm'
              fontFamily='bold'
              color='gray.600'
              mt={6}
              mb={3}
            >
              Meios de pagamento aceitos
            </Text>
            <Checkbox
              isChecked={findPaymentMethod('boleto')}
              value='boleto'
              onChange={() => {
                handlePaymentMethods('boleto');
              }}
              label={'Boleto'}
            />
            <Checkbox
              isChecked={findPaymentMethod('pix')}
              value='pix'
              label='Pix'
              onChange={() => {
                handlePaymentMethods('pix');
              }}
            />
            <Checkbox
              isChecked={findPaymentMethod('cash')}
              value='cash'
              label='Dinheiro'
              onChange={() => {
                handlePaymentMethods('cash');
              }}
            />
            <Checkbox
              isChecked={findPaymentMethod('card')}
              value='card'
              label='Cartão de Crédito'
              onChange={() => {
                handlePaymentMethods('card');
              }}
            />

            <Checkbox
              isChecked={findPaymentMethod('deposit')}
              value='deposit'
              label='Deposito Bancário'
              onChange={() => {
                handlePaymentMethods('deposit');
              }}
            />

            <HStack my={10}>
              <Button
                onPress={handleResetFilters}
                title='Resetar filtros'
                bgColor='gray.300'
                flex={1}
                marginRight={2}
              />
              <Button
                onPress={fetchFilteredProducts}
                title='Aplicar filtros'
                bgColor='gray.700'
                flex={1}
                marginLeft={2}
              />
            </HStack>
          </VStack>
        </Modalize>
      </Portal>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={examplesFeedbacks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Feedbacks {...item} />}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            gap: 15
          }}
          contentContainerStyle={
            data.length <= 0 && {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              color='gray.500'
              fontSize='sm'
              fontFamily='regular'
              mt='6'
              mb='2'
            >
              Nenhum profissional encontrado!
            </Text>
          }
        />
      )}
    </ScrollView>
  );
}
