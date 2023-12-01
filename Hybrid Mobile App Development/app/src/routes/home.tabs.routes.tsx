import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { House, SignOut, Chats } from 'phosphor-react-native';
import { useTheme, Pressable } from 'native-base';
import { Home } from '@screens/Home';
import { MyFeedbacks } from '@screens/MyFeedbacks';
import { useAuth } from '@hooks/useAuth';

type HomeTabsRoutes = {
  home: undefined;
  myFeedbacks: undefined;
  signOut: undefined;
};

export type HomeTabsNavigatorRoutesProps =
  BottomTabNavigationProp<HomeTabsRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<HomeTabsRoutes>();

export function HomeTabsRoutes() {
  // Hook
  const { sizes, colors } = useTheme();
  const { signOut } = useAuth();

  const iconSize = sizes[6];

  const LogOutFakeScreen = () => null;

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[200],
          borderTopWidth: 0,
          paddingTop: sizes[6],
          paddingBottom: sizes[6],
        },
      }}
    >
      <Screen
        name='home'
        component={Home}
        options={() => ({
          tabBarIcon: ({ color, focused }) => (
            <House
              color={color}
              size={iconSize}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        })}
      />

      <Screen
        name='myFeedbacks'
        component={MyFeedbacks}
        options={() => ({
          tabBarIcon: ({ color, focused }) => (
            <Chats
              color={color}
              size={iconSize}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        })}
      />

      <Screen
        name='signOut'
        component={LogOutFakeScreen}
        options={{
          tabBarIcon: () => (
            <Pressable onPress={signOut}>
              <SignOut color={colors.red[400]} size={iconSize} />
            </Pressable>
          ),
        }}
      />
    </Navigator>
  );
}
