const express = require("express");
const expencesController = require("../controllers/expencesController");

const router = express.Router();

router.route("/stats").get(expencesController.generalStats);

router
  .route("/")
  .get(expencesController.getExpences)
  .post(expencesController.createExpence);

router
  .route("/:id")
  .get(expencesController.getExpence)
  .delete(expencesController.deleteExpence)
  .patch(expencesController.updateExpence);

module.exports = router;
