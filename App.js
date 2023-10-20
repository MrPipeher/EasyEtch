import { NativeWindStyleSheet } from "nativewind";
import RootNavigator from "./src/screens/RootNavigator";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <RootNavigator />
  );
}
