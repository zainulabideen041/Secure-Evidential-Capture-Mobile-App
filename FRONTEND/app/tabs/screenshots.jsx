import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { styles } from "../../assets/styles/tabs/screenshots.styles";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import CryptoJS from "crypto-js";
import { FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  fetchScreenshots,
  fetchScreenshotById,
} from "../../redux/screenshotSlice/index";

const { width } = Dimensions.get("window");

export default function Screenshots() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { screenshots, currentScreenshot, isLoading } = useSelector(
    (state) => state.screenshot
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchScreenshots(user.id));
    }
  }, [user]);

  const handleOpenModal = (id) => {
    dispatch(fetchScreenshotById(id));
    setModalVisible(true);
  };

  const handleDownload = async (imageUrl) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library access to save screenshots.",
          [{ text: "OK", style: "default" }]
        );
        return;
      }

      const filename = imageUrl.split("/").pop();
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);
      const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
      await MediaLibrary.createAlbumAsync("SmartEvidence", asset, false);

      Alert.alert(
        "Success!",
        "Screenshot saved to your gallery successfully.",
        [{ text: "Great!", style: "default" }]
      );
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Download Failed",
        "Unable to save screenshot. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleHashVerification = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setVerifying(true);

        const pickedImageUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(pickedImageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const newHash = CryptoJS.SHA256(base64).toString();
        const originalHash = currentScreenshot?.fileHash;

        if (newHash === originalHash) {
          Alert.alert(
            "✓ Verification Successful",
            "The screenshot is authentic and has not been modified.",
            [{ text: "Excellent!", style: "default" }]
          );
        } else {
          Alert.alert(
            "⚠ Verification Failed",
            "This screenshot appears to have been modified or tampered with.",
            [{ text: "Understood", style: "default" }]
          );
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      Alert.alert(
        "Verification Error",
        "An error occurred during verification. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const renderScreenshot = ({ item, index }) => (
    <View style={[styles.screenshotCard, { marginTop: index === 0 ? 8 : 0 }]}>
      <TouchableOpacity
        onPress={() => handleOpenModal(item._id)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.url }} style={styles.thumbnail} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          />
          <View style={styles.imageOverlay}>
            <View style={styles.dateChip}>
              <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
            </View>
            <TouchableOpacity
              style={styles.expandIcon}
              onPress={() => handleOpenModal(item._id)}
            >
              <Feather name="maximize-2" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.metaInfo}>
          <Text style={styles.timeText}>
            {new Date(item.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <View style={styles.statusContainer}>
            {item.linked && (
              <View style={styles.linkedBadge}>
                <MaterialIcons name="link" size={12} color="#10B981" />
                <Text style={styles.linkedText}>Linked</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item.url)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="download" size={18} color="#AF41EE" />
          <Text style={styles.downloadButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome5 name="images" size={64} color="#E5E7EB" />
      </View>
      <Text style={styles.emptyTitle}>No Screenshots Yet</Text>
      <Text style={styles.emptyDescription}>
        Your captured screenshots will appear here once you start taking them.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Gallery</Text>
          <Text style={styles.headerSubtitle}>
            {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="shield-alt" size={24} color="#AF41EE" />
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#AF41EE" />
          <Text style={styles.loadingText}>Loading screenshots...</Text>
        </View>
      ) : (
        <FlatList
          data={screenshots}
          keyExtractor={(item) => item._id}
          renderItem={renderScreenshot}
          contentContainerStyle={[
            styles.listContainer,
            screenshots.length === 0 && styles.emptyListContainer,
          ]}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          bounces={true}
        />
      )}

      {/* Enhanced Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Screenshot Details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {currentScreenshot && (
              <View style={styles.modalContent}>
                <View style={styles.fullImageContainer}>
                  <Image
                    source={{ uri: currentScreenshot.url }}
                    style={styles.fullImage}
                  />
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <MaterialIcons
                        name="fingerprint"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>File Hash</Text>
                      <Text style={styles.detailValue} numberOfLines={2}>
                        {currentScreenshot.fileHash}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <MaterialIcons name="link" size={20} color="#6B7280" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Link Status</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          currentScreenshot.linked && styles.linkedValue,
                        ]}
                      >
                        {currentScreenshot.linked
                          ? "Linked to Case"
                          : "Not Linked"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <MaterialIcons name="folder" size={20} color="#6B7280" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Case ID</Text>
                      <Text style={styles.detailValue}>
                        {currentScreenshot.caseId || "No case assigned"}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    verifying && styles.verifyingButton,
                  ]}
                  onPress={handleHashVerification}
                  disabled={verifying}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      verifying
                        ? ["#9CA3AF", "#6B7280"]
                        : ["#AF41EE", "#8B5CF6"]
                    }
                    style={styles.verifyButtonGradient}
                  >
                    {verifying ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <FontAwesome5
                        name="shield-alt"
                        size={18}
                        color="#FFFFFF"
                      />
                    )}
                    <Text style={styles.verifyButtonText}>
                      {verifying ? "Verifying..." : "Verify Authenticity"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
