import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Skeleton, Text } from 'native-base';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';

// Hook import
import { useAuth } from '@hooks/useAuth';

// Service import
import { api } from '@services/api';

// Type import
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';
import { IFeedback } from 'src/interfaces/IFeedback';
import { IDocument } from 'src/interfaces/IDocument';

// Component import
import { Loading } from '@components/Loading';
import { Feedbacks } from '@components/Feedbacks';
import { HomeHeader } from '@components/HomeHeader';
import { Filter } from '@components/Filter';
import { SearchInput } from '@components/SearchInput';
import { MyFeedbacksCard } from '@components/MyFeedbacksCard';
import { Professionals } from '@components/Professionals';

export function Home() {
  // Hook
  const { user } = useAuth();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();

  // Ref
  const filterRef = useRef<Modalize>(null);

  // State
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([] as IFeedback[]);
  const [professionals, setProfessionals] = useState<IDocument[]>([] as IDocument[]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkBoxFilterSelected, setCheckBoxFilterSelected] =
    useState<string[]>([]);

  const handleOpenFilter = () => filterRef.current?.open();

  const handleCloseFilter = () => filterRef.current?.close();

  function handleOpenCreateFeedback() {
    const isAuthenticated = !!user.id;

    if (isAuthenticated) return navigate('CreateFeedback');

    return navigate('signIn')
  }

  const handleNavigateToFeedbacks = () => {
    const hasFeedbacks = Array.isArray(feedbacks) && feedbacks.length >= 1;

    if (hasFeedbacks) return navigateTabs('myFeedbacks');

    navigate('CreateFeedback')
  };

  async function handleSearch() { }

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const feedbacksData = await api.get('/feedbacks');
        setFeedbacks(feedbacksData.data.content);

        const registros = await api.get('/registros');
        setProfessionals(registros.data.content)
      } catch (error) {
        console.error('Erro ao buscar dados: ', error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  function handleSelectFilterItem(item: string) {
    setCheckBoxFilterSelected(previous => {
      if (previous.includes(item)) {
        return previous.filter(existingItem => existingItem !== item);
      } else {
        return [...previous, item];
      }
    });
  }

  const hasProfessionals =
    !isLoading && Array.isArray(professionals) && professionals.length >= 1;

  const hasFeedbacks =
    !isLoading && Array.isArray(feedbacks) && feedbacks.length >= 1;

  return (
    <ScrollView flex={1} px='6' pb={4} mt={10}>
      <HomeHeader createFeedback={handleOpenCreateFeedback} />

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Seus feedbacks
      </Text>

      {isLoading ? (
        <Skeleton
          w='full'
          h={16}
          rounded={6}
          startColor='gray.500'
          endColor='gray.400'
        />
      ) : (
        <MyFeedbacksCard
          navigate={handleNavigateToFeedbacks}
          userFeedbacksCount={feedbacks?.length}
          key="cards-feedback-home"
        />
      )}

      <SearchInput
        handleOpenFilter={handleOpenFilter}
        onChange={setSearch}
        value={search}
        onSearch={handleSearch}
      />

      {isLoading && <Loading />}

      {hasProfessionals && professionals.map(item =>
        <Professionals key={item.id} {...item} />
      )}

      <Filter
        filterRef={filterRef}
        applyFilters={handleCloseFilter}
        checkBoxFilterSelected={checkBoxFilterSelected}
        handleSelectCheckboxFilter={handleSelectFilterItem}
        handleClose={handleCloseFilter}
        handleResetFilters={() => setCheckBoxFilterSelected([])}
        key="filter"
      />

      {hasFeedbacks && feedbacks.map((feedback, index) =>
        <Feedbacks key={feedback.id} {...feedback} isFirst={index === 0} />
      )}
    </ScrollView>
  );
}
