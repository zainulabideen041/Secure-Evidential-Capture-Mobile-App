import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
  createCase,
  fetchCaseById,
  fetchCases,
} from "../../redux/caseSlice/index";
import { fetchScreenshots } from "../../redux/screenshotSlice";
import { styles } from "../../assets/styles/tabs/cases.styles";

export default function Cases() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cases, currentCase } = useSelector((state) => state.case);
  const { screenshots } = useSelector((state) => state.screenshot);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedScreenshots, setSelectedScreenshots] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCases(user.id));
      dispatch(fetchScreenshots(user.id));
    }
  }, [dispatch, user?.id]);

  const toggleScreenshot = (id) => {
    setSelectedScreenshots((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      // Validation checks
      if (!title.trim()) {
        Alert.alert("Validation Error", "Case title is required.");
        return;
      }

      if (selectedScreenshots.length === 0) {
        Alert.alert(
          "Validation Error",
          "Please select at least one screenshot."
        );
        return;
      }

      // Dispatch action to create a case
      const resultAction = await dispatch(
        createCase({
          userId: user.id,
          caseData: {
            title: title.trim(),
            description: description.trim(),
            ScreenshotId: selectedScreenshots,
          },
        })
      );

      if (createCase.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message || "Case creation failed");
      }

      // Clear form and refresh cases list
      setIsModalVisible(false);
      setTitle("");
      setDescription("");
      setSelectedScreenshots([]);
      dispatch(fetchCases(user.id));

      Alert.alert("Success", "Case created successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
  };

  const unlinkedScreenshots = screenshots?.filter((s) => !s.linked);

  const openDetailsModal = (caseId) => {
    dispatch(fetchCaseById(caseId));
    setIsDetailsVisible(true);
  };

  const getCaseScreenshots = (caseObj) => {
    // If ScreenshotId exists and is an array with items
    if (caseObj?.ScreenshotId?.length > 0) {
      // Check if first item is an object (full screenshot) or string (just ID)
      if (typeof caseObj.ScreenshotId[0] === "object") {
        // If it's an array of screenshot objects, return them directly
        return caseObj.ScreenshotId;
      } else {
        // If it's an array of IDs, filter screenshots as before
        return screenshots.filter((shot) =>
          caseObj.ScreenshotId.includes(shot._id)
        );
      }
    }
    return [];
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#10B981";
      case "in-progress":
        return "#F59E0B";
      case "pending":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>My Cases</Text>
          <Text style={styles.subheading}>Manage your case files</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.createButton}
          activeOpacity={0.8}
        >
          <Text style={styles.createText}>+ New Case</Text>
        </TouchableOpacity>
      </View>

      {/* Case List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cases?.length > 0 ? (
          cases.map((c) => (
            <TouchableOpacity
              key={c._id}
              onPress={() => openDetailsModal(c._id)}
              activeOpacity={0.7}
              style={styles.caseCard}
            >
              <View style={styles.caseHeader}>
                <View style={styles.caseTitleContainer}>
                  <Text style={styles.caseTitle} numberOfLines={2}>
                    {c.title}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(c.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {c.status || "Pending"}
                    </Text>
                  </View>
                </View>
              </View>

              {c.description ? (
                <Text style={styles.caseDescription} numberOfLines={3}>
                  {c.description}
                </Text>
              ) : null}

              <View style={styles.caseFooter}>
                <View style={styles.caseMetadata}>
                  <Text style={styles.caseDate}>
                    Created {formatDate(c.createdAt)}
                  </Text>
                  <Text style={styles.screenshotCount}>
                    {getCaseScreenshots(c)?.length || 0} attachments
                  </Text>
                </View>
                <View style={styles.arrowIcon}>
                  <Text style={styles.arrowText}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Cases Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first case to get started with organizing your
              screenshots and evidence.
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={styles.emptyStateButton}
            >
              <Text style={styles.emptyStateButtonText}>Create First Case</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Create Case Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Case</Text>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.modalSaveButton,
                (!title || selectedScreenshots.length === 0) &&
                  styles.disabledButton,
              ]}
              disabled={!title || selectedScreenshots.length === 0}
            >
              <Text
                style={[
                  styles.modalSaveText,
                  (!title || selectedScreenshots.length === 0) &&
                    styles.disabledText,
                ]}
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Case Title *</Text>
              <TextInput
                placeholder="Enter case title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                placeholder="Add case description..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={[styles.input, styles.textArea]}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.screenshotSection}>
              <Text style={styles.sectionTitle}>
                Select Screenshots ({selectedScreenshots.length} selected)
              </Text>
              {unlinkedScreenshots?.length > 0 ? (
                <View style={styles.screenshotGrid}>
                  {unlinkedScreenshots.map((shot) => (
                    <TouchableOpacity
                      key={shot._id}
                      onPress={() => toggleScreenshot(shot._id)}
                      style={[
                        styles.screenshotItem,
                        selectedScreenshots.includes(shot._id) &&
                          styles.selectedScreenshot,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: shot.url }}
                        style={styles.screenshotThumbnail}
                      />
                      <View style={styles.checkboxOverlay}>
                        <Checkbox
                          status={
                            selectedScreenshots.includes(shot._id)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => toggleScreenshot(shot._id)}
                          color="#007AFF"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setPreviewImage(shot.cloudinaryUrl)}
                        style={styles.previewButton}
                      >
                        <Text style={styles.previewButtonText}>👁</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noScreenshots}>
                  <Text style={styles.noScreenshotsText}>
                    No unlinked screenshots available
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Case Details Modal */}
      <Modal
        visible={isDetailsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={{ width: 60 }} />
            <Text style={styles.modalTitle}>Case Details</Text>
            <TouchableOpacity
              onPress={() => setIsDetailsVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>{currentCase?.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(currentCase?.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {currentCase?.status || "Pending"}
                </Text>
              </View>
            </View>

            {currentCase?.description ? (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.descriptionText}>
                  {currentCase.description}
                </Text>
              </View>
            ) : null}

            <View style={styles.metadataSection}>
              <Text style={styles.sectionLabel}>Case Information</Text>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Created:</Text>
                <Text style={styles.metadataValue}>
                  {formatDate(currentCase?.createdAt)}
                </Text>
              </View>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Attachments:</Text>
                <Text style={styles.metadataValue}>
                  {getCaseScreenshots(currentCase)?.length || 0} files
                </Text>
              </View>
            </View>

            <View style={styles.attachmentsSection}>
              <Text style={styles.sectionLabel}>Screenshots</Text>
              {getCaseScreenshots(currentCase)?.length > 0 ? (
                <View style={styles.attachmentGrid}>
                  {getCaseScreenshots(currentCase).map((shot) => (
                    <TouchableOpacity
                      key={shot._id}
                      onPress={() => setPreviewImage(shot.cloudinaryUrl)}
                      style={styles.attachmentItem}
                    >
                      <Image
                        source={{ uri: shot.url }}
                        style={styles.attachmentThumbnail}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noAttachmentsText}>
                  No screenshots attached
                </Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent={true} animationType="fade">
        <View style={styles.imagePreviewOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setPreviewImage(null)}
          />
          <Image
            source={{ uri: previewImage }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closePreviewButton}
            onPress={() => setPreviewImage(null)}
          >
            <Text style={styles.closePreviewText}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
