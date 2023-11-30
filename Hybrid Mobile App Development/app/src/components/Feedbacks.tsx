import {
    Box,
    Divider,
    Pressable,
    Text,
    useTheme,
    VStack,
} from 'native-base';
import { Dimensions } from 'react-native';
import { UserPhoto } from './UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { formatDate, formatDocument } from '@utils/Formats';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Star } from 'phosphor-react-native';
import { IFeedback } from 'src/interfaces/IFeedback';

const { width } = Dimensions.get('screen');

const GAP = 15;

const PHOTO_SIZE = 55;

const CARD_WIDTH = width - 55;
const BOX_TEXT_WIDTH = CARD_WIDTH - PHOTO_SIZE - GAP;


export function Feedbacks({
    id,
    data,
    titulo,
    descricao,
    nota,
    paciente,
    registro,
    isAnonimo,
    acao,
    imagem,
    tipo }: IFeedback) {

    const { navigate } = useNavigation<AppNavigatorRoutesProps>();

    const { colors } = useTheme();


    function handleNavigateToFeedbackDetails() {
        // const professionalId: string = user.id as string;
        // navigate('professionalDetails', { id: professionalId });
    }

    return (
        <Pressable onPress={handleNavigateToFeedbackDetails}>
            <VStack>
                <VStack>
                    <Divider mt={7} w={CARD_WIDTH - 50} mx={'auto'} />
                    <Pressable
                        py='4'
                        width={CARD_WIDTH}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            columnGap: GAP,
                            rowGap: 5
                        }}
                    >
                        <UserPhoto
                            source={
                                !paciente.imagem
                                    ? defaultUserPhotoImg
                                    : { uri: paciente.imagem }
                            }
                            alt={`Imagem de ${paciente.nome}`}
                            size={PHOTO_SIZE}
                        />
                        <Box
                            w={BOX_TEXT_WIDTH}
                            h={PHOTO_SIZE}
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                w={BOX_TEXT_WIDTH}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: GAP,
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Text fontSize='lg' fontFamily='bold' color='gray.900' noOfLines={1}>
                                    {paciente.nome}
                                </Text>

                                <Text fontSize='sm' fontFamily='regular' color='gray.500' noOfLines={1}>
                                    {formatDate(data)}
                                </Text>
                            </Box>

                            <Box
                                w={BOX_TEXT_WIDTH}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: GAP,
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box
                                    style={{
                                        display: 'flex',
                                        gap: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text fontSize='xl' fontFamily='bold' color='gray.600'>
                                        {nota}
                                    </Text>
                                    <Star size={20} weight="fill" color={colors.yellow[500]} />
                                </Box>

                                <Text fontSize='sm' fontFamily='bold' color='gray.600' mb={0}>
                                    avaliando {formatDocument(registro.numero, registro.uf, registro.tipoRegistro)}
                                </Text>
                            </Box>
                        </Box>

                        <Text fontSize='md' fontFamily='bold' color='gray.600' mt={2} lineHeight={'lg'}>
                            {titulo}
                        </Text>

                        <Text fontSize='sm' fontFamily='medium' color='gray.500' lineHeight={'md'}>
                            {descricao}
                        </Text>
                    </Pressable>
                    <Divider mb={7} w={CARD_WIDTH - 50} mx={'auto'} />
                </VStack>
            </VStack>
        </Pressable>
    );
    
}
