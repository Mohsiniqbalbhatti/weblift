import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const githubLogin = async (req, res) => {
  console.log("login request");
  const { code } = req.body;
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
    console.log("access token", accessToken);
    if (!accessToken) {
      return res.status(400).json({ message: "Failed to get GitHub token" });
    }

    // Step 2: Fetch user data from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubdata = userResponse.data;
    console.log("githubdata", githubdata);
    if (!githubdata.id) {
      return res.status(400).json({ message: "GitHub ID is missing!" });
    }

    let { id, name, email } = githubdata;

    // Step 3: Fetch email if missing
    if (!email) {
      console.log("trying to get email");
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
    const mailExist = await User.findOne({ email: email });

    // Scenario 1: If the email exists and the GitHub ID matches
    if (mailExist && mailExist.email === email) {
      console.log("mailExist && mailExist.email === email");

      // Update GitHub ID and token, mark account as verified
      mailExist.githubID = id;
      mailExist.gtihubToken = accessToken;
      mailExist.verified = true;

      await mailExist.save();
      // Step 5: Generate JWT token
      const token = jwt.sign(
        { userId: mailExist._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Step 6: Set/send HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // change to true in production
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour expiry
      });

      // Step 7: Send Response
      console.log("Login successful");
      return res.status(200).json({ message: "Login successful" });
    }

    // Scenario 2: If the user with this github id  doesn't exist in the database create new user
    else if (!user) {
      console.log("mailExist && !user && mailExist.email !== email");

      // Create a new user with the provided GitHub account
      user = new User({
        name: name || "GitHub User",
        email,
        githubID: id,
        gtihubToken: accessToken,
        isVarified: true, // GitHub users are assumed verified
      });
      console.log("user to be save", user);
      await user.save();
      // Step 5: Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Step 6: Set/send HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 3600000,
      });

      console.log("Login successful");

      // Step 7: Send Response
      return res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return res.status(500).json({ message: "GitHub login failed" });
  }
};
