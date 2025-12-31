import { useDispatch, useSelector } from "react-redux";
import { View, Text } from "react-native";
import { useEffect } from "react";
import {
  getPendingRequests,
  getApprovedUsers,
  getUserDetails,
} from "../../redux/userSlice/index";

export default function Index() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPendingRequests());
    dispatch(getApprovedUsers());
    dispatch(getUserDetails(user?.id));
  }, []);

  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
