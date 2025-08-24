import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaEye, FaKey, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
import { useUser } from "../context/AuthUser";

function UserProfile() {
  const { user } = useUser();
  const [load, setLoad] = useState(false); // State to handle loading
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showCurrentPassword1, setShowCurrentPassword1] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: registerPasswordChange,
    handleSubmit: handlePasswordChange,
    formState: { errors: errorsPasswordChange },
    getValues,
    reset,
  } = useForm();

  const OnEmailChange = async (data) => {
    const EmailData = {
      email: user.email,
      newEmail: data.newEmail,
      password: data.password,
    };
    console.log(EmailData);
    setLoad(true);
    try {
      // Await the axios POST request to ensure it completes
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}user/updateEmail`,
        EmailData,
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoad(false);
    }
  };
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleCurrentPasswordVisibility1 = () => {
    setShowCurrentPassword1(!showCurrentPassword1);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const eyeplace = {
    position: "absolute",
    right: "30px",
    top: "67%", // Aligns to the center of the input field
    transform: "translateY(-50%)", // Centers vertically
    cursor: "pointer",
    zIndex: 2,
    color: "#000",
  };
  const invalidFeedback = {
    position: "absolute",
    bottom: "-20px",
    fontSize: "0.875em",
    color: "#dc3545",
    width: "100%",
    paddingLeft: "15px",
  };

  // change password
  const onSubmitPasswordChange = async (data) => {
    const passwordData = {
      userName: user.username,
      password: data.password,
      newPassword: data.newPassword,
    };
    setLoad(true);
    try {
      // Await the axios POST request to ensure it completes
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}user/updatePassword`,
        passwordData,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoad(false);
      reset();
    }
  };
  return (
    <>
      {load && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Loader />
          <p className="mt-3 text-center">Updating profile...</p>
        </div>
      )}
      <div className="row pt-5 px-2 px-lg-3 justify-content-center">
        <div className="col-12 col-md-8 col-lg-8 my-2  py-4 rounded card mt-5">
          <h4>
            {" "}
            <MdAlternateEmail className="me-1" />
            Change Your email address
          </h4>
          <form onSubmit={handleSubmit(OnEmailChange)}>
            <div className="mb-3">
              <label>Current Email</label>
              <input
                type="text"
                className="form-control p-2 "
                disabled
                placeholder={user?.email}
              />
            </div>
            <div className="mb-3">
              <label>New Email</label>
              <input
                type="text"
                className={`form-control p-2 ${
                  errors.newEmail ? "is-invalid" : ""
                }`} // Apply 'is-invalid' if there's an error
                id="new_email"
                placeholder="Enter New email"
                {...register("newEmail", { required: true })}
              />
              {errors.newEmail && (
                <div className="invalid-feedback">New Email is Required.</div>
              )}
            </div>
            <div className="mb-3 position-relative">
              <label>Current Password</label>
              <input
                type={!showCurrentPassword ? "password" : "text"}
                className={`form-control p-2 ${
                  errors.password ? "is-invalid" : ""
                }`} // Apply 'is-invalid' if there's an error
                id="current_password"
                placeholder="Enter Current Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <div className="invalid-feedback">Password is Required.</div>
              )}
              <span style={eyeplace} onClick={toggleCurrentPasswordVisibility}>
                {!showCurrentPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="btn btn-main py-2">
              Change Email
            </button>
          </form>
        </div>
        <div className="col-12 col-md-8 col-lg-8 my-2  py-4 rounded card">
          <h4>
            {" "}
            <FaKey className="me-1" />
            Change Your Password
          </h4>
          <form onSubmit={handlePasswordChange(onSubmitPasswordChange)}>
            <div className="mb-3 position-relative">
              <label>Current Password</label>
              <input
                type={!showCurrentPassword1 ? "password" : "text"}
                className={`form-control p-2 ${
                  errorsPasswordChange.password ? "is-invalid" : ""
                }`}
                placeholder="Enter Current Password"
                {...registerPasswordChange("password", {
                  required: "Current Password is required",
                })}
              />
              {errorsPasswordChange.password && (
                <div className="invalid-feedback" style={invalidFeedback}>
                  {errorsPasswordChange.password.message}
                </div>
              )}
              <span style={eyeplace} onClick={toggleCurrentPasswordVisibility1}>
                {!showCurrentPassword1 ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="mb-3 position-relative">
              <label>New Password</label>
              <input
                type={!showNewPassword ? "password" : "text"}
                className={`form-control p-2 ${
                  errorsPasswordChange.newPassword ? "is-invalid" : ""
                }`}
                placeholder="Enter New Password"
                {...registerPasswordChange("newPassword", {
                  required: "New Password is required",
                })}
              />
              {errorsPasswordChange.newPassword && (
                <div className="invalid-feedback" style={invalidFeedback}>
                  {errorsPasswordChange.newPassword.message}
                </div>
              )}
              <span style={eyeplace} onClick={toggleNewPasswordVisibility}>
                {!showNewPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="mb-3 position-relative">
              <label>Confirm New Password</label>
              <input
                type={!showConfirmPassword ? "password" : "text"}
                className={`form-control p-2 ${
                  errorsPasswordChange.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Confirm New Password"
                {...registerPasswordChange("confirmPassword", {
                  required: "Confirmation is required",
                  validate: (value) => {
                    const { newPassword } = getValues();
                    return (
                      value === newPassword || "New Passwords do not match"
                    );
                  },
                })}
              />
              {errorsPasswordChange.confirmPassword && (
                <div className="invalid-feedback" style={invalidFeedback}>
                  {errorsPasswordChange.confirmPassword.message}
                </div>
              )}
              <span style={eyeplace} onClick={toggleConfirmPasswordVisibility}>
                {!showConfirmPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="btn btn-warning py-2">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
