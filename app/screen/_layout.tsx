// import { Stack } from "expo-router";
// import CustomHeader from "../components/CustomHeader";


// export default function ScreenLayout() {
//   return  <Stack screenOptions={{    header: () => <CustomHeader />,headerShown: false}} />
// }


// import { Stack } from "expo-router";
// import CustomHeader from "../components/CustomHeader";

// export default function ScreenLayout() {
//   return (
//     <Stack 
//       screenOptions={{
//         headerShown: true, // Ensure the header is actually allowed to render
//         header: () => <CustomHeader />,
//       }} 
//     />
//   );
// }

import { Stack } from "expo-router";
import CustomHeader from "../components/CustomHeader";

export default function ScreenLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true, 
        header: () => <CustomHeader />,
      }} 
    />
  );
}