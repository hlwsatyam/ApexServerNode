const BankAccount = require("../modals/BankModal");
const auBank = require("../modals/auModal");
const induslndBank = require("../modals/induslndModal");
const UserModal = require("../modals/loginModal");
const SBI = require("../modals/sbiModal");
const yesBank = require("../modals/yesModal");
const axisBank = require("../modals/AxisModal");
const mongoose = require("mongoose");
const {
  sendEmailToUserWithTheirPassword,
} = require("../supportiveFunction/Emailer");
const { validateEmail } = require("../supportiveFunction/validation");
const hsbcBank = require("../modals/hsbcModal");
const hdfcBank = require("../modals/hdfcModal");
const idfcBank = require("../modals/IdfcModal");
const americanBank = require("../modals/americanModal");
const standardBank = require("../modals/standardModal");
const loan = require("../modals/loanForm");
const app = {
  signup: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
      const file = req.files;
      if (!name || name == "") {
        return res.status(203).send({
          message: "Name is required",
          status: false,
        });
      }
      if (!email || email == "" || !validateEmail(email)) {
        return res.status(203).send({
          message: "Valid Gmail is required",
          status: false,
        });
      }

      if (password?.length < 6) {
        return res.status(203).send({
          message: "Password must be 6 characters long",
          status: false,
        });
      }
      if (password !== confirmPassword) {
        return res.status(203).send({
          message: "Password and Confirm Password does not match",
          status: false,
        });
      }
      if (!file?.userPic[0]?.filename) {
        return res.status(203).send({
          message: "UserPic is required",
          status: false,
        });
      }
      if (!file?.adhaarBackPic[0]?.filename) {
        return res.status(203).send({
          message: "AdharBackPic is required",
          status: false,
        });
      }
      if (!file?.adhaarFrontPic[0]?.filename) {
        return res.status(203).send({
          message: "AdharFrontPic is required",
          status: false,
        });
      }
      const isUserExist = await UserModal.findOne({ email: email });

      if (isUserExist) {
        return res.status(203).send({
          message: "User already exist",
          status: false,
        });
      }
      const userInfo = new UserModal({
        name: name,
        email: email,
        password: password,
        userPic: file.userPic[0].filename,
        adharBackPic: file.adhaarBackPic[0].filename,
        adharFrontPic: file.adhaarFrontPic[0].filename,
        confirmPassword: confirmPassword,
      });

      await userInfo.save();

      res.status(200).send({
        message: "Welcome to the signup page",
        status: true,
        agentId: userInfo._id,
      });
    } catch (error) {
      console.log(error);
      res.status(203).send({
        message: "something went worng",
        status: false,
      });
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || email == "" || !validateEmail(email)) {
        return res.status(203).json({
          message: "Valid Gmail is required",
          status: false,
        });
      }
      if (!password || password == "") {
        return res.status(203).json({
          message: "Password is required",
          status: false,
        });
      }
      const user = await UserModal.findOne({ email: email });
      if (!user) {
        return res.status(203).json({
          message: "User does not exist",
          status: false,
        });
      }
      // Now, check the password
      const isValidPassword = user.password === password;
      if (!isValidPassword) {
        return res.status(203).json({
          message: "Invalid password",
          status: false,
        });
      }
      res.status(200).send({
        message: "Login Success",
        status: true,
        agentId: user._id,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during login:", error);
      return res.status(203).json({
        message: "Internal server error",
        status: false,
      });
    }
  },
  updateUser: async (req, res) => {
    const {
      name,
      agentId,
      country,
      state,
      city,
      occupation,
      experience,
      phone,
    } = req.body;
    try {
      console.log(agentId);
      if (!name || name == "") {
        return res.status(203).send({
          message: "Name is required",
          status: false,
        });
      }
      if (!phone || phone == "" || phone.length <= 9) {
        return res.status(203).send({
          message: "Valid Phone is required",
          status: false,
        });
      }
      if (!country || country == "") {
        return res.status(203).send({
          message: "Country is required",
          status: false,
        });
      }
      if (!state || state == "") {
        return res.status(203).send({
          message: "State is required",
          status: false,
        });
      }
      if (!city || city == "") {
        return res.status(203).send({
          message: "city is required",
          status: false,
        });
      }

      await UserModal.findByIdAndUpdate(agentId, {
        name: name,
        country: country,
        state: state,
        city: city,
        occupation: occupation,
        experience: experience,
        phone: phone,
      });

      res.status(200).send({
        message: "Updated!",
        status: true,
      });
    } catch (error) {
      res.status(203).send({
        message: "something went worng",
        status: false,
      });
    }
  },
  formSubmitSBI: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Pan No": panNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }
      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new SBI({
        fullName,
        mobileNo,
        motherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        companyName,
        designation: Designation,
      });

      await newForm.save();

      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmityesBank: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Aadhaar No": aadhaarNo,
      "Pan No": panNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,

      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,

      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,

      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (
        !aadhaarNo ||
        aadhaarNo.trim() === "" ||
        isNaN(aadhaarNo) ||
        aadhaarNo.length < 12
      ) {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }

      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }

      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new yesBank({
        fullName,
        mobileNo,
        motherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },

        companyName,
        designation: Designation,
      });

      await newForm.save();

      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitauBank: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Aadhaar No": aadhaarNo,
      "Pan No": panNo,
      "Date Of Birth": dateOfBirth,
      "Office Optional Email": officeEmaill,
      "Email Id": emailId,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,

      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,

      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,

      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (
        !aadhaarNo ||
        aadhaarNo.trim() === "" ||
        isNaN(aadhaarNo) ||
        aadhaarNo.length < 12
      ) {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }

      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }

      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new auBank({
        fullName,
        mobileNo,
        motherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        companyName,
        designation: Designation,
      });

      await newForm.save();

      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitinduslndBank: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Aadhaar No": aadhaarNo,
      "Pan No": panNo,
      "Date Of Birth": dateOfBirth,
      "Office Optional Email": officeEmaill,
      "Email Id": emailId,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,
      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (
        !aadhaarNo ||
        aadhaarNo.trim() === "" ||
        isNaN(aadhaarNo) ||
        aadhaarNo.length < 12
      ) {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }

      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }

      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new induslndBank({
        fullName,
        mobileNo,
        motherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        companyName,
        designation: Designation,
      });

      await newForm.save();

      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitaxisBank: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,

      "Pan No": panNo,
      "Date Of Birth": dateOfBirth,

      "Email Id": emailId,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,

      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,

      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,

      "Company Name": companyName,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }

      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }

      // Assuming all fields are valid, create a new form
      const newForm = new axisBank({
        fullName,
        mobileNo,
        motherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        companyName,
      });

      await newForm.save();

      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmithsbc: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Pan No": panNo,
      "Aadhaar No": aadhaarNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Official Email Id": officeEmaill,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,
      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (!aadhaarNo || isNaN(aadhaarNo) || aadhaarNo.trim() === "") {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }
      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }
      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new hsbcBank({
        fullName,
        mobileNo,
        motherName,
        fatherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        officeEmaill,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        companyName,
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        designation: Designation,
      });

      await newForm.save();
      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmithdfc: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Pan No": panNo,
      "Aadhaar No": aadhaarNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Official Email Id": officeEmaill,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,
      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (!aadhaarNo || isNaN(aadhaarNo) || aadhaarNo.trim() === "") {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }
      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }
      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new hdfcBank({
        fullName,
        mobileNo,
        motherName,
        fatherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        officeEmaill,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        companyName,
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        designation: Designation,
      });

      await newForm.save();
      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitIdfc: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Pan No": panNo,
      "Aadhaar No": aadhaarNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Official Email Id": officeEmaill,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,
      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (!aadhaarNo || isNaN(aadhaarNo) || aadhaarNo.trim() === "") {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }
      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }
      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new idfcBank({
        fullName,
        mobileNo,
        motherName,
        fatherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        officeEmaill,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        companyName,
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        designation: Designation,
      });
      await newForm.save();
      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitamerican: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Pan No": panNo,
      "Aadhaar No": aadhaarNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Official Email Id": officeEmaill,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,
      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (!aadhaarNo || isNaN(aadhaarNo) || aadhaarNo.trim() === "") {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }
      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!officeEmaill || officeEmaill.trim() === "") {
        return res.status(203).send({
          message: "Official Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }
      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new americanBank({
        fullName,
        mobileNo,
        motherName,
        fatherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        officeEmaill,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        companyName,
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        designation: Designation,
      });
      await newForm.save();
      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitstandard: async (req, res) => {
    const {
      "Full Name": fullName,
      "Mobile No": mobileNo,
      "Mother Name": motherName,
      "Father Name": fatherName,
      "Pan No": panNo,
      "Aadhaar No": aadhaarNo,
      "Date Of Birth": dateOfBirth,
      "Email Id": emailId,
      "Official Email Id": officeEmaill,
      "Residence Address Line 1": residenceAddressLine1,
      "Residence Address Line 2": residenceAddressLine2,
      "Residence Address Line 3": residenceAddressLine3,
      "Residence Address Landmark": residenceAddressLandmark,
      "Residence Address Pincode": residenceAddressPincode,
      "Office Address Line 1": officeAddressLine1,
      "Office Address Line 2": officeAddressLine2,
      "Office Address Landmark": officeAddressLandmark,
      "Office Address Pincode": officeAddressPincode,
      "Company Name": companyName,
      Designation,
    } = req.body.formData;
    const { agentId } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }
      // Validate Mother Name, similarly for other fields
      if (!motherName || motherName.trim() === "") {
        return res.status(203).send({
          message: "Mother Name is required",
          status: false,
        });
      }
      if (!fatherName || fatherName.trim() === "") {
        return res.status(203).send({
          message: "Father Name is required",
          status: false,
        });
      }
      if (!panNo || panNo.trim() === "") {
        return res.status(203).send({
          message: "PAN Number is required",
          status: false,
        });
      }
      if (!aadhaarNo || isNaN(aadhaarNo) || aadhaarNo.trim() === "") {
        return res.status(203).send({
          message: "Aadhaar Number is required",
          status: false,
        });
      }
      if (!dateOfBirth || dateOfBirth.trim() === "") {
        return res.status(203).send({
          message: "Date of Birth is required",
          status: false,
        });
      }
      if (!emailId || emailId.trim() === "") {
        return res.status(203).send({
          message: "Email ID is required",
          status: false,
        });
      }
      if (!officeEmaill || officeEmaill.trim() === "") {
        return res.status(203).send({
          message: "Official Email ID is required",
          status: false,
        });
      }
      if (!residenceAddressLine1 || residenceAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 1 is required",
          status: false,
        });
      }
      if (!residenceAddressLine2 || residenceAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 2 is required",
          status: false,
        });
      }
      if (!residenceAddressLine3 || residenceAddressLine3.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Line 3 is required",
          status: false,
        });
      }
      if (!residenceAddressLandmark || residenceAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Landmark is required",
          status: false,
        });
      }
      if (!residenceAddressPincode || residenceAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Residence Address Pincode is required",
          status: false,
        });
      }
      if (!companyName || companyName.trim() === "") {
        return res.status(203).send({
          message: "Company Name is required",
          status: false,
        });
      }

      if (!officeAddressLine1 || officeAddressLine1.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 1 is required",
          status: false,
        });
      }
      if (!officeAddressLine2 || officeAddressLine2.trim() === "") {
        return res.status(203).send({
          message: "Office Address Line 2 is required",
          status: false,
        });
      }
      if (!officeAddressLandmark || officeAddressLandmark.trim() === "") {
        return res.status(203).send({
          message: "Office Address Landmark is required",
          status: false,
        });
      }
      if (!officeAddressPincode || officeAddressPincode.trim() === "") {
        return res.status(203).send({
          message: "Office Address Pincode is required",
          status: false,
        });
      }
      if (!Designation || Designation.trim() === "") {
        return res.status(203).send({
          message: "Designation is required",
          status: false,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new standardBank({
        fullName,
        mobileNo,
        motherName,
        fatherName,
        panNo,
        dateOfBirth,
        agentId,
        emailId,
        officeEmaill,
        residenceAddress: {
          line1: residenceAddressLine1,
          line2: residenceAddressLine2,
          line3: residenceAddressLine3,
          landmark: residenceAddressLandmark,
          pincode: residenceAddressPincode,
        },
        companyName,
        officeAddress: {
          line1: officeAddressLine1,
          line2: officeAddressLine2,
          landmark: officeAddressLandmark,
          pincode: officeAddressPincode,
        },
        designation: Designation,
      });
      await newForm.save();
      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  formSubmitloan: async (req, res) => {
    const { "Full Name": fullName, "Mobile No": mobileNo } = req.body.formData;
    const { agentId, formName } = req.body;
    try {
      // Validate Full Name
      if (!fullName || fullName.trim() === "") {
        return res.status(203).send({
          message: "Full Name is required",
          status: false,
        });
      }
      // Validate Mobile Number
      if (!mobileNo || mobileNo.trim() === "" || mobileNo.length <= 9) {
        return res.status(203).send({
          message: "Valid Mobile Number is required",
          status: false,
        });
      }

      // Assuming all fields are valid, create a new form
      const newForm = new loan({
        fullName,
        mobileNo,
        agentId,
        reason: formName,
      });
      await newForm.save();
      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  backendLogin: async (req, res, next) => {
    try {
      res.status(200).json({ message: "Logged", data: 1002187 });
    } catch (error) {
      res.status(203).json({ message: "Not Logged", data: null });
    }
  },
  leadDetailsFromBackend: async (req, res, next) => {
    const { page = 1, status } = req.params;
    try {
      const { text } = req.body;
      const itemsPerPage = 15;
      const skip = (page - 1) * itemsPerPage;
      let query = {};

      if (text || text != "") {
        query = {
          $or: [
            { mobileNo: { $regex: text, $options: "i" } },
            { fullName: { $regex: text, $options: "i" } },
          ],
        };
      }

      if (status !== "null") {
        query.status = status;
      }

      const allModal = [
        auBank,
        induslndBank,
        SBI,
        yesBank,
        axisBank,
        hsbcBank,
        hdfcBank,
        idfcBank,
        americanBank,
        standardBank,
        loan,
      ];
      let results = [];

      for (const model of allModal) {
        const data = await model
          .find(query)
          .skip(skip)
          .limit(itemsPerPage)
          .exec();
        results = results.concat(data);
      }

      res.status(200).send(results);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during fetching lead details:", error);
      return res.status(500).json({
        message: "Internal server error",
        status: false,
      });
    }
  },
  leadResponse: async (req, res, next) => {
    try {
      const { response, modalName, id } = req.body;
      const Model = mongoose.model(modalName);

      await Model.findByIdAndUpdate(id, {
        status: response,
        reapply: false,
      });

      res.status(200).send("Response Update!");
    } catch (error) {
      res.status(500).send("Response Update Failed!");
    }
  },
  leadReapply: async (req, res, next) => {
    try {
      const { leadId, modalName } = req.body;

      const Model = mongoose.model(modalName);

      await Model.findByIdAndUpdate(leadId, {
        reapply: true,
      });

      res.status(200).json({ message: "Lead Reapplied!" });
    } catch (error) {
      console.log(error);
      return res.status(203).json({ message: "Something Went Worng!" });
    }
  },
  accountDetails: async (req, res) => {
    const {
      "Account Holder Name": accountHolderName,
      "Account No": accountNumber,
      "Ifsc Code": ifscCode,
    } = req.body.formData;
    const { agentId, isUpdated } = req.body;

    try {
      // Validate Full Name
      if (!accountHolderName || accountHolderName.trim() === "") {
        return res.status(203).send({
          message: "Account Holder Name is required",
          status: false,
        });
      }
      if (!accountNumber || accountNumber.trim() === "") {
        return res.status(203).send({
          message: "Account Number is required",
          status: false,
        });
      }
      if (!ifscCode || ifscCode.trim() === "") {
        return res.status(203).send({
          message: "Ifsc is required",
          status: false,
        });
      }

      if (isUpdated) {
        await BankAccount.findOneAndUpdate(
          { agentId },
          {
            accountNumber,
            accountHolderName,
            ifscCode,
          }
        );
        return res.status(200).send({
          message: "Account Updated!",
          status: true,
        });
      }
      // Assuming all fields are valid, create a new form
      const newForm = new BankAccount({
        accountNumber,
        accountHolderName,
        ifscCode,
        agentId,
      });

      await newForm.save();

      res.status(200).send({
        message: "Form Submitted!",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(203).send({
        message: "Something went wrong",
        status: false,
      });
    }
  },
  userInfo: async (req, res, next) => {
    try {
      const { token } = req.body;
      const user = await UserModal.findById(token);

      if (!user) {
        return res.status(203).json({
          message: "User does not exist",
          status: false,
        });
      }
      res.status(200).send(user);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during login:", error);
      return res.status(203).json({
        message: "Internal server error",
        status: false,
      });
    }
  },
  accountInfo: async (req, res, next) => {
    try {
      const { agentId } = req.body;
      const user = await BankAccount.findOne({ agentId });
      console.log(agentId);
      if (!user) {
        return res.status(203).json({
          message: "User does not exist",
          status: false,
        });
      }
      res.status(200).send(user);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during login:", error);
      return res.status(203).json({
        message: "Internal server error",
        status: false,
      });
    }
  },
  leadDetails: async (req, res, next) => {
    const { page = 1, status } = req.params;
    try {
      const { agentId, text } = req.body;

      const itemsPerPage = 2;
      const skip = (page - 1) * itemsPerPage;

      let query = {
        agentId: agentId,
      };

      if (text || text != "") {
        query = {
          agentId: agentId,
          $or: [
            { mobileNo: { $regex: text, $options: "i" } },
            { fullName: { $regex: text, $options: "i" } },
          ],
        };
      }

      if (status !== "null") {
        query.status = status;
      }
      const allModal = [
        auBank,
        induslndBank,
        SBI,
        yesBank,
        axisBank,
        hsbcBank,
        hdfcBank,
        idfcBank,
        americanBank,
        standardBank,
        loan,
      ];
      let results = [];

      for (const model of allModal) {
        const data = await model
          .find(query)
          .skip(skip)
          .limit(itemsPerPage)
          .exec();
        results = results.concat(data);
      }

      res.status(200).send(results);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during fetching lead details:", error);
      return res.status(500).json({
        message: "Internal server error",
        status: false,
      });
    }
  },
  forgetPassword: async (req, res, next) => {
    const { email } = req.body;
    console.log(email);
    if (!validateEmail(email))
      return res.status(203).json({ status: false, message: "Invalid Email!" });

    try {
      const existingUser = await UserModal.findOne({
        email: email.toLowerCase(),
      });
      if (existingUser) {
        await sendEmailToUserWithTheirPassword(
          email.toLowerCase(),
          "Forgeted Password",
          existingUser.password
        );
        return res.status(200).json({ message: "Please Check Your Email" });
      } else {
        return res.status(203).json({
          message: "Internal server error",
          status: false,
        });
      }
    } catch (error) {
      return res.status(203).json({
        message: "Internal server error",
        status: false,
      });
    }
  },
  search: async (req, res, next) => {
    const { agentId, searchableText, page, filter } = req.params;
    console.log(agentId, searchableText, page, filter);
    try {
      const existingUsers = await SBI.find({
        agentId,
        $or: [
          { mobileNo: { $regex: searchableText, $options: "i" } },
          { fullName: { $regex: searchableText, $options: "i" } },
        ],
      });
      if (existingUsers.length > 0) {
        return res.status(200).send(existingUsers);
      } else {
        return res
          .status(203)
          .json({ message: "Guest Not Found!", status: false });
      }
    } catch (error) {
      console.error(error);
      return next(CreateError(500, error.message));
    }
  },
};
module.exports = app;
