import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const githubLogin = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  if (!code) return res.status(400).json({ message: "GitHub code missing" });

  try {
    // Step 1: Exchange code for an access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log(tokenResponse.data);
    console.log("GitHub Access Token:", accessToken);

    if (!accessToken) {
      return res.status(400).json({ message: "Failed to get GitHub token" });
    }

    // Step 2: Fetch user data from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubdata = userResponse.data;
    if (!githubdata.id) {
      return res.status(400).json({ message: "GitHub ID is missing!" });
    }

    let { id, name, email } = githubdata;

    // Step 3: Fetch email if missing
    if (!email) {
      const emailResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const primaryEmail = emailResponse.data.find(
        (e) => e.primary && e.verified
      );
      email = primaryEmail
        ? primaryEmail.email
        : `github-user-${id}@example.com`; // Fallback email
    }

    // Step 4: Find or Create User in DB
    let user = await User.findOne({ githubId: id });

    // find email in db
    const mailExist = await User.findOne({ email: email });

    //if user email already exist
    if (mailExist.email === email) {
      mailExist.githubID = id;
      mailExist.gtihubToken = accessToken;
      mailExist.verified = true;

      await mailExist.save();
      // Step 5: Generate JWT token
      const token = jwt.sign(
        { userId: mailExist._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      //step 6: Set/send HTTP-only cookie

      res.cookie("token", token, {
        httpOnly: true, // Prevent access from JavaScript
        secure: false, // change it to true in production
        sameSite: "Strict", // Prevent CSRF
        maxAge: 3600000, // 1 hour expiry
      });
      // Step 7: Send Response
      return res.status(200).json({ message: "Login successful" });
    } else if (!user && mailExist.email !== email) {
      user = new User({
        name: name || "GitHub User",
        email,
        githubId: id,
        githubToken: accessToken,
        isVerified: true, // GitHub users are assumed verified
      });
      await user.save();
      // Step 5: Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      //step 6: Set/send HTTP-only cookie

      res.cookie("token", token, {
        httpOnly: true, // Prevent access from JavaScript
        secure: false, // change it to true in production
        sameSite: "Strict", // Prevent CSRF
        maxAge: 3600000, // 1 hour expiry
      });
      // Step 7: Send Response
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    res.status(500).json({ message: "GitHub login failed" });
  }
};
