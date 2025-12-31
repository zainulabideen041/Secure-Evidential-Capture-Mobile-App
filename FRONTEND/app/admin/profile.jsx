import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/authSlice/index";
import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/admin/profile.styles";

export default function Profile() {
  const { userDetails } = useSelector((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            const resultAction = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(resultAction)) {
              router.replace("/(auth)/auth");
            } else {
              Alert.alert(
                "Error",
                resultAction.payload?.message || "Logout failed"
              );
            }
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "inactive":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const ProfileItem = ({ label, value, icon, isLast = false }) => (
    <View style={[styles.profileItem, isLast && styles.profileItemLast]}>
      <View style={styles.profileItemContent}>
        <View style={styles.profileItemLeft}>
          <View style={styles.iconContainer}>
            <Text style={styles.profileItemIcon}>{icon}</Text>
          </View>
          <View style={styles.profileItemText}>
            <Text style={styles.profileItemLabel}>{label}</Text>
            <Text style={styles.profileItemValue}>
              {value || "Not provided"}
            </Text>
          </View>
        </View>
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </View>
  );

  const InfoCard = ({ title, items }) => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>
        {items.map((item, index) => (
          <ProfileItem
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );

  if (!userDetails) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const personalInfo = [
    { label: "Full Name", value: userDetails.name, icon: "👤" },
    { label: "Email Address", value: userDetails.email, icon: "✉️" },
    { label: "Phone Number", value: userDetails.phone, icon: "📱" },
    { label: "Date of Birth", value: userDetails.dateOfBirth, icon: "🎂" },
  ];

  const accountInfo = [
    { label: "Identity", value: userDetails.identity, icon: "⚡" },
    {
      label: "Member Since",
      value: formatDate(userDetails.createdAt),
      icon: "📅",
    },
    {
      label: "Last Updated",
      value: formatDate(userDetails.updatedAt),
      icon: "🔄",
    },
    ...(userDetails.role
      ? [{ label: "Role", value: userDetails.role, icon: "🏷️" }]
      : []),
  ];

  const additionalInfo = [
    ...(userDetails.company
      ? [{ label: "Company", value: userDetails.company, icon: "🏢" }]
      : []),
    ...(userDetails.address
      ? [{ label: "Address", value: userDetails.address, icon: "📍" }]
      : []),
    ...(userDetails.bio
      ? [{ label: "Bio", value: userDetails.bio, icon: "📝" }]
      : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with gradient background */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {userDetails.avatar ? (
                <Image
                  source={{ uri: userDetails.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {getInitials(userDetails.name || userDetails.email)}
                  </Text>
                </View>
              )}
              <View style={styles.avatarBadge}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getStatusColor(
                        userDetails.account_status
                      ),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userDetails.name || "User"}</Text>
              <Text style={styles.userEmail}>{userDetails.email}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(userDetails.account_status) },
              ]}
            >
              <Text style={styles.statusText}>
                {userDetails.account_status || "Active"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {formatDate(userDetails.createdAt).split(",")[1]?.trim() ||
                new Date().getFullYear()}
            </Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userDetails.role || "User"}</Text>
            <Text style={styles.statLabel}>Role</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userDetails.identity}</Text>
            <Text style={styles.statLabel}>Identity</Text>
          </View>
        </View>

        {/* Profile Information Cards */}
        <InfoCard title="Personal Information" items={personalInfo} />
        <InfoCard title="Account Details" items={accountInfo} />

        {additionalInfo.length > 0 && (
          <InfoCard title="Additional Information" items={additionalInfo} />
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              Alert.alert(
                "Info",
                "Edit profile functionality can be added here"
              );
            }}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIcon}>✏️</Text>
              </View>
              <Text style={styles.editButtonText}>Edit Profile</Text>
              <Text style={styles.buttonChevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              Alert.alert("Info", "Settings functionality can be added here");
            }}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIcon}>⚙️</Text>
              </View>
              <Text style={styles.settingsButtonText}>Settings</Text>
              <Text style={styles.buttonChevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.logoutButton,
              isLoggingOut && styles.logoutButtonDisabled,
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              {isLoggingOut ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    style={styles.loadingIcon}
                  />
                  <Text style={styles.logoutButtonText}>Logging out...</Text>
                </>
              ) : (
                <>
                  <View style={styles.buttonIconContainer}>
                    <Text style={styles.buttonIcon}>🚪</Text>
                  </View>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              Your data is secure and protected
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
