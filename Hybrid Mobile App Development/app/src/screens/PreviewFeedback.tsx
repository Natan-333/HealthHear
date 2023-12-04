import { Button } from '@components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { HStack, Text, VStack, useTheme, useToast } from 'native-base';
import { ArrowLeft, Tag } from 'phosphor-react-native';
import { api } from '@services/api';
import { useState } from 'react';
import { AppError } from '@utils/AppError';
import { IFeedback } from 'src/interfaces/IFeedback';
import { useAuth } from '@hooks/useAuth';
import { Feedbacks } from '@components/Feedbacks';

export function PreviewFeedback() {
  const { colors, sizes } = useTheme();
  const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();
  const { fetchUserFeedback } = useAuth();

  const params = route.params as IFeedback & { imagesToDelete: string[] };

  const [isLoading, setIsLoading] = useState(false);

  function handleGoBack() {
    goBack();
  }

  async function createDocument(){
    setIsLoading(true);

    const { data: registro } = await api.post('/registros/findOrCreate', {
      numero: params.registro.numero,
      uf: params.registro.uf,
      tipoRegistro: params.registro.tipoRegistro,
      idUsuario: params.registro.usuario?.id,
      idEspecialidades: [],
    });

    console.log('Criando registro: ', registro)

    return registro;
  }

  async function createFeedback(idRegistro: number){
    setIsLoading(true);

    if(!idRegistro) return null;

    const { data: feedback } = await api.post('/feedbacks', {
      titulo: params.titulo,
      descricao: params.descricao,
      data: params.data,
      nota: params.nota,
      idPaciente: params.paciente.id,
      idRegistro,
      isAnonimo: params.isAnonimo,
      acao: params.acao,
      imagem: params.imagem,
      tipo: params.tipo,
    });

    console.log('Criando feedback', feedback);

    return feedback;
  }

  async function handlePublish() {
    try {
      const responseRegistro = await createDocument();
      console.log('Response registro: ', responseRegistro);
  
      if (responseRegistro) await createFeedback(responseRegistro.id);
  
      await fetchUserFeedback();
      navigate('homeTabs');

    } catch (error) {

      console.error('Erro no handlePublish:', error)

      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível cadastrar o seu feedback. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <VStack safeAreaTop bg='blue.400' alignItems='center' p='4'>
        <Text fontFamily='bold' fontSize='md' color='gray.100'>
          Pré visualização do feedback
        </Text>
        <Text fontFamily='regular' fontSize='sm' color='gray.100'>
          É assim que seu feedback vai aparecer!
        </Text>
      </VStack>

      <Feedbacks isFirst {...params} />

      <HStack w='full' safeAreaBottom bg='white' p='3' px='6'>
        <Button
          title='Voltar e editar'
          flex={1}
          bgColor='gray.300'
          marginRight={2}
          leftIcon={<ArrowLeft size={sizes[4]} color={colors.gray[600]} />}
          onPress={handleGoBack}
          disabled={isLoading}
        />
        <Button
          title='Publicar'
          flex={1}
          bgColor='blue.400'
          leftIcon={<Tag size={sizes[4]} color={colors.gray[200]} />}
          marginLeft={2}
          onPress={handlePublish}
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
}
