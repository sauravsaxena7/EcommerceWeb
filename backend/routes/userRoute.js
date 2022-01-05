
const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatorUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/logout").get(logout);


router.route("/me").get(isAuthenticatorUser,getUserDetails);

router.route("/password/update").put(isAuthenticatorUser,updateUserPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me/update").put(isAuthenticatorUser,updateUserProfile);

router.route("/admin/users").get(isAuthenticatorUser,authorizeRoles("admin"),getAllUser);


router.route("/admin/user/:id")
.get(isAuthenticatorUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticatorUser,authorizeRoles("admin"),updateUserRole)
.delete(isAuthenticatorUser,authorizeRoles("admin"),deleteUser);


module.exports = router;