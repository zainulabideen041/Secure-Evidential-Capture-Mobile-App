const express = require("express");
const {
  ApprovePendings,
  ApprovedUsers,
  PendingUsers,
  DeletePendings,
  DeletePendingsWithEmailStatus,
  userDetails,
} = require("../controllers/Users");

const router = express.Router();

router.get("/pendings", PendingUsers);
router.get("/approved", ApprovedUsers);
router.put("/approve", ApprovePendings);
router.delete("/del-pending-all", DeletePendings);
router.delete("/del-all-unverified", DeletePendingsWithEmailStatus);
router.get("/details/:id", userDetails);

module.exports = router;
