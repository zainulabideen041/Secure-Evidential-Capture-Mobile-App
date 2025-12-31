const User = require("../models/User");
const TempUser = require("../models/TempUser");

const PendingUsers = async (req, res) => {
  try {
    const pendingUsers = await TempUser.find({ account_status: "notverified" });

    if (pendingUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Pending Requests Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pending users fetched successfully.",
      pendingUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending users.",
    });
  }
};

const ApprovePendings = async (req, res) => {
  const { approved, email } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let user;
    if (approved) {
      user = await User.create({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        identity: tempUser.identity,
        jobTitle: tempUser.jobTitle,
        usagePurpose: tempUser.usagePurpose,
        role: "user",
      });
    }

    await TempUser.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: approved
        ? "User has been approved and added to the main system."
        : "User has been rejected and removed.",
      user: approved ? user : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during approval process.",
    });
  }
};

const DeletePendings = async (req, res) => {
  try {
    const result = await TempUser.deleteMany({ account_status: "notverified" });

    res.status(200).json({
      success: true,
      message: "All pending users with 'notverified' account status deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting pending users.",
    });
  }
};

const DeletePendingsWithEmailStatus = async (req, res) => {
  try {
    const result = await TempUser.deleteMany({ email_status: "notverified" });

    res.status(200).json({
      success: true,
      message: "All pending users with 'notverified' email status deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting users by email status.",
    });
  }
};

const ApprovedUsers = async (req, res) => {
  try {
    const approvedUsers = await User.find({ role: "user" });

    if (approvedUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Users Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Approved users fetched successfully.",
      approvedUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching approved users.",
    });
  }
};

const userDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Details Retrieved",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during approval process.",
    });
  }
};

module.exports = {
  PendingUsers,
  ApprovePendings,
  DeletePendings,
  DeletePendingsWithEmailStatus,
  ApprovedUsers,
  userDetails,
};
