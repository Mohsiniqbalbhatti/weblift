import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function Signup() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    console.log("Data", data);
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post(
        `http://localhost:9000/user/signup`,
        userData,
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        console.log(res?.data);
        alert("suc", res?.data?.message);
      }
    } catch (error) {
      console.log("signup Error", error);
      alert(error?.response?.data?.message || "Something Went Wrong!");
    }
  };
  return (
    <>
      <div className="row ">
        <div className="col-6">
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
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            {/* input for password */}
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                id="password"
                {...register("password", {
                  required: "password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                    message:
                      "Password: 8-20 chars, 1 upper, 1 lower, 1 number, 1 special (@$!%*?&).",
                  },
                })}
              />
              {errors.password && (
                <span className="text-danger">{errors.password?.message}</span>
              )}
            </div>
            <button type="submit">{"signup"}</button>
          </form>
        </div>
      </div>
    </>
  );
}
export default Signup;
