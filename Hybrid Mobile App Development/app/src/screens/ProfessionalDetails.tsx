import { Box, Pressable, HStack, ScrollView, Text, VStack, useTheme, useToast } from 'native-base';
import { api } from '@services/api';
import { IDocument } from '../interfaces/IDocument';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';
import { UserPhoto } from '@components/UserPhoto';
import { ArrowLeft, Star } from 'phosphor-react-native';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { Dimensions, FlatList } from 'react-native';
import { formatDocument } from '@utils/Formats';
import { IFeedback } from 'src/interfaces/IFeedback';
import { Feedbacks } from '@components/Feedbacks';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function ProfessionalDetails() {

  const { colors, sizes } = useTheme();
  const { width } = Dimensions.get('screen');

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  type ParamsProps = {
    id: string;
  };

  const route = useRoute();

  const params = route.params as ParamsProps;

  const [registro, setRegistro] = useState<IDocument>({} as IDocument);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([] as IFeedback[]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  async function fetchData() {
    try {
      setIsLoading(true);

      const registrosResponse = await api.get(`/registros/${params.id}`);
      setRegistro(registrosResponse.data);

      const feedbacksResponse = await api.get(`/registros/feedbacks/${params.id}`);
      setFeedbacks(feedbacksResponse.data.content);

      console.log(feedbacks)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o profissional. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const hasData =
    isLoading && Array.isArray(feedbacks) && feedbacks?.length >= 1;

  return (
    <VStack safeAreaTop>
      <HStack w='full' alignItems='center' justifyContent='center' px='6'>
        <Pressable
          position='absolute'
          left={0}
          ml='6'
          onPress={() => navigate('homeTabs')}
        >
          <ArrowLeft size={sizes[6]} color={colors.gray[700]} />
        </Pressable>

        <Text color='gray.600' fontFamily='bold' fontSize='lg+'>
          Detalhes do registro
        </Text>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false} >
        {isLoading && <Loading />}

        <VStack py={5} px={5}>
          <Box style={{ position: 'relative' }} display={'flex'} alignItems={'center'}>
            <UserPhoto
              source={
                !registro.usuario?.imagem
                  ? defaultUserPhotoImg
                  : { uri: registro.usuario.imagem }
              }
              alt={`Imagem de ${registro.usuario?.nome}`}
              size={150}
              mt={5}
            />

            <Box
              bg={'blue.700'}
              rounded='full'
              px='2'
              alignItems='center'
              justifyContent='center'
              h='7'
              style={{ position: 'absolute', left: (width - 170), top: 30, display: 'flex', gap: 5, flexDirection: 'row' }}
            >
              <Star size={15} weight="fill" color={colors.yellow[500]} />
              <Text fontSize='lg' fontFamily='bold' color='white'>
                4.9
              </Text>
            </Box>
          </Box>

          <Text fontSize='xl' fontFamily='bold' color='gray.900' textAlign={'center'} mt={5}>
            {registro.usuario ? registro.usuario?.nome : formatDocument(registro.numero, registro.uf, registro.tipoRegistro)}
          </Text>

          <Text fontSize='lg' fontFamily='bold' color='gray.500' textAlign={'center'} noOfLines={1} mt={2}>
            {registro.usuario && formatDocument(registro.numero, registro.uf, registro.tipoRegistro)}
          </Text>


          {hasData && feedbacks.map((feedback, index) => (
            <React.Fragment>
              <Text color='gray.700' fontSize='md' fontFamily='bold' mb='2'>
                Feedbacks do {registro.tipoRegistro}
              </Text>

              <Feedbacks
                key={feedback.id}
                isFirst={index === 0}
                {...feedback}
              />
            </React.Fragment>
          ))}

          {!hasData && !isLoading && (
            <Text>O especialista não possui feedback</Text>
          )}
        </VStack>

      </ScrollView>
    </VStack>
  );
}
