import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function Approved() {
  const { approvedUsers } = useSelector((state) => state.user);
  return (
    <View>
      <Text>approved</Text>
    </View>
  );
}
