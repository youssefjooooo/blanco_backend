const express = require("express");
const expencesController = require("../controllers/expencesController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/stats").get(expencesController.generalStats);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "user"),
    expencesController.getExpences
  )
  .post(expencesController.createExpence);

router
  .route("/:id")
  .get(expencesController.getExpence)
  .delete(expencesController.deleteExpence)
  .patch(expencesController.updateExpence);

module.exports = router;
