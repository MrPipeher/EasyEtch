import { NativeWindStyleSheet } from "nativewind";
import AuthNavigation from './src/screens/AuthScreens/AuthNavigation';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <AuthNavigation />
  );
}
