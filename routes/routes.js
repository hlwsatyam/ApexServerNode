const express = require("express");
const app = require("../controllers");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uuid } = require("uuidv4");
const parentDirectory = path.resolve(__dirname, "..");
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${parentDirectory}/uploads`);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuid()}_${file.originalname}.png`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage: Storage });

router.post(
  "/signup",
  upload.fields([
    { name: "userPic" },
    { name: "adhaarFrontPic" },
    { name: "adhaarBackPic" },
  ]),
  app.signup
);

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server Running Successfully",
  });
});

router.post("/login", app.login);
router.post("/updateuser", app.updateUser);
router.post("/v1/user", app.userInfo);
router.post("/forgetPassword", app.forgetPassword);
router.post("/formSubmit/sbi", app.formSubmitSBI);
router.post("/formSubmit/yesBank", app.formSubmityesBank);
router.post("/formSubmit/auBank", app.formSubmitauBank);
router.post("/formSubmit/induslndBank", app.formSubmitinduslndBank);
router.post("/formSubmit/axisBank", app.formSubmitaxisBank);
router.post("/formSubmit/hsbc", app.formSubmithsbc);
router.post("/formSubmit/hdfc", app.formSubmithdfc);
router.post("/formSubmit/Idfc", app.formSubmitIdfc);
router.post("/formSubmit/american", app.formSubmitamerican);
router.post("/formSubmit/standard", app.formSubmitstandard);
router.post("/formSubmit/loanForm", app.formSubmitloan);
router.post("/leadDetails/:page/:status", app.leadDetails);
router.post("/accountDetails", app.accountDetails);
router.post("/vi/accountInfo", app.accountInfo);
// for Backend
router.post("/backendLogin", app.backendLogin);
router.post(
  "/v1/leadFromBackendDetails/:page/:status",
  app.leadDetailsFromBackend
);
router.post("/v1/leadResponse", app.leadResponse);
router.post("/v1/reapply", app.leadReapply);

// router.get("/search/:searchableText/:agentId/:page/:status", app.search);
module.exports = router;
