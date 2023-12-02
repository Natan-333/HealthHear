import React, { } from 'react';
import {
  Divider,
  Flex,
  HStack,
  Pressable,
  Text,
  useTheme,
} from 'native-base';
import {
  MagnifyingGlass,
  Faders,
} from 'phosphor-react-native';
import { Input } from '@components/Input';
import { Dimensions } from 'react-native';

interface Props {
  value: string;
  onChange(value: string): void;
  onSearch(): void;
  handleOpenFilter(): void;
}

export function SearchInput({
  value,
  onSearch,
  handleOpenFilter,
  onChange
}: Props) {
  // Hook 
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Procure por profissionais
      </Text>

      <Input
        placeholder='Buscar'
        autoComplete='off'
        autoCorrect={false}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSearch}
        returnKeyType='search'
        InputRightElement={
          <HStack w='16' marginRight={4}>
            <Flex direction='row'>
              <Pressable flex={1} onPress={handleOpenFilter}>
                <MagnifyingGlass size={20} color={colors.gray[600]} />
              </Pressable>

              <Divider bg='gray.400' orientation='vertical' />

              <Pressable
                flex={1}
                alignItems='flex-end'
                onPress={handleOpenFilter}
              >
                <Faders size={20} color={colors.gray[600]} />
              </Pressable>
            </Flex>
          </HStack>
        }
      />
    </React.Fragment>
  );
}