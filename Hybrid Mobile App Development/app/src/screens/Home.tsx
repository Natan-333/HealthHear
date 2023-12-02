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
  ArrowRight,
  MagnifyingGlass,
  Faders,
  Chats,
} from 'phosphor-react-native';
import { Input } from '@components/Input';
import { Professionals } from '@components/Professionals';
import { Modalize } from 'react-native-modalize';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';
import { IFeedback } from 'src/interfaces/IFeedback';
import { Loading } from '@components/Loading';
import { Feedbacks } from '@components/Feedbacks';
import { IDocument } from 'src/interfaces/IDocument';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

const PHOTO_SIZE = 12;

export function Home() {
  const { colors } = useTheme();
  const { user, updateUserProfile, fetchUserFeedback, userFeedbacks } = useAuth();
  const toast = useToast();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();

  const modalizeRef = useRef<Modalize>(null);

  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([] as IFeedback[]);
  const [professionals, setProfessionals] = useState<IDocument[]>([] as IDocument[]);
  const [search, setSearch] = useState('');
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenModalize() {
    modalizeRef.current?.open();
  }

  function handleCloseModalize() {
    modalizeRef.current?.close();
  }

  function handleOpenCreateFeedback() {
    // Ajustar lógica
    // {
    //   user.id ?
    //   (navigate('CreateFeedback')) :
    //   (navigateAuth('signIn'))
    // };
    navigate('CreateFeedback')
  }

  function handleNavigateToFeedbacks() {
    userFeedbacks.length > 0 ? (
      navigateTabs('myFeedbacks')
    ) : handleOpenCreateFeedback()
  }

  async function fetchUserData() {
    try {
      setIsFetchLoading(true);

      await updateUserProfile();
      await fetchUserFeedback();

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
    const fetchData = async () => {
      try {
        const feedbacksData = await api.get('/feedbacks');
        setFeedbacks(feedbacksData.data.content);
        console.log(feedbacksData.data.content.slice(0, 4))

        const registros = await api.get('/registros');

        console.log(registros.data.content)
        setProfessionals(registros.data.content)

        setIsLoading(true)

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView flex={1} px='6' pb={4} mt={10}>
      <HStack w='full' mt='2'>
        <UserPhoto
          source={
            !user?.imagem
              ? defaultUserPhotoImg
              : { uri: user.imagem }
          }
          alt='Foto do usuário'
          borderWidth={2}
          size={PHOTO_SIZE}
        />

        <VStack flex={1} justifyContent='center' px='2'>
          <Text color='gray.700' fontSize='md' fontFamily='regular'>
            Boas vindas,
          </Text>
          <Text color='gray.700' fontSize='md' fontFamily='bold'>
            {user.nome ? user.nome : 'paciente'}
          </Text>
        </VStack>

        <Button
          flex={1}
          title='Criar feedback'
          bgColor='blue.700'
          leftIcon={<Plus size={16} color={colors.gray[200]} />}
          onPress={handleOpenCreateFeedback}
        />
      </HStack>

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Seus feedbacks anteriores
      </Text>

      {isFetchLoading && userFeedbacks?.length <= 0 ? (
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
          onPress={handleNavigateToFeedbacks}
        >
          <Chats size={22} color={colors.blue[700]} />

          <VStack flex={1} justifyContent='center' px='2'>
            {userFeedbacks.length > 0 ? (
              <>
                <Text color='gray.600' fontSize='lg+' fontFamily='bold'>
                  {userFeedbacks.length}
                </Text>
                <Text color='gray.600' fontSize='xs' fontFamily='regular'>
                  Feedbacks relevantes
                </Text>
              </>
            ) : (
              <>
                <Text color='gray.600' fontSize='md' fontFamily='bold'>
                  Nenhum feedback
                </Text>
                <Text color='gray.600' fontSize='xs' fontFamily='regular'>
                  Compartilhe seu relato e ajude outros pacientes!
                </Text>
              </>
            )}

          </VStack>

          <Text
            color='blue.700'
            fontSize='xs'
            fontFamily='bold'
            marginRight='2'
          >
            {userFeedbacks.length > 0 ? 'Meus feedbacks' : 'Novo feedback'}
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
        onSubmitEditing={() => {}}
        returnKeyType='search'
        InputRightElement={
          <HStack w='16' marginRight={4}>
            <Flex direction='row'>
              <Pressable flex={1} onPress={() => {}}>
                <MagnifyingGlass size={20} color={colors.gray[600]} />
              </Pressable>

              <Divider bg='gray.400' orientation='vertical' />

              <Pressable
                flex={1}
                alignItems='flex-end'
                onPress={() => {}}
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
          data={professionals}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Professionals {...item} />}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            gap: 15
          }}
          contentContainerStyle={
            professionals.length <= 0 && {
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

      <Text color='gray.600' fontSize='md' fontFamily='bold' mt='7' mb='2'>
        Feedbacks relevantes
      </Text>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => <Feedbacks {...item} isFirst={index == 0} />}
          mt={2}
          ListEmptyComponent={
            <Text
              color='gray.500'
              fontSize='sm'
              fontFamily='regular'
              mt='6'
              mb='2'
            >
              Nenhum feedback encontrado!
            </Text>
          }
        />
      )}
    </ScrollView>
  );
}
