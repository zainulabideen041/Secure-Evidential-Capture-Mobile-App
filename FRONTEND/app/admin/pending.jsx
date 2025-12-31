import { styles } from "../../assets/styles/admin/pending.styles";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import {
  approveUser,
  deleteAllPendings,
  deleteAllUnverified,
  getPendingRequests,
} from "../../redux/userSlice/index";

export default function Pending() {
  const { pendingUsers, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [processingUsers, setProcessingUsers] = useState(new Set());

  useEffect(() => {
    if (!pendingUsers || pendingUsers.length === 0) {
      dispatch(getPendingRequests());
    }
  }, [dispatch, pendingUsers]);

  const handleStatusChange = async (user, newStatus) => {
    if (newStatus === "verified") {
      setProcessingUsers((prev) => new Set([...prev, user.email]));

      try {
        const res = await dispatch(
          approveUser({
            approve: true,
            email: user.email,
          })
        );

        if (res.payload?.success) {
          Alert.alert(res.payload.message);
          dispatch(getPendingRequests());
        } else {
          Alert.alert(res.payload.message);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "Failed to approve user. Please try again."
        );
      } finally {
        setProcessingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(user.email);
          return newSet;
        });
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getPendingRequests()).unwrap();
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBulkAction = (action) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${
        action === "deleteAll"
          ? "delete all pending users"
          : "delete all unverified users"
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            try {
              if (action === "deleteAll") {
                await dispatch(deleteAllPendings()).unwrap();
              } else {
                await dispatch(deleteAllUnverified()).unwrap();
              }
              // Refresh the list after bulk action
              dispatch(getPendingRequests());
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to perform bulk action. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const renderUserCard = ({ item: user }) => {
    const isProcessing = processingUsers.has(user.email);

    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name || "Unknown User"}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userDate}>
            Registered:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </Text>
          {user.phone && (
            <Text style={styles.userPhone}>Phone: {user.phone}</Text>
          )}
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={user.account_status}
              style={styles.picker}
              enabled={!isProcessing}
              onValueChange={(itemValue) => handleStatusChange(user, itemValue)}
            >
              <Picker.Item
                label={user.account_status || "Pending"}
                value={user.account_status || "pending"}
              />
              <Picker.Item label="Verified" value="verified" />
            </Picker>
          </View>

          {isProcessing && (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>
        Pending Users ({pendingUsers?.length || 0})
      </Text>
      <Text style={styles.subtitle}>Review and approve user registrations</Text>
      {/* Debug Info - Remove in production
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Debug:{" "}
          {pendingUsers
            ? `Array with ${pendingUsers.length} items`
            : "pendingUsers is null/undefined"}
        </Text>
        {loading && (
          <Text style={styles.debugText}>Loading: {loading.toString()}</Text>
        )}
        {error && <Text style={styles.debugText}>Error: {error}</Text>}
      </View> */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => handleBulkAction("deleteAll")}
          disabled={!pendingUsers?.length}
        >
          <Text style={styles.actionButtonText}>Delete All Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.warningButton]}
          onPress={() => handleBulkAction("deleteUnverified")}
          disabled={!pendingUsers?.length}
        >
          <Text style={styles.actionButtonText}>Delete Unverified</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {loading ? "Loading..." : "No Pending Users"}
      </Text>
      <Text style={styles.emptyStateText}>
        {loading
          ? "Please wait while we fetch the pending users..."
          : "All users have been processed or no new registrations are pending approval."}
      </Text>
      {!loading && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getPendingRequests())}
        >
          <Text style={styles.retryButtonText}>Retry Loading</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Show loading state for initial load
  if (loading && !pendingUsers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading pending users...</Text>
      </View>
    );
  }

  // Show error state
  if (error && !pendingUsers) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Users</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getPendingRequests())}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingUsers || []} // Ensure it's always an array
        renderItem={renderUserCard}
        keyExtractor={(item, index) =>
          item.email || item.id || index.toString()
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
