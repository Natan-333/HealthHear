import React, { } from 'react';
import {
  Pressable,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import {
  ArrowRight,
  Chats,
} from 'phosphor-react-native';
import { Dimensions } from 'react-native';

interface Props {
  navigate(): void;
  userFeedbacksCount: number;
}

export function MyFeedbacksCard({
  navigate,
  userFeedbacksCount
}: Props) {
  // Hook
  const { colors } = useTheme();

  return (
    <Pressable
      p='4'
      bg='blue.400:alpha.10'
      rounded={6}
      alignItems='center'
      flexDirection='row'
      onPress={navigate}
    >
      <Chats size={22} color={colors.blue[700]} />

      <VStack flex={1} justifyContent='center' px='2'>
        {userFeedbacksCount > 0 ? (
          <React.Fragment>
            <Text color='gray.600' fontSize='lg+' fontFamily='bold'>
              {userFeedbacksCount}
            </Text>

            <Text color='gray.600' fontSize='xs' fontFamily='regular'>
              Feedbacks relevantes
            </Text>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Text color='gray.600' fontSize='md' fontFamily='bold'>
              Nenhum feedback
            </Text>

            <Text color='gray.600' fontSize='xs' fontFamily='regular'>
              Compartilhe seu relato!
            </Text>
          </React.Fragment>
        )}

      </VStack>

      <Text
        color='blue.700'
        fontSize='xs'
        fontFamily='bold'
        marginRight='2'
      >
        {userFeedbacksCount > 0 ? 'Meus feedbacks' : 'Novo feedback'}
      </Text>
      <ArrowRight size={16} color={colors.blue[700]} />
    </Pressable>
  )
}