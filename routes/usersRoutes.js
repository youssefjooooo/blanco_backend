const express = require("express");
const { getUsers } = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);
router.get("/login", authController.protect, authController.getAccountInfo);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.route("/").get(getUsers);

module.exports = router;
