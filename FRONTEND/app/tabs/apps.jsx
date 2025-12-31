import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { WebView } from "react-native-webview";
import { styles } from "../../assets/styles/apps.styles";
import axios from "../../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { createScreenshot } from "../../redux/screenshotSlice/index";

const socialMediaApps = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "logo-facebook",
    url: "https://m.facebook.com",
    color: "#1877F2",
    gradient: ["#1877F2", "#4267B2"],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "logo-instagram",
    url: "https://www.instagram.com",
    color: "#E4405F",
    gradient: ["#E4405F", "#C13584", "#833AB4"],
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "logo-twitter",
    url: "https://mobile.twitter.com",
    color: "#1DA1F2",
    gradient: ["#1DA1F2", "#0084B4"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "musical-notes",
    url: "https://www.tiktok.com",
    color: "#000000",
    gradient: ["#000000", "#FF0050"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "logo-youtube",
    url: "https://m.youtube.com",
    color: "#FF0000",
    gradient: ["#FF0000", "#CC0000"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "logo-linkedin",
    url: "https://www.linkedin.com",
    color: "#0077B5",
    gradient: ["#0077B5", "#005582"],
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: "camera",
    url: "https://web.snapchat.com",
    color: "#FFFC00",
    gradient: ["#FFFC00", "#FFF700"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "logo-whatsapp",
    url: "https://web.whatsapp.com",
    color: "#25D366",
    gradient: ["#25D366", "#128C7E"],
  },
];

export default function Apps() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const webViewRef = useRef(null);
  const screenshotRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Cleanup refs on unmount
  useEffect(() => {
    return () => {
      webViewRef.current = null;
      screenshotRef.current = null;
    };
  }, []);

  const openApp = (app) => {
    setSelectedApp(app);
    setIsLoading(true);
  };

  const closeApp = () => {
    setSelectedApp(null);
    setIsLoading(false);
  };

  const takeScreenshot = async () => {
    if (!screenshotRef.current) {
      Alert.alert("Error", "Screenshot reference not available");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setIsCapturing(true);

      // Capture screenshot
      const uri = await captureRef(screenshotRef.current, {
        format: "png",
        quality: 0.8,
      });

      if (!uri) {
        throw new Error("Failed to capture screenshot");
      }

      // Read file and generate hash
      const imageBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!imageBase64) {
        throw new Error("Failed to read image file");
      }

      const hash = CryptoJS.SHA256(imageBase64).toString();

      // Upload to Cloudinary
      await uploadToCloudinary(uri, imageBase64, hash);
    } catch (error) {
      console.error("Screenshot failed:", error);
      Alert.alert(
        "Screenshot Error",
        error.message || "Failed to take screenshot. Please try again."
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadToCloudinary = async (imageUri, imageBase64, hash) => {
    try {
      const response = await axios.post("/image/upload", {
        image: `data:image/png;base64,${imageBase64}`,
      });

      if (response.data?.success) {
        const { secure_url, public_id } = response.data;

        if (!secure_url || !public_id) {
          throw new Error("Invalid response from upload server");
        }

        const screenshotData = {
          cloudinaryId: public_id,
          url: secure_url,
          fileHash: hash,
          notes: "",
        };

        const result = await dispatch(
          createScreenshot({
            id: user.id,
            screenshotData,
          })
        );

        if (createScreenshot.rejected.match(result)) {
          throw new Error(result.payload || "Failed to save screenshot data");
        }

        try {
          await FileSystem.deleteAsync(imageUri, { idempotent: true });
        } catch (deleteError) {
          console.warn("Failed to delete local file:", deleteError);
        }

        Alert.alert("Success", "Screenshot captured and saved successfully!");
      } else {
        throw new Error(response.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", JSON.stringify(error, null, 2));

      let errorMessage = "Failed to upload screenshot";
      if (error.code === "NETWORK_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.response?.status === 413) {
        errorMessage = "Image file too large. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Upload Error", errorMessage);
      throw error;
    }
  };

  const handleWebViewLoad = () => {
    setIsLoading(false);
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error:", nativeEvent);
    setIsLoading(false);
    Alert.alert(
      "Loading Error",
      `Failed to load ${selectedApp?.name}. Please check your internet connection.`
    );
  };

  const renderAppIcon = (app) => (
    <TouchableOpacity
      key={app.id}
      style={styles.appIcon}
      onPress={() => openApp(app)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={app.gradient}
        style={styles.appIconGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.appIconContent}>
        <Ionicons
          name={app.icon}
          size={32}
          color="white"
          style={{
            textShadowColor: "rgba(0,0,0,0.3)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}
        />
        <Text style={styles.appName}>{app.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0B" />
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Socials</Text>
          <Text style={styles.headerSubtitle}>
            Access All Your Social Media in One App
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="shield-alt" size={24} color="#AF41EE" />
        </View>
      </View>
      {/* Apps Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appsGrid}>
          {socialMediaApps.map(renderAppIcon)}
        </View>
      </ScrollView>

      {/* WebView Modal */}
      <Modal
        visible={selectedApp !== null}
        animationType="slide"
        onRequestClose={closeApp}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.webViewContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />

          {/* Header */}
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              onPress={closeApp}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>{selectedApp?.name}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* WebView */}
          <View style={styles.webViewWrapper} ref={screenshotRef}>
            {selectedApp && (
              <WebView
                ref={webViewRef}
                source={{ uri: selectedApp.url }}
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                mixedContentMode="compatibility"
                onLoad={handleWebViewLoad}
                onError={handleWebViewError}
                onHttpError={handleWebViewError}
                userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>
                      Loading {selectedApp.name}...
                    </Text>
                  </View>
                )}
              />
            )}

            {/* Loading overlay for initial load */}
            {isLoading && (
              <View style={[styles.loadingContainer, styles.loadingOverlay]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>
                  Loading {selectedApp?.name}...
                </Text>
              </View>
            )}
          </View>

          {/* Screenshot Button */}
          <TouchableOpacity
            style={[
              styles.screenshotButton,
              (isCapturing || isLoading) && styles.screenshotButtonDisabled,
            ]}
            onPress={takeScreenshot}
            disabled={isCapturing || isLoading}
            activeOpacity={0.8}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={24} color="white" />
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
