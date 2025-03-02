import axios from "axios";
import toast from "react-hot-toast";

const sendRequest = async (requestType, endPoint, data, requestFor) => {
  try {
    const res = await axios.requestType(
      `${import.meta.env.VITE_BACKEND_URL}${endPoint}`,
      data,
      {
        withCredentials: true,
      }
    );
    if (res.data.message) {
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log(`${requestFor} Error`, error);
    toast.error(error.response.data.message);
  }
};
