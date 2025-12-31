import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ScrollView: {
    height: 10,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: 10,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  statCard: {
    width: 150,
    height: 150,
    borderRadius: 12,
    padding: 20,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  statNumber: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
  },
  statLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  statIcon: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  viewAllText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "500",
  },
  caseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  caseInfo: {
    flex: 1,
    marginRight: 10,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 3,
  },
  caseDescription: {
    fontSize: 13,
    color: "#777",
  },
  caseMeta: {
    alignItems: "flex-end",
  },
  caseDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  caseStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  caseStatusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  screenshotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  screenshotItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  screenshotImage: {
    width: "100%",
    height: "100%",
  },
  linkedBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#9E9E9E",
    marginTop: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
  },
  actionButtonGradient: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  actionButtonText: {
    color: "#FFF",
    marginLeft: 8,
    fontWeight: "500",
  },
});
