import { Tabs } from "expo-router";
import { BottomTabBarButtonProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Text, Pressable, BackHandler, ColorValue } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarStyle: {
          backgroundColor: "#9797BB",
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.2)",
          height: 105,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        sceneStyle: { backgroundColor: "#9797BB" },
        tabBarButton: (props) => <TabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Настройки",
          tabBarIcon: getTabBarIcon("Н"),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Логи",
          tabBarIcon: getTabBarIcon("Л"),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "Тест",
          tabBarIcon: getTabBarIcon("Т"),
        }}
      />
      <Tabs.Screen
        name="exit"
        options={{
          title: "Выход",
          tabBarIcon: getTabBarIcon("В"),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            BackHandler.exitApp();
          },
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
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Text
      style={{
        color,
        fontSize: size,
        fontWeight: "bold",
        lineHeight: size,
      }}
    >
      {text}
    </Text>
  );
};
