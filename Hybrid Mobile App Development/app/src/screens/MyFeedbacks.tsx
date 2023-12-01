import { Feedbacks } from '@components/Feedbacks';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import {
  Center,
  HStack,
  Text,
  VStack,
  useTheme,
  Pressable,
  Select,
  Menu,
  HamburgerIcon,
  FlatList,
  Divider,
} from 'native-base';
import { CaretDown, CaretUp, Plus } from 'phosphor-react-native';
import { useCallback, useEffect, useState } from 'react';
import { feedbackTypes } from '../data/feedbackTypes';
import { IFeedback } from '../interfaces/IFeedback';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');

export function MyFeedbacks() {
  const { colors, sizes } = useTheme();
  const { userFeedbacks } = useAuth();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [filter, setFilter] = useState('Todos');
  const [filterIsOpened, setFilterIsOpened] = useState(false);
  const [data, setData] = useState<IFeedback[]>([] as IFeedback[]);

  function handleOpenCreateFeedback() {
    navigate('CreateFeedback');
  }

  useEffect(() => {
    if (filter === 'Todos') {
      setData(userFeedbacks);
      return;
    }

    setData(userFeedbacks.filter((feedback) => feedback.tipo === filter))
    
    console.log(filter, data)

  }, [filter, userFeedbacks]);

  return (
    <VStack flex={1} px='6' safeAreaTop>
      <HStack alignItems='center' justifyContent='center' mt='2' mb='4'>
        <Text fontFamily='bold' fontSize='lg+' color='gray.700'>
          Meus feedbacks
        </Text>

        <Pressable position='absolute' right={0} onPress={handleOpenCreateFeedback}>
          <Plus size={sizes[6]} color={colors.gray[700]} weight='bold' />
        </Pressable>
      </HStack>

      <HStack justifyContent='space-between' alignItems='center'>
        <Text fontFamily='regular' fontSize='sm' color='gray.600'>
          {userFeedbacks?.length} feedback{userFeedbacks?.length > 1 && 's'}
        </Text>

        <Menu
          w={111}
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel='Mais opções de menu'
                flexDirection='row'
                borderRadius={6}
                borderWidth={1}
                borderColor='gray.400'
                alignItems='center'
                justifyContent='space-between'
                px='3'
                py='2'
                w={150}
                {...triggerProps}
              >
                <Text fontFamily='regular' fontSize='sm' color='gray.700'>
                  {filter}
                </Text>

                {filterIsOpened ? (
                  <CaretUp size={sizes[4]} color={colors.gray[500]} />
                ) : (
                  <CaretDown size={sizes[4]} color={colors.gray[500]} />
                )}
              </Pressable>
            );
          }}
          onOpen={() => setFilterIsOpened(true)}
          onClose={() => setFilterIsOpened(false)}
          bgColor='white'
          mt='1'
        >
          {feedbackTypes.map((type) => {
            return(
              <Menu.Item
                w={150}
                onPress={() => setFilter(type.value)}
                _text={{
                  fontFamily: filter === type.value ? 'bold' : 'regular',
                  fontSize: 'sm',
                  color: 'gray.600',
                }}
              >
                {type.label}
              </Menu.Item>
            );
          })}
          <Menu.Item
            onPress={() => setFilter('Todos')}
              w={150}
            _text={{
              fontFamily: filter === 'Todos' ? 'bold' : 'regular',
              fontSize: 'sm',
              color: 'gray.600',
            }}
          >
            Todos
          </Menu.Item>
        </Menu>
      </HStack>

      <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => <Feedbacks {...item} isFirst={index == 0} />}
          mt={7}  
          ListEmptyComponent={
            <Text
              color='gray.500'
              fontSize='sm'
              fontFamily='regular'
              mt='6'
              mb='2'
            >
              Nenhum feedback encontrado!
            </Text>
          }
        />

    </VStack>
  );
}
