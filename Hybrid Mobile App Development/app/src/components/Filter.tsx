import { Dimensions } from 'react-native';
import React from 'react';
import {
  HStack,
  Pressable,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import { X } from 'phosphor-react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

// Component import
import { Button } from '@components/Button';
import { TagButton } from '@components/TagButton';
import { Checkbox } from '@components/Checkbox';

const { height } = Dimensions.get('screen');

const especialidadesSaude = [
  'Cardiologista',
  'Oftalmologista',
  'Dermatologista',
  'Ortopedista',
  'Ginecologista/Obstetra',
  'Psiquiatra',
  'Urologista',
];

interface Props {
  filterRef: React.RefObject<Modalize>;
  handleClose(): void;
  checkBoxFilterSelected: string[];
  handleSelectCheckboxFilter(item: string): void
  handleResetFilters(): void;
  applyFilters(): void;
}

export const Filter: React.FC<Props> = ({
  filterRef,
  handleClose,
  checkBoxFilterSelected,
  handleSelectCheckboxFilter,
  handleResetFilters,
  applyFilters
}) => {
  // Hook
  const { colors, sizes } = useTheme();

  return (
    <Portal>
      <Modalize
        ref={filterRef}
        snapPoint={height - height * 0.27}
        modalHeight={height - height * 0.27}
        avoidKeyboardLikeIOS
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        handlePosition='inside'
        HeaderComponent={
          <HStack mt='10' alignItems='center' justifyContent='space-between'>
            <Text fontFamily='bold' fontSize='lg+' color='gray.700'>
              Filtrar feedbacks
            </Text>

            <Pressable px='4' onPress={handleClose}>
              <X size={25} color={colors.gray[400]} />
            </Pressable>
          </HStack>
        }
        modalStyle={{
          backgroundColor: colors.gray[200],
          paddingHorizontal: sizes[6],
        }}
      >
        <VStack flex={1}>
          <Text
            fontSize='sm'
            fontFamily='bold'
            color='gray.600'
            mt={6}
            mb={3}
          >
            Condição
          </Text>
          <HStack>
            <TagButton title='Anônimos' />
            <TagButton title='Usuário identificado' />
          </HStack>

          <Text
            fontSize='sm'
            fontFamily='bold'
            color='gray.600'
            mt={6}
            mb={3}
          >
            Filtar por especialista
          </Text>


          {especialidadesSaude.map((item) => (
            <Checkbox
              key={item}
              value={item}
              label={item}
              isChecked={checkBoxFilterSelected.includes(item)}
              onChange={() => handleSelectCheckboxFilter(item)}
            />
          ))}

          <HStack my={10}>
            <Button
              onPress={handleResetFilters}
              title='Resetar filtros'
              bgColor='gray.300'
              flex={1}
              marginRight={2}
            />
            <Button
              onPress={applyFilters}
              title='Aplicar filtros'
              bgColor='gray.700'
              flex={1}
              marginLeft={2}
            />
          </HStack>
        </VStack>
      </Modalize>
    </Portal>
  )
}