import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const connectGithub = async (req, res) => {
  console.log("request to connect");
  const { code, userEmail } = req.body;
  console.log("code", code);
  console.log("userEmail", userEmail);
  if (!code || !userEmail) {
    return res
      .status(400)
      .json({ message: "Missing GitHub code or user email" });
  }

  try {
    // Step 1: Exchange code for GitHub access token
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
      console.error("No access token received from GitHub");
      return res.status(400).json({ message: "Failed to get GitHub token" });
    }

    // Step 2: Fetch GitHub user data
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubData = userResponse.data;
    if (!githubData?.id) {
      return res.status(400).json({ message: "GitHub ID is missing!" });
    }

    let { id: githubId, name, email: githubEmail } = githubData;

    // Step 3: Fallback if GitHub email is not provided
    if (!githubEmail) {
      const emailResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const primaryEmail = emailResponse.data.find(
        (e) => e.primary && e.verified
      );
      githubEmail = primaryEmail
        ? primaryEmail.email
        : `github-user-${githubId}@example.com`;
    }

    // Step 4: Check if GitHub ID is already linked to someone
    const existingGithubUser = await User.findOne({ githubID: githubId });
    if (existingGithubUser) {
      console.log("user exists", existingGithubUser.email);
      return res.status(400).json({
        message: "This GitHub account is already linked with another user.",
      });
    }

    // Step 5: Get the currently logged-in user by their email
    const localUser = await User.findOne({ email: userEmail });
    if (!localUser) {
      return res
        .status(404)
        .json({ message: "User not found. Please login again." });
    }

    // Step 6: Link GitHub to the existing user
    localUser.githubID = githubId;
    localUser.gtihubToken = accessToken;
    localUser.isVarified = true;
    await localUser.save();

    // Step 7: (Optional) Generate a new token
    const token = jwt.sign({ userId: localUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "GitHub connected successfully" });
  } catch (error) {
    console.error(
      "GitHub Connect Error:",
      error?.response?.data || error.message
    );
    res.status(500).json({ message: "GitHub connection failed" });
  }
};
