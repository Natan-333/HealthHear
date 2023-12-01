import {
  Box,
  Pressable,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { Dimensions } from 'react-native';
import { UserPhoto } from './UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { formatDocument } from '@utils/Formats';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { IDocument } from 'src/interfaces/IDocument';
import { Star} from 'phosphor-react-native';

const { width } = Dimensions.get('screen');
const MARGIN_BETWEEN = 15;
const PADDING_sCREEN = 10;
const CARD_WIDTH = (width / 2) - MARGIN_BETWEEN - (PADDING_sCREEN * 2);

const PHOTO_SIZE = CARD_WIDTH - 50;

export function Professionals({ 
  id, 
  numero, 
  tipoRegistro, 
  uf, 
  usuario, 
  especialidades 
}: IDocument) {

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const { colors } = useTheme();


  function handleNavigateToProfessionalDetails() {
    // const professionalId: string = user.id as string;
    // navigate('professionalDetails', { id: professionalId });
  }

  return (
    <Pressable onPress={handleNavigateToProfessionalDetails}>
      <VStack>
        <VStack>
          <Box
            bg={'gray.100'}
            rounded='sm'
            px='4'
            py='3'
            alignItems='center'
            justifyContent='center'
            width={CARD_WIDTH}
          >
            <Box style={{position: 'relative'}}>
              <UserPhoto
                source={
                  !usuario?.imagem
                    ? defaultUserPhotoImg
                    : { uri: usuario.imagem }
                }
                alt={`Imagem de ${usuario?.nome}`}
                size={PHOTO_SIZE}
              />

            <Box
              bg={'blue.700'}
              rounded='full'
              px='2'
              alignItems='center'
              justifyContent='center'
              h='4'
              style={{position: 'absolute', right: -15, top: 0, display: 'flex', gap: 5, flexDirection: 'row'}}
            >
              <Star size={10} weight="fill" color={colors.yellow[500]}/>
              <Text fontSize='xs' fontFamily='bold' color='white'>    
                4.9
              </Text>
            </Box>

            </Box>
            
            <Text fontSize='lg' fontFamily='bold' color='gray.900' noOfLines={1} mt={2}>
              {usuario?.nome}
            </Text>

            {especialidades.length > 0 && (
              <Text fontSize='md' fontFamily='regular' color='gray.600'>
                {especialidades[0]?.nome}
              </Text>
            )}

            <Text fontSize='xs' fontFamily='regular' color='gray.500' mt={2}>
              {formatDocument(numero, uf, tipoRegistro)}
            </Text>
          </Box>
        </VStack>
      </VStack>
    </Pressable>
  );
}
