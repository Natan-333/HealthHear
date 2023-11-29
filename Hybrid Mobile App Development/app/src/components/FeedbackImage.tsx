import { Pressable, Skeleton, VStack, useTheme } from 'native-base';
import { Plus, X } from 'phosphor-react-native';

// Type import
import { IPhoto } from 'src/interfaces/IPhoto';

// Component import
import { ProductSmallPhoto } from '@components/ProductSmallPhoto';

const PHOTO_SIZE = 100;

// Interface 
interface FeedbackImageProps {
  image: IPhoto;
  handleRemovePhoto: (photo: IPhoto) => void;
}

interface FeedbackImageUploadProps {
  onPress: () => Promise<void>;
}

export const FeedbackImage = ({
  image,
  handleRemovePhoto
}: FeedbackImageProps) => (
  <VStack>
    <ProductSmallPhoto
      source={{ uri: image.uri }}
      alt='Foto do produto'
      size={PHOTO_SIZE}
    />
    <Pressable
      w='4'
      h='4'
      rounded='full'
      bg='gray.600'
      alignItems='center'
      justifyContent='center'
      position='absolute'
      top={1}
      right={1}
      onPress={() => handleRemovePhoto(image)}
    >
      <X size={12} color={'white'} />
    </Pressable>
  </VStack>
)

export const FeedbackImageUpload = ({ onPress }: FeedbackImageUploadProps) => {
  // Hook
  const { colors, sizes } = useTheme();

  return (
    <Pressable
      w={100}
      h={100}
      rounded={6}
      bg='gray.300'
      alignItems='center'
      justifyContent='center'
      onPress={onPress}
    >
      <Plus size={sizes[6]} color={colors.gray[400]} />
    </Pressable>
  )
}

export const FeedbackImageLoading = () => (
  <Skeleton
    w={PHOTO_SIZE}
    h={PHOTO_SIZE}
    rounded={6}
    startColor='gray.500'
    endColor='gray.400'
  />
)