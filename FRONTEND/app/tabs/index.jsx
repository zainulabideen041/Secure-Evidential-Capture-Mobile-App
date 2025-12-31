import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchCases } from "../../redux/caseSlice/index";
import { getUserDetails } from "../../redux/userSlice/index";
import { fetchScreenshots } from "../../redux/screenshotSlice";
import { styles } from "../../assets/styles/tabs/dashboard.styles";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cases, loading: casesLoading } = useSelector((state) => state.case);
  const { screenshots, loading: screenshotsLoading } = useSelector(
    (state) => state.screenshot
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    totalScreenshots: 0,
    unlinkedScreenshots: 0,
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCases(user.id));
      dispatch(getUserDetails(user.id));
      dispatch(fetchScreenshots(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (cases && screenshots) {
      setStats({
        totalCases: cases.length,
        activeCases: cases.filter((c) => c.status === "active").length,
        closedCases: cases.filter((c) => c.status === "closed").length,
        totalScreenshots: screenshots.length,
        unlinkedScreenshots: screenshots.filter((s) => !s.linked).length,
      });
    }
  }, [cases, screenshots]);

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const getRecentCases = () => {
    return cases
      ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  const getRecentScreenshots = () => {
    return screenshots
      ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 4);
  };

  if (casesLoading || screenshotsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <LinearGradient
        colors={["#9900ffff", "#9800f0ff"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Evidence Tracker</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
        style={styles.ScrollView}
      >
        <View style={[styles.statCard, { backgroundColor: "#6C63FF" }]}>
          <Text style={styles.statNumber}>
            {formatNumber(stats.totalCases)}
          </Text>
          <Text style={styles.statLabel}>Total Cases</Text>
          <MaterialIcons
            name="folder"
            size={24}
            color="rgba(255,255,255,0.3)"
            style={styles.statIcon}
          />
        </View>

        <View style={[styles.statCard, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.statNumber}>
            {formatNumber(stats.activeCases)}
          </Text>
          <Text style={styles.statLabel}>Active Cases</Text>
          <MaterialIcons
            name="assignment"
            size={24}
            color="rgba(255,255,255,0.3)"
            style={styles.statIcon}
          />
        </View>

        <View style={[styles.statCard, { backgroundColor: "#FF5252" }]}>
          <Text style={styles.statNumber}>
            {formatNumber(stats.closedCases)}
          </Text>
          <Text style={styles.statLabel}>Closed Cases</Text>
          <MaterialIcons
            name="assignment-turned-in"
            size={24}
            color="rgba(255,255,255,0.3)"
            style={styles.statIcon}
          />
        </View>

        <View style={[styles.statCard, { backgroundColor: "#FF9800" }]}>
          <Text style={styles.statNumber}>
            {formatNumber(stats.totalScreenshots)}
          </Text>
          <Text style={styles.statLabel}>Screenshots</Text>
          <MaterialIcons
            name="photo-camera"
            size={24}
            color="rgba(255,255,255,0.3)"
            style={styles.statIcon}
          />
        </View>
      </ScrollView>

      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Cases Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Cases</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {getRecentCases()?.length > 0 ? (
            getRecentCases().map((caseItem) => (
              <TouchableOpacity key={caseItem._id} style={styles.caseItem}>
                <View style={styles.caseInfo}>
                  <Text style={styles.caseTitle} numberOfLines={1}>
                    {caseItem.title}
                  </Text>
                  <Text style={styles.caseDescription} numberOfLines={1}>
                    {caseItem.description || "No description"}
                  </Text>
                </View>
                <View style={styles.caseMeta}>
                  <Text style={styles.caseDate}>
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </Text>
                  <View
                    style={[
                      styles.caseStatus,
                      {
                        backgroundColor:
                          caseItem.status === "active" ? "#4CAF50" : "#FF5252",
                      },
                    ]}
                  >
                    <Text style={styles.caseStatusText}>{caseItem.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="folder" size={40} color="#9E9E9E" />
              <Text style={styles.emptyStateText}>No cases yet</Text>
            </View>
          )}
        </View>

        {/* Recent Screenshots Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Screenshots</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {getRecentScreenshots()?.length > 0 ? (
            <View style={styles.screenshotGrid}>
              {getRecentScreenshots().map((screenshot) => (
                <TouchableOpacity
                  key={screenshot._id}
                  style={styles.screenshotItem}
                >
                  <Image
                    source={{ uri: screenshot.url }}
                    style={styles.screenshotImage}
                  />
                  {screenshot.linked ? (
                    <View style={styles.linkedBadge}>
                      <FontAwesome name="link" size={12} color="#FFF" />
                    </View>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="image" size={40} color="#9E9E9E" />
              <Text style={styles.emptyStateText}>No screenshots yet</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["#6C63FF", "#8A82FF"]}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="add" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>New Case</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["#4CAF50", "#66BB6A"]}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="photo-camera" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>Capture</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
