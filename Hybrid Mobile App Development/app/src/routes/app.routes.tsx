import { CreateFeedback } from '@screens/CreateFeedback';
import { PreviewFeedback } from '@screens/PreviewFeedback';
import { ProfessionalDetails } from '@screens/ProfessionalDetails';
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
  professionalDetails: { id: string | number };
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Screen name='homeTabs' component={HomeTabsRoutes} />
      <Screen name='CreateFeedback' component={CreateFeedback} />
      <Screen name='previewFeedback' component={PreviewFeedback} />
      <Screen name='professionalDetails' component={ProfessionalDetails} />
    </Navigator>
  );
}
