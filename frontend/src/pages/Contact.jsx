import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
function Contact() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    const userMessage = {
      name: data.name,
      email: data.email,
      message: data.message,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}user/contact`,
        userMessage,
        {
          withCredentials: true,
        }
      );

      if (res.data && res.status === 200) {
        reset();
        toast.success(res?.data?.message || "Message sent successfully!");
      }
    } catch (error) {
      console.log("Contact Error", error);
      alert(error?.response?.data?.message || "Something Went Wrong!");
    }
  };
  return (
    <>
      <div className="row d-flex justify-content-center flex-column align-items-center py-5 px-2">
        <h1 className="brand-text mt-2 pt-5">Contact Us</h1>
        <div className="col-12 col-md-8 col-lg-6 loginForm  ">
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
            {/* input for message */}
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="form-control"
                {...register("message", {
                  required: "Message is required",
                  pattern: {
                    value: /^.{20,}$/,
                    message: "Message should be at least 20 characters",
                  },
                })}
              ></textarea>
              {errors.message && (
                <span className="text-danger">{errors.message.message}</span>
              )}
            </div>

            <button type="submit" className="btn-main">
              Send{" "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
