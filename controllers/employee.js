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
const mongoose = require("mongoose");

exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, role, company, company_name } = req.body.employeeData;
    const [existingUser, existingEmployee] = await Promise.all([
      User.findOne({ email }),
      Employee.findOne({ email }),
    ]);

    if (existingUser || existingEmployee) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }

    const newEmployee = new Employee({
      name,
      email,
      role,
      company,
    });

    const token = crypto.randomBytes(20).toString("hex");

    newEmployee.registerToken = token;
    newEmployee.registerTokenExpires = Date.now() + 3600000; // 1 hour

    const savedEmployee = await newEmployee.save();
    res
      .status(201)
      .json({ message: "User added successfully.", data: savedEmployee });

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
      subject: company_name + " added you as employee",
      html: `
      <div style="max-width: 900px;margin: 0 auto;">
      <div style="margin-bottom:1rem;text-align: center; gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
      <span style="font-size: 25px;">You can manage module for ${company_name}</span>
      </div>

      <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>
      Hello ${name}, </span>
      <div style="padding:5px 0"><span style="padding:1.5rem 0">
      <a href="http://localhost:3000/set-credentials/${token}">Click here to set your password and pin</a>
      </span>
      </div>
      <div><span style="margin:1.5rem 0;color:#898f9c">
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

exports.getAllEmployees = async (req, res) => {
  try {
    const { companyId } = req.params;
    const employees = await Employee.find({ company: companyId });

    if (!employees || employees.length === 0) {
      res.status(404).json({ message: "No employees found for this company." });
      return;
    }

    res
      .status(200)
      .json({ message: "Employees retrieved successfully.", data: employees });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employees.", error });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, company, personal_phone, pin, password } =
      req.body;

    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }

    const bcryptPassword = await bcrypt.hash(password, 12);

    const updatedEmployeeData = {
      name,
      email,
      role,
      company,
      personal_phone,
      pin,
      password: bcryptPassword,
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: updatedEmployeeData },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee.", error });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }

    res.status(200).json({
      message: "Employee deleted successfully.",
      data: deletedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee.", error });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const employee = await Employee.findOne({
      registerToken: token,
      registerTokenExpires: { $gt: Date.now() },
    });

    if (!employee) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    res.status(200).json({ valid: true, data: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await Employee.find({ company: req.user.id })
      .sort([["createdAt", "desc"]])
      .select(
        "-password, -registerToken, -registerTokenExpires -isBlocked, -createdAt"
      )
      .populate("role")
      .exec();
    res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateUserData = async (req, res) => {
  const { name, email, role } = req.body.employeeData;

  try {
    const updated = await Employee.findOneAndUpdate(
      { _id: req.params.uId },
      {
        name,
        email,
        role,
      },
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.userResendLinkNew = async (req, res) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");

    const regToken = (registerToken = token);
    const regExp = (registerTokenExpires = Date.now() + 3600000);

    const updated = await Employee.findOneAndUpdate(
      { _id: req.params.uId },
      {
        registerToken: regToken,
        registerTokenExpires: regExp,
      },
      { new: true }
    ).exec();

    if (!updated) {
      throw new Error("User not found");
    }

    const { email, name, company: companyId } = updated;

    const company = await User.findById(companyId).exec();

    if (!company) {
      throw new Error("Company not found");
    }

    const company_name = company.business_name;

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
      to: email,
      subject: company_name + " added you as employee",
      html: `
      <div style="max-width: 900px;margin: 0 auto;">
      <div style="margin-bottom:1rem;text-align: center; gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
      <span style="font-size: 25px;">You can manage module for ${company_name}</span>
      </div>

      <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>
      Hello ${name}, </span>
      <div style="padding:5px 0"><span style="padding:1.5rem 0">
      <a href="${process.env.FRONTEND_URL}set-credentials/${token}">Click here to set your password and pin</a>
      </span>
      </div>
      <div><span style="margin:1.5rem 0;color:#898f9c">
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
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.setUserCredentials = async (req, res) => {
  const { name, email, password, pin } = req.body.employeeData;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedPin = await bcrypt.hash(pin, 12);

    const updated = await Employee.findOneAndUpdate(
      { _id: req.params.uId },
      {
        name,
        email,
        password: hashedPassword,
        pinField: hashedPin,
        verified: true,
        registerToken: "",
        registerTokenExpires: "",
      },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Employee.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }
    res
      .status(200)
      .json({ message: "User deleted successfully.", data: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role.", error });
  }
};
