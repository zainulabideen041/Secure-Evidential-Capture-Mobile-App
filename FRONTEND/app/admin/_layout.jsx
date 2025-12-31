// app/admin/_layout.tsx
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AdminTabLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0B" />

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["rgba(219, 190, 248, 0.1)", "rgba(169, 77, 255, 0.05)"]}
          style={styles.headerGradient}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <FontAwesome5 name="user-secret" size={28} color="#AF41EE" />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: "#AF41EE",
            tabBarInactiveTintColor: "#64748B",
            tabBarButton: (props) => (
              <TouchableOpacity {...props} activeOpacity={1}>
                {props.children}
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: "#FFFFFF",
              borderTopWidth: 0,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(148, 163, 184, 0.1)",
              height: 80,
              paddingBottom: 8,
              paddingTop: 8,
              paddingHorizontal: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
              position: "relative",
            },
            tabBarItemStyle: {
              borderRadius: 12,
              marginHorizontal: 2,
              paddingVertical: 4,
            },
            tabBarIconStyle: {
              marginTop: 2,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.activeIconWrapper,
                  ]}
                >
                  <MaterialIcons
                    name="dashboard"
                    size={24}
                    color={focused ? "#AF41EE" : color}
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="approved"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.activeIconWrapper,
                  ]}
                >
                  <FontAwesome5
                    name="user-check"
                    size={24}
                    color={focused ? "#AF41EE" : color}
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="pending"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.activeIconWrapper,
                  ]}
                >
                  <MaterialIcons
                    name="pending"
                    size={24}
                    color={focused ? "#AF41EE" : color}
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.activeIconWrapper,
                  ]}
                >
                  <FontAwesome
                    name="user-circle"
                    size={24}
                    color={focused ? "#AF41EE" : color}
                  />
                </View>
              ),
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#0A0A0B",
    paddingBottom: 10,
  },
  headerGradient: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#AF41EE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(175, 65, 238, 0.2)",
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: -16,
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  activeIconWrapper: {
    backgroundColor: "rgba(175, 65, 238, 0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(175, 65, 238, 0.3)",
    transform: [{ scale: 1.1 }],
  },
});
