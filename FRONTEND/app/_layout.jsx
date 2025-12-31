import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AuthSlotWrapper from "./components/AuthSlotWrapper";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthSlotWrapper>
          <Slot />
        </AuthSlotWrapper>
      </SafeAreaProvider>
    </Provider>
  );
}
