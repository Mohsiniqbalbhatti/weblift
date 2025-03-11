import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthUser";
function Login() {
  const [load, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  const onSubmit = async (data) => {
    setLoad(true);
    const userData = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}user/login`,
        userData,
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        console.log(res?.data);
        toast.success(res?.data?.message);

        const getuser = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}user`,
          { withCredentials: true }
        );
        if (getuser.data.user) {
          setUser(getuser?.data?.user);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log("Login Error", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong!");
    } finally {
      setLoad(false);
    }
  };
  // password toggle code
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const password = watch("password");
  useEffect(() => {
    if (password && password.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [password]);
  const eyeplace = {
    position: "absolute",
    right: "33px",
    top: "39.9%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "black",
  };

  //github login
  // 🔹 User clicks "Login with GitHub" (calls backend)
  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID
      }&scope=repo,user,email`
    );
  };
  useEffect(() => {
    const fetchGitHubToken = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const githubCodeParam = urlParams.get("code");

      if (!githubCodeParam) return; // ✅ Exit if no GitHub code is found
      if (githubCodeParam) {
        setLoad(true);
      }
      if (sessionStorage.getItem("github-login")) return; // ✅ Prevent duplicate requests
      sessionStorage.setItem("github-login", "true"); // ✅ Set flag to prevent re-execution
      setLoad(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}user/github-login`,
          { code: githubCodeParam },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("GitHub Login Successful");
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("GitHub Login Error:", error);
        toast.error("GitHub Login Failed");
      } finally {
        sessionStorage.removeItem("github-login"); // ✅ Allow retry with a new code
        setLoad(false); // End loading state
      }
    };

    fetchGitHubToken(); // ✅ Call the function inside `useEffect`
  }, []);
  return (
    <>
      <div className="row justify-content-center flex-column align-items-center pt-5">
        <div className="col-6 my-5 py-5">
          {load && <Loader />}
          <div className="loginForm">
            <h3 className="text-center">Login to Weblift</h3>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please Enter a valid Email",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>
              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type={!showPassword ? "password" : "text"}
                  className="form-control"
                  id="password"
                  {...register("password", {
                    required: "password is required",
                  })}
                />
                {isTyping && (
                  <span style={eyeplace} onClick={togglePasswordVisibility}>
                    {!showPassword ? <FaRegEyeSlash /> : <FaEye />}
                  </span>
                )}
                {errors.password && (
                  <span className="text-danger">
                    {errors.password?.message}
                  </span>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn-main">
                  Login
                </button>
                <p className="ms-2 my-2">Forgot Password?</p>
              </div>
              <p className="ms-2 my-2">New to Weblift? Signup now.</p>
            </form>
            <hr />
            <h5 className="text-center">Or</h5>
            <div className="d-flex justify-content-center flex-column align-items-center">
              <button className="w-75 rounded-pill my-2">
                Login with Google <FcGoogle className="fs-4" />
              </button>
              <button
                className="w-75 rounded-pill my-2"
                onClick={loginWithGithub}
              >
                Login with Github <FaGithub className="fs-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
