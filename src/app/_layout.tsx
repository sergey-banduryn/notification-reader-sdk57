import { Tabs } from 'expo-router';
import type { BottomTabBarButtonProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { BackHandler, type ColorValue, Pressable, Text } from 'react-native';

function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#9797BB' },
        tabBarActiveTintColor: '#007AFF',
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: '#9797BB',
          borderTopColor: 'rgba(255, 255, 255, 0.2)',
          borderTopWidth: 1,
          elevation: 0,
          height: 105,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: getTabBarIcon('Н'),
          title: 'Настройки',
        }}
      />
      <Tabs.Screen
        name='logs'
        options={{
          tabBarIcon: getTabBarIcon('Л'),
          title: 'Логи',
        }}
      />
      <Tabs.Screen
        name='test'
        options={{
          tabBarIcon: getTabBarIcon('Т'),
          title: 'Тест',
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            BackHandler.exitApp();
          },
        }}
        name='exit'
        options={{
          tabBarIcon: getTabBarIcon('В'),
          title: 'Выход',
        }}
      />
    </Tabs>
  );
}

const TabBarButton = (props: BottomTabBarButtonProps) => {
  const { ref, ...restProps } = props;

  return (
    <Pressable
      {...restProps}
      android_ripple={null}
      style={({ pressed }) => [restProps.style, { opacity: pressed ? 0.6 : 1 }]}
    />
  );
};

const getTabBarIcon = (text: string) => {
  const TabBarIcon = ({ color, size }: { color: ColorValue; size: number }) => (
    <Text
      style={{
        color,
        fontSize: size,
        fontWeight: 'bold',
        lineHeight: size,
      }}
    >
      {text}
    </Text>
  );

  return TabBarIcon;
};

export default RootLayout;
