import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // Выезд экрана справа
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="logs"
        options={{
          headerShown: true,
          title: "Логи системы",
          headerBackTitle: "Назад",
        }}
      />
    </Stack>
  );
}
