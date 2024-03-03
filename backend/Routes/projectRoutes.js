const express = require('express');
const router = express.Router();
const {addProject,deleteProject,getProjects,downloadFile} = require('../Controllers/projectController');
const {protect} = require('../middleware/authMiddleware');
router.route("/").post(protect, addProject);
router.route("/").get(protect, getProjects);
router.route("/:projectId").delete(protect, deleteProject);
router.route("/download/:projectId").get(protect, downloadFile);

module.exports = router;