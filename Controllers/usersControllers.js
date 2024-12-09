const users = require("../models/usersSchema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");

//to post data of a user
exports.userpost = async (req, res) => {
  const file = req.file.filename;
  const { fName, lName, email, mobile, gender, location, status } = req.body;
  if (
    !fName ||
    !lName ||
    !email ||
    !mobile ||
    !gender ||
    !location ||
    !status ||
    !file
  ) {
    res.status(401).json({ status: 401, message: "Fill All the Details" });
  } else {
    try {
      const preUser = await users.findOne({ email: email });
      if (preUser) {
        res.status(401).json({
          status: 401,
          message: "User & Email Exists, try logging in",
        });
      } else {
        const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const newUser = new users({
          fName,
          lName,
          email,
          mobile,
          gender,
          status,
          profile: file,
          location,
          dateCreated,
        });
        await newUser.save();
        res
          .status(201)
          .json({ status: 201, message: "User Saved", data: newUser });
      }
    } catch (error) {
      console.log("error while saving data", error);
      res
        .status(401)
        .json({ status: 401, message: "couldn't save data in DB" });
    }
  }
};

//to get all users
exports.getusers = async (req, res) => {
  const searchVal = req.query.search || "";
  const gender = req.query.gender || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 4;

  const query = {
    fName: { $regex: searchVal, $options: "i" },
  };

  if (gender !== "All") {
    query.gender = gender;
  }
  if (status !== "All") {
    query.status = status;
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;
    const usersCount = await users.countDocuments(query);
    const pageCount = Math.ceil(usersCount / ITEM_PER_PAGE);

    const allUsers = await users
      .find(query)
      .sort({ dateCreated: sort == "new" ? -1 : 1 })
      .skip(skip)
      .limit(ITEM_PER_PAGE);

    res.status(200).json({
      status: 200,
      message: "users fetched",
      data: allUsers,
      paginationData: {
        usersCount,
        pageCount,
      },
    });
  } catch (error) {
    console.log("error fetching all users from db", error);
    res.status(401).json({ status: 401, error: error });
  }
};

//to get single user
exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await users.findOne({ _id: id });
    res
      .status(200)
      .json({ status: 200, message: "fetched single user", data: singleUser });
  } catch (error) {
    console.log("error in fetching single user", error);
    res.status(401).json({
      status: 401,
      message: "error in fetching single user",
      error: error,
    });
  }
};

//to update single user
exports.updateSingleUser = async (req, res) => {
  const { id } = req.params;
  const {
    fName,
    lName,
    email,
    mobile,
    gender,
    location,
    status,
    user_profile,
  } = req.body;
  const file = req.file ? req.file.filename : user_profile;
  const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

  try {
    const updatedUser = await users.findByIdAndUpdate(
      { _id: id },
      {
        fName,
        lName,
        email,
        mobile,
        gender,
        status,
        profile: file,
        location,
        dateUpdated,
      },
      { new: true }
    );
    await updatedUser.save();
    res.status(200).json({ status: 200, data: updatedUser });
  } catch (error) {
    console.log(("error while updating", error));
    res.status(401).json({ error: error, status: 401 });
  }
};

//to delete single user
exports.deleteSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await users.findByIdAndDelete({ _id: id });
    res.status(200).json({
      status: 200,
      deletedUser: deletedUser,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log("error deleting user", error);
    res
      .status(401)
      .json({ status: 401, errpr: error, message: "error deleting user" });
  }
};

//to update status on click, active or inactive
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const updateUser = await users.findByIdAndUpdate(
      { _id: id },
      { status: data },
      { new: true }
    );
    // await updateUser.save();
    res
      .status(200)
      .json({ status: 200, message: "successfully updated", data: updateUser });
  } catch (error) {
    console.log("error while setting the status", error);
    res.status(401).json({
      status: 401,
      error: error,
      message: "couldn't update status, try again",
    });
  }
};

//to send csv format data of users
exports.userExportCsv = async (req, res) => {
  try {
    const allUsers = await users.find();
    const csvStream = csv.format({ headers: true });
    if (!fs.existsSync("public/files/exports")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }
      if (!fs.existsSync("public/files/exports")) {
        fs.mkdirSync("./public/files/exports");
      }
    }
    const writableStream = fs.createWriteStream(
      "public/files/exports/users.csv"
    );
    csvStream.pipe(writableStream);
    writableStream.on("finish", function () {
      res
        .status(200)
        .json({
          downloadURL: `${process.env.BASE_URL}/files/exports/users.csv`,
        });
    });
    if (allUsers.length > 0) {
      allUsers.map((user) => {
        csvStream.write({
          FirstName: user.fName ? user.fName : "-",
          LastName: user.lName ? user.lName : "-",
          Email: user.email ? user.email : "-",
          Phone: user.mobile ? user.mobile : "-",
          Gender: user.gender ? user.gender : "-",
          Status: user.status ? user.status : "-",
          Profile: user.profile ? user.profile : "-",
          Location: user.location ? user.location : "-",
          DateCreated: user.dateCreated ? user.dateCreated : "-",
          DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
        });
      });
    }
    csvStream.end();
    writableStream.end();
  } catch (error) {
    console.log("error while exporting csv data", error);
    res.status(401).json({
      error: error,
      message: "error in exporting data api",
      status: 401,
    });
  }
};
