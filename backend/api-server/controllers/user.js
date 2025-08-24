import User from "../models/user.js";
import Contact from "../models/contact.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/mailSender.js";
import jwt from "jsonwebtoken";
// signup
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const userExist = await User.findOne({ email });

    if (userExist)
      return res
        .status(400)
        .json({ message: "User Already Exist! Kindly Login" });

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validName = /^[A-Za-z ]{2,22}$/;
    const validPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!validEmail.test(email)) {
      return res.status(400).json({ message: "Please Enter a valid Email" });
    } else if (!validName.test(name)) {
      return res.status(400).json({
        message: "Name Should be of minimum two Characters and maximum 22.",
      });
    } else if (!validPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    const to = email;
    const subject = `Kindly Verify Your WebLift Account`;
    const body = `<h1>Hey ${name}!</h1> </br> <p> Kindly verify your <strong>Weblift</strong> account. </br> This Link is valid for 15 minutes. But you can always request a new link from your account.</br> Here is the verification Link: </p>`;
    await sendMail(to, subject, body);

    return res
      .status(200)
      .json({ message: "Signup Success Kindly Verify your email." });
  } catch (error) {
    console.error("Error Signup", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Email or password mismatch" });
    }
    const hashedPassword = userExist.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Email or password mismatch" });
    }
    const token = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    });
    return res.status(200).json({ message: "Login Success!" });
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
export const Logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    return res.status(200).json({ message: "Logout Success!" });
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// send User
export const sendUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({ message: "User not Found!" });
    }

    const userData = {
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      isVarified: userExist.isVarified,
      githubToken: userExist.gtihubToken,
    };

    return res
      .status(200)
      .json({ message: "User Data Recived.", user: userData });
  } catch (error) {
    console.error("error sending User", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

//login
export const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const userMessage = new Contact({
      name: name,
      email: email,
      message: message,
    });
    await userMessage.save();
    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact Error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, newEmail, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.email !== email) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    user.email = newEmail;
    await user.save();

    res.json({ message: "Email Changed", email: email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", Error: error.message });
  }
};
export const ChangePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", Error: error.message });
  }
};
