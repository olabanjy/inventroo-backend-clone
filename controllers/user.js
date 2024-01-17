const User = require("../models/User");
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const { generateToken } = require("../helpers/tokens");
const { validateLength } = require("../helpers/validation");
const seedrandom = require("seedrandom");
const nodemailer = require("nodemailer");
const moment = require("moment");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

exports.registerUser = async (req, res) => {
  try {
    const { business_name, email, password, pin } = req.body;

    if (!isEmail(email))
      return res.status(401).json({
        message: "Invalid email address",
      });

    if (!validateLength(business_name, 3, 30)) {
      return res.status(400).json({
        message: "Business name must between 3 and 30 characters.",
      });
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters.",
      });
    }

    let userEmailExist = await User.findOne({
      email: email.toLowerCase(),
    }).exec();

    if (userEmailExist)
      return res.status(400).json({ message: "Email address already exist" });

    const cryptedPassword = await bcrypt.hash(password, 12);
    const cryptedPin = await bcrypt.hash(pin, 12);

    const randomCode = seedrandom(crypto.randomBytes(64).toString("base64"), {
      entropy: true,
    });

    const code = randomCode().toString().substring(3, 9);

    const companyName = business_name
      .split(" ")
      .map((word) => word[0])
      .join("");

    const randomInt = Math.floor(Math.random() * 900000) + 100000;
    const uuid = uuidv4().substring(0, 4) + randomInt.toString();
    const uniqueId = uuid.substring(uuid.length - 4);

    console.log("Code", code);
    const tokenExp = new Date();

    const user = await new User({
      business_name,
      email,
      password: cryptedPassword,
      verifyOtp: code,
      tokenExpired: tokenExp,
      account_type: "",
      business_category: "",
      business_email: "",
      business_company: "",
      company_reg_num: "",
      business_tax_id: "",
      business_phone: "",
      business_website: "",
      business_home_add1: "",
      business_home_add2: "",
      business_city: "",
      business_state: "",
      business_country: "",
      business_fiscal_year_from: null,
      business_fiscal_year_to: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      unique_company_id: companyName + uniqueId,
      registered_home_add: "",
      personal_phone: "",
      personal_city: "",
      personal_state: "",
      personal_country: "",
      payout_business_name: "",
      payout_account_num: "",
      payout_account_bank_name: "",
      payout_account_bank_bvn: "",
      payout_account_country: "",
      pin: cryptedPin,
    }).save();

    res.status(200).json({
      message:
        "Registration successful ! please activate your account with OTP",
    });

    let transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 587,
      secure: true,
      headers: {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high",
      },
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    let mailOptions = {
      from: `${process.env.SITE_NAME} <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Verify your email address",
      html: `
      <div style="max-width: 900px;margin: 0 auto;">
      <div style="margin-bottom:1rem;text-align: center; gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
      <span style="font-size: 25px;">Action required : Activate your ${process.env.SITE_NAME} account</span>
      </div>

      <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>
      Hello ${user.business_name}, </span>
      <div style="padding:5px 0"><span style="padding:1.5rem 0">
      You recently created an account on ${process.env.SITE_NAME}. <br> To complete your registration, please confirm your account with OTP Code.
      </span>
      </div>
      <div><span style="margin:1.5rem 0;color:#898f9c">
      <h4>OTP will be expired within 24 hours</h4>
      <h3>Use this code to verify your email address: ${user.email}</h3>

      <p style="border-radius: 3px; background: #ddd; text-align:center; padding: 10px; color: #000;font-size: 30px;letter-spacing: 15px;"><b>${code}</b></p>
      <p style="text-align: center; font-size: 14px;">&copy; ${process.env.SITE_NAME}</p></span></div></div>
      </div>

      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send({
          message: "Code sent successfully",
        });
        console.log("Email sent");
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};

exports.registerCompanyUser = async (req, res) => {
  try {
    const { business_name, email, password } = req.body;

    if (!isEmail(email))
      return res.status(401).json({
        message: "Invalid email address",
      });

    if (!validateLength(business_name, 3, 30)) {
      return res.status(400).json({
        message: "Business name must between 3 and 30 characters.",
      });
    }

    if (!validateLength(password, 4, 40)) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters.",
      });
    }

    let userEmailExist = await User.findOne({
      email: email.toLowerCase(),
    }).exec();

    if (userEmailExist)
      return res.status(400).json({ message: "Email address already exist" });

    const pinNew = "1234";
    const hashedPin = await bcrypt.hash(pinNew, 12);

    const cryptedPassword = await bcrypt.hash(password, 12);

    const companyName = business_name
      .split(" ")
      .map((word) => word[0])
      .join("");

    const randomInt = Math.floor(Math.random() * 900000) + 100000;
    const uuid = uuidv4().substring(0, 4) + randomInt.toString();
    const uniqueId = uuid.substring(uuid.length - 4);

    const user = await new User({
      business_name,
      email,
      password: cryptedPassword,
      account_type: "",
      business_category: "",
      business_email: "",
      business_company: "",
      company_reg_num: "",
      business_tax_id: "",
      business_phone: "",
      business_website: "",
      business_home_add1: "",
      business_home_add2: "",
      business_city: "",
      business_state: "",
      business_country: "",
      business_fiscal_year_from: null,
      business_fiscal_year_to: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      unique_company_id: companyName + uniqueId,
      registered_home_add: "",
      personal_phone: "",
      personal_city: "",
      personal_state: "",
      personal_country: "",
      payout_business_name: "",
      payout_account_num: "",
      payout_account_bank_name: "",
      payout_account_bank_bvn: "",
      payout_account_country: "",
      pin: hashedPin,
      isApproved: true,
    }).save();

    res.status(200).json({
      message: "Registration successful!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};

exports.completeRegister = async (req, res) => {
  try {
    const { email, vcode } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    const date1 = moment(user.tokenExpired)
      .add(24, "hours")
      .format("DD-MM-YYYY, hh:mm A");
    const date2 = moment(new Date()).format("DD-MM-YYYY, hh:mm A");
    const format = "DD-MM-YYYY, hh:mm A";
    const result = moment(date2, format).isBefore(moment(date1, format));

    if (result === false) {
      return res.status(400).json({
        message: "Your OTP has been expired.",
      });
    }

    if (user.verifyOtp !== vcode) {
      return res.status(400).json({
        message: "Invalid code",
      });
    } else {
      user.verifyOtp = null;
      user.verified = true;
      await user.save();
      res.status(200).json({
        message:
          "Your account has been verified.\nYou will be notified when your account will be activated",
      });

      // const token = generateToken({ id: user._id.toString() }, '30d')
      // res.send({
      //   id: user._id,
      //   business_name: user.business_name,
      //   email: user.email.toLowerCase(),
      //   token,
      //   verified: user.verified,
      //   role: user.role,
      // })
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    let foundInUserCollection = true;

    if (!user) {
      user = await Employee.findOne({ email })
        .populate("company")
        .populate("role")
        .select("-password, -pinField, ");
      foundInUserCollection = false;
    }

    if (!user) {
      return res.status(400).json({
        message:
          "The email address you entered is not connected to an account.",
      });
    }

    if (foundInUserCollection && !user.isApproved) {
      return res.status(400).json({
        message:
          "Your account is not approved yet! Please contact Administrator.",
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        message:
          "You account has been blocked. Please contact Administrator to unblocked",
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again.",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "30d");
    if (foundInUserCollection) {
      const {
        account_type,
        business_email,
        business_company,
        business_category,
        company_reg_num,
        business_tax_id,
        business_phone,
        business_website,
        business_home_add1,
        business_home_add2,
        business_city,
        business_state,
        business_country,
        business_fiscal_year_from,
        business_fiscal_year_to,
        first_name,
        middle_name,
        last_name,
        registered_home_add,
        personal_phone,
        personal_city,
        personal_state,
        personal_country,
        payout_business_name,
        payout_account_num,
        payout_account_bank_name,
        payout_account_bank_bvn,
        payout_account_country,
      } = user;

      res.send({
        id: user._id,
        name: user.business_name,
        email: user.email.toLowerCase(),
        token,
        role: user.role,
        profile_img: user.profile_image_link,
        company_id: user.unique_company_id,
        businessProfile: {
          account_type,
          business_email,
          business_company,
          business_category,
          company_reg_num,
          business_tax_id,
          business_phone,
          business_website,
          business_home_add1,
          business_home_add2,
          business_city,
          business_state,
          business_country,
          business_fiscal_year_from,
          business_fiscal_year_to,
          first_name,
          middle_name,
          last_name,
          registered_home_add,
          personal_phone,
          personal_city,
          personal_state,
          personal_country,
          payout_business_name,
          payout_account_num,
          payout_account_bank_name,
          payout_account_bank_bvn,
          payout_account_country,
        },
      });
    } else {
      res.send({
        id: user._id,
        name: user.name,
        email: user.email.toLowerCase(),
        token,
        role: {
          role_name: user.role.role_modules[0].role_name,
          description: user.role.role_modules[0].description,
          id: user.role._id,
        },
        profile_img: user.profile_image_link,
        company_id: user.company.unique_company_id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.pinLogin = async (req, res) => {
  try {
    const { pin } = req.body;

    const user = await User.findOne({});
    const employee = await Employee.findOne({})
      .populate("company")
      .populate("role")
      .select("-password, -pinField, ");

    if (!user && !employee) {
      return res.status(400).json({ message: "Invalid PIN." });
    }

    let userData = null;
    let isMatch = false;

    let userFind = false;

    if (user) {
      isMatch = await bcrypt.compare(pin, user.pin);
      if (isMatch) {
        userData = user;
        userFind = true;
      }
    }

    if (!isMatch && employee !== null) {
      isMatch = await bcrypt.compare(pin, employee.pinField);
      if (isMatch) {
        userData = employee;
        userFind = false;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid PIN." });
    }

    const token = generateToken({ id: userData._id.toString() }, "30d");

    if (user && userFind) {
      const {
        account_type,
        business_email,
        business_company,
        business_category,
        company_reg_num,
        business_tax_id,
        business_phone,
        business_website,
        business_home_add1,
        business_home_add2,
        business_city,
        business_state,
        business_country,
        business_fiscal_year_from,
        business_fiscal_year_to,
        first_name,
        middle_name,
        last_name,
        registered_home_add,
        personal_phone,
        personal_city,
        personal_state,
        personal_country,
        payout_business_name,
        payout_account_num,
        payout_account_bank_name,
        payout_account_bank_bvn,
        payout_account_country,
      } = userData;

      res.send({
        id: userData._id,
        name: userData.business_name,
        email: userData.email.toLowerCase(),
        token,
        role: userData.role,
        profile_img: userData.profile_image_link,
        company_id: userData.unique_company_id,
        businessProfile: {
          account_type,
          business_email,
          business_company,
          business_category,
          company_reg_num,
          business_tax_id,
          business_phone,
          business_website,
          business_home_add1,
          business_home_add2,
          business_city,
          business_state,
          business_country,
          business_fiscal_year_from,
          business_fiscal_year_to,
          first_name,
          middle_name,
          last_name,
          registered_home_add,
          personal_phone,
          personal_city,
          personal_state,
          personal_country,
          payout_business_name,
          payout_account_num,
          payout_account_bank_name,
          payout_account_bank_bvn,
          payout_account_country,
        },
      });
    } else if (employee) {
      const {
        name,
        email,
        role,
        profile_image_link,
        company: { unique_company_id },
      } = employee;

      console.log(employee);

      res.send({
        id: employee._id,
        name,
        email: email.toLowerCase(),
        token,
        role: {
          role_name: role.role_modules[0].role_name,
          description: role.role_modules[0].description,
          id: role._id,
        },
        profile_img: profile_image_link,
        company_id: unique_company_id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });

    let foundInUserCollection = true;

    if (!user) {
      user = await Employee.findOne({ email: email.toLowerCase() });
      foundInUserCollection = false;
    }

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    const randomCode = seedrandom(crypto.randomBytes(64).toString("base64"), {
      entropy: true,
    });

    const code = randomCode().toString().substring(3, 9);

    user.resetCode = code;

    await user.save();

    let transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 587,
      secure: true,
      headers: {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high",
      },
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    const username = foundInUserCollection ? user.business_name : user.name;

    let mailOptions = {
      from: `${process.env.SITE_NAME} <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Forgot password OTP Code",
      html: `
        <div style="max-width: 900px;margin: 0 auto;">
        <div style="margin-bottom:1rem;text-align: center; gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
        <span style="font-size: 25px;">Forgot password ${process.env.SITE_NAME} account</span>
        </div>

        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>
        Hello ${username}, </span>
        <div style="padding:5px 0"><span style="padding:1.5rem 0">
        You recently request to reset the password for your account on ${process.env.SITE_NAME}. <br> To reset your password please verify with OTP Code.
        </span>
        </div>
        <div><span style="margin:1.5rem 0;color:#898f9c">
        <h3>Use this code to reset your password</h3>
        <p style="border-radius: 3px; background: #ddd; text-align:center; padding: 10px; color: #000;font-size: 30px;letter-spacing: 15px;"><b>${code}</b></p>
        <p style="text-align: center; font-size: 14px;">&copy; ${process.env.SITE_NAME}</p></span></div></div>
        </div>

        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          message: "Code sent successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};

exports.forgotPasswordCode = async (req, res) => {
  try {
    const { email, vcode } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await Employee.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    if (user.resetCode !== vcode) {
      return res.status(400).json({
        message: "Invalid code",
      });
    } else {
      return res.status(200).json({
        message: "Code verified",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};

exports.forgotPasswordUpdate = async (req, res) => {
  try {
    const { email, vcode, password } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await Employee.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    if (user.resetCode !== vcode) {
      return res.status(400).json({
        message: "Invalid code",
      });
    } else {
      user.password = await bcrypt.hash(password, 10);
      user.resetCode = null;
      await user.save();
      return res.status(200).json({
        message: "Password updated successfully. Please login",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};

exports.readAllUsers = async (req, res) => {
  try {
    const user = await User.find({
      _id: { $ne: req.user.id },
    }).exec();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.accountApproval = async (req, res) => {
  const { id, isApproved } = req.body.newdata;

  try {
    let user = await User.findById(id).exec();

    const updated = await User.findOneAndUpdate(
      { _id: id },
      {
        isApproved: isApproved,
      },
      { new: true }
    ).exec();

    res.json(updated);

    let transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 587,
      secure: true,
      headers: {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high",
      },
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    let mailOptions = {
      from: `${process.env.SITE_NAME} <${process.env.ZOHO_EMAIL}>`,
      to: user.email,
      subject: `${process.env.SITE_NAME} account updated`,
      html: `
        <div style="max-width: 900px;margin: 0 auto;">
        <div style="margin-bottom:1rem;text-align: center; gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">

        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>
        Hello ${user.business_name}, </span>

        <div style="padding:5px 0">
        ${
          isApproved === false
            ? '<span style="padding:1.5rem 0; font-size: 22px; color: #C41E3A;">Temporally disabled</span>'
            : '<span style="padding:1.5rem 0; font-size: 22px; color: #77B803;">Great news</span>'
        }.


        </div>

        <div style="padding:5px 0"><span style="padding:1.5rem 0">
        Your account has been ${
          isApproved === false ? "deactivated" : "approved"
        }.
        ${
          isApproved === false
            ? "You can not use " + process.env.SITE_NAME + " modules."
            : "You can use " + process.env.SITE_NAME + " modules."
        }

        </span>
        </div>
        <div><span style="margin:1.5rem 0;color:#898f9c">
        <p style="text-align: center; font-size: 14px;">&copy; ${
          process.env.SITE_NAME
        }</p></span></div></div>
        </div>

        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          message: "Code sent successfully",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const {
      account_type,
      business_category,
      business_email,
      business_company,
      company_reg_num,
      business_tax_id,
      business_phone,
      business_website,
      business_home_add1,
      business_home_add2,
      business_city,
      business_state,
      business_country,
      business_fiscal_year_from,
      business_fiscal_year_to,
      first_name,
      last_name,
      registered_home_add,
      personal_phone,
      personal_city,
      personal_state,
      personal_country,
      payout_business_name,
      payout_account_num,
      payout_account_bank_name,
      payout_account_bank_bvn,
      payout_account_country,
    } = req.body.userData;

    const { id } = req.user;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({
        message:
          "The email address you entered is not connected to an account.",
      });
    }

    await User.findOneAndUpdate(
      { _id: id },
      {
        account_type,
        business_category,
        business_email,
        business_company,
        company_reg_num,
        business_tax_id,
        business_phone,
        business_website,
        business_home_add1,
        business_home_add2,
        business_city,
        business_state,
        business_country,
        business_fiscal_year_from,
        business_fiscal_year_to,
        first_name,
        last_name,
        registered_home_add,
        personal_phone,
        personal_city,
        personal_state,
        personal_country,
        payout_business_name,
        payout_account_num,
        payout_account_bank_name,
        payout_account_bank_bvn,
        payout_account_country,
      },
      { new: true }
    ).exec();

    res.status(200).json({
      message: "Profile Updated",
      data: {
        account_type,
        business_category,
        business_email,
        business_company,
        company_reg_num,
        business_tax_id,
        business_phone,
        business_website,
        business_home_add1,
        business_home_add2,
        business_city,
        business_state,
        business_country,
        business_fiscal_year_from,
        business_fiscal_year_to,
        first_name,
        last_name,
        registered_home_add,
        personal_phone,
        personal_city,
        personal_state,
        personal_country,
        payout_business_name,
        payout_account_num,
        payout_account_bank_name,
        payout_account_bank_bvn,
        payout_account_country,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
