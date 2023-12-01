import { CreateFeedback } from '@screens/CreateFeedback';
import { PreviewFeedback } from '@screens/PreviewFeedback';
import { AdDetails } from '@screens/AdDetails';
import { IFeedback } from 'src/interfaces/IFeedback';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { HomeTabsRoutes } from './home.tabs.routes';

type AppRoutes = {
  homeTabs: undefined;
  CreateFeedback: undefined | IFeedback;
  previewFeedback: IFeedback;
  adDetails: { id: string };
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Screen name='homeTabs' component={HomeTabsRoutes} />
      <Screen name='CreateFeedback' component={CreateFeedback} />
      <Screen name='previewFeedback' component={PreviewFeedback} />
      <Screen name='adDetails' component={AdDetails} />
    </Navigator>
  );
}
