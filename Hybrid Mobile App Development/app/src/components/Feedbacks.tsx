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

type Props = IFeedback & {
    isFirst: boolean;
};

export function Feedbacks({
    data,
    titulo,
    descricao,
    nota,
    paciente,
    registro,
    isAnonimo,
    isFirst }: Props) {

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
                    {!isFirst && (<Divider w={CARD_WIDTH - 50} mx={'auto'} />)}
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
                                !paciente.imagem || isAnonimo
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
                                    {isAnonimo ? 'Anônimo' : paciente.nome}
                                </Text>

                                <Text fontSize='sm' fontFamily='regular' color='gray.500' noOfLines={1}>
                                    {formatDate(data.toLocaleString())}
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

                                <Box display={'flex'} flexDir={'row'} style={{ gap: 3 }}>
                                    <Text fontSize='sm' fontFamily='regular' color='gray.600' mb={0}>
                                        sobre
                                    </Text>

                                    <Text fontSize='sm' fontFamily='bold' color='gray.600' mb={0}>
                                        {formatDocument(registro.numero, registro.uf, registro.tipoRegistro)}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>

                        <Text fontSize='md' fontFamily='bold' color='gray.600' mt={2} lineHeight={'lg'} w={BOX_TEXT_WIDTH}>
                            {titulo}
                        </Text>

                        <Text fontSize='sm' fontFamily='heading' color='gray.500' lineHeight={'md'} w={BOX_TEXT_WIDTH}>
                            {descricao}
                        </Text>
                    </Pressable>
                </VStack>
            </VStack>
        </Pressable>
    );
}
