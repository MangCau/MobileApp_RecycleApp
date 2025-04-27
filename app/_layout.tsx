import { Stack } from 'expo-router';
import "./global.css"

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/homepage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/schedule"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/create_order"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/order_details"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/confirmation"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/order_history"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/order_detail_view"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
