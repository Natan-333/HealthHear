import React from 'react';
import { HStack, Text, VStack, useTheme } from 'native-base';
import { Plus } from 'phosphor-react-native';

// Component import
import { UserPhoto } from '@components/UserPhoto';
import { Button } from '@components/Button';

// Hook import
import { useAuth } from "@hooks/useAuth";

const PHOTO_SIZE = 12;

interface Props {
  createFeedback(): void;
}

export function HomeHeader({ createFeedback }: Props) {
  // Hook
  const { user } = useAuth();
  const { colors, sizes } = useTheme();

  return (
    <HStack w='full' mt='2'>
      {!!user?.id && (
        <UserPhoto
          source={{ uri: user.imagem }}
          alt='Foto do usuário autenticado'
          borderWidth={2}
          size={PHOTO_SIZE}
        />
      )}

      <VStack flex={1} justifyContent='center' px='2'>
        {!!user?.id && (
          <React.Fragment>
            <Text color='gray.700' fontSize='md' fontFamily='regular'>
              Boas vindas,
            </Text>

            <Text color='gray.700' fontSize='md' fontFamily='bold'>
              {user.nome}
            </Text>
          </React.Fragment>
        )}
      </VStack>

      <Button
        flex={0.9}
        title='Criar feedback'
        bgColor='blue.700'
        leftIcon={<Plus size={16} color={colors.gray[200]} />}
        onPress={createFeedback}
      />
    </HStack>
  )
}