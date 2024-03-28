const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middelware/authentication");

router.post(
  "/register",
 authcontroller.register
);
router.post("/login", authcontroller.signin);
router.get("/logout", authcontroller.logout);
router.post('/reguser', authcontroller.registerUser);
router.post("/forgot-password", authcontroller.forgotPassword);
router.post("/reset-password", authcontroller.ResetPassword);

module.exports = router;
