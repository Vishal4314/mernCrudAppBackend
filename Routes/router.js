const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/usersControllers");
const upload = require("../multerConfig/storageConfig");

//routes

// post single user route
router.post(
  "/user/register",
  upload.single("user_profile"),
  controllers.userpost
);

//get all user route
router.get("/user/details", controllers.getusers);

//get single user route
router.get("/user/:id", controllers.getSingleUser);

//update single user route
router.put(
  "/user/edit/:id",
  upload.single("user_profile"),
  controllers.updateSingleUser
);

//delete user route
router.delete("/user/delete/:id", controllers.deleteSingleUser);

//to update status of user on click whether active or inactive
router.put("/user/status/:id", controllers.updateUserStatus);

//to export the data in csv format to frontend
router.get("/userexport", controllers.userExportCsv);

module.exports = router;
