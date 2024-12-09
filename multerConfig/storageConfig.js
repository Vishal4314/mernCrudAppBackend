const multer = require("multer");

//storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const filename = `image-${Date.now()}.${file.originalname}`;
    cb(null, filename);
  },
});

//file filter
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new Error("Only .png .jpg & .jpeg formats are allowed for image.")
    );
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = upload;
