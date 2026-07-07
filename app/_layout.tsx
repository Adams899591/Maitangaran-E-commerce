import { Stack } from "expo-router";
import "../global.css"; // Note:    This should always be on your layout

export default function RootLayout() {
  return  <Stack screenOptions={{headerShown: false}} />
}
