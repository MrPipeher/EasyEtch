import { NativeWindStyleSheet } from "nativewind";
import Navigator from './src/screens/Navigator';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <Navigator />
  );
}
