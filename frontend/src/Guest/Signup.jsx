import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { FaEye, FaRegEyeSlash } from "react-icons/fa6";

function Signup() {
  const [load, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  const onSubmit = async (data) => {
    setLoad(true);
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}user/signup`,
        userData,
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        console.log(res?.data);
        toast.success(res?.data?.message);
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("signup Error", error);
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
    top: "69.9%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "black",
  };
  return (
    <>
      <div className="row justify-content-center flex-column align-items-center  pt-5 ">
        {load && <Loader />}
        <div className="col-6 loginForm my-5 py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* input for name */}
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z ]{2,22}$/,
                    message:
                      "Name Should be of minimum 3 Characters and maximum 22.",
                  },
                })}
              />
              {errors.name && (
                <span className="text-danger">{errors.name?.message}</span>
              )}
            </div>
            {/* input for email */}
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
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
              <div id="emailHelp" className="form-text text-light">
                We'll never share your email with anyone else.
              </div>
            </div>
            {/* input for password */}
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
                <span className="text-danger">{errors.password?.message}</span>
              )}
            </div>
            <button type="submit" className="btn-main">
              Signup{" "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default Signup;
