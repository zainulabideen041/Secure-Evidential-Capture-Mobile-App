import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "#AF41EE",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="dashboard"
              size={24}
              color={focused ? "#AF41EE" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="apps"
              size={24}
              color={focused ? "#AF41EE" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="screenshots"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="images"
              size={24}
              color={focused ? "#AF41EE" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="cases"
              size={24}
              color={focused ? "#AF41EE" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="user-circle"
              size={24}
              color={focused ? "#AF41EE" : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
