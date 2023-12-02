import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

// Route import
import { AppRoutes } from './app.routes';

// Component import
import { Loading } from '@components/Loading';

// Hook import
import { useAuth } from '@hooks/useAuth';

export function Routes() {
  const { colors } = useTheme();
  const { isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[200];

  if (isLoadingUserStorageData) return <Loading />;

  return (
    <Box flex={1} bg='gray.200'>
      <NavigationContainer theme={theme}>
        <AppRoutes />
      </NavigationContainer>
    </Box>
  );
}
