import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import {
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
import { ArrowLeft } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';
import { IPhoto } from 'src/interfaces/IPhoto';
import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';

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
import { format } from 'date-fns';

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
  const [imagem, setImagem] = useState<IPhoto | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [acao, setAcao] = useState('');
  const [tipoRegistro, setTipoRegistro] = useState('CRM');
  const [registro, setRegistro] = useState('');
  const [UF, setUF] = useState('SP');
  const [nota, setNota] = useState(0);
  const [anonimo, setAnonimo] = useState(false)

  const data = format(new Date(), 'yyyy-MM-dd');

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

        return setImagem(photoFile);
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

  function handleRemovePhoto() {
    setImagem(null);
  }

  function handleNavigateToFeedbackPreview() {
    const defaultToastProps: IToastProps = {
      placement: "top",
      bgColor: 'red.500'
    }

    if (titulo.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe o título.' });

    if (descricao.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe a descrição' });

    if (registro.trim() === '')
      return toast.show({ ...defaultToastProps, title: `Informe o ${tipoRegistro}` });

    if (UF.trim() === '')
      return toast.show({ ...defaultToastProps, title: 'Informe a UF' });

    navigate('previewFeedback', {
      id: null,
      data,
      titulo,
      descricao,
      nota,
      paciente: user,
      registro: {
        id: null,
        numero: registro,
        tipoRegistro,
        uf: UF,
        usuario: null,
        especialidades: []
      },
      isAnonimo: anonimo,
      acao,
      imagem: imagem?.uri || '',
      tipo
    });
  }

  useEffect(() => {
    if (params) {
      setTipo(params.tipo || tipo);
      // setImagem(params.imagem || imagem);
      setTitulo(params.titulo);
      setDescricao(params.descricao );
      setAcao(params.acao || acao);
      setTipoRegistro(params.registro.tipoRegistro);
      setRegistro(params.registro.numero || registro);
      setUF(params.registro.uf || UF);
      setNota(params.nota || nota);
      setAnonimo(params.isAnonimo !== undefined ? params.isAnonimo : anonimo);
    }
  }, [params]);

  return (
    <VStack flex={1} safeAreaTop>
      <HStack w='full' alignItems='center' justifyContent='center' px='6'>
        <Pressable
          position='absolute'
          left={0}
          ml='6'
          onPress={() => navigateTabs('myFeedbacks')}
        >
          <ArrowLeft size={sizes[6]} color={colors.gray[700]} />
        </Pressable>

        <Text color='gray.700' fontFamily='bold' fontSize='lg+'>
          Criar feedback
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

        {imagem
          ?
          (<FeedbackImage image={imagem} handleRemovePhoto={handleRemovePhoto} />)
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
          onPress={() => navigateTabs('myFeedbacks')}
        />

        <Button
          title='Avançar'
          flex={1}
          bgColor='gray.700'
          marginLeft={2}
          onPress={handleNavigateToFeedbackPreview}
        />
      </HStack>
    </VStack>
  );
}
