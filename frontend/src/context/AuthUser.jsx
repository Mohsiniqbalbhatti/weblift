import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (!user) {
      // ✅ Fetch only if user is null
      const fetchUser = async () => {
        setLoad(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}user`,
            { withCredentials: true }
          );
          if (response.data.user) {
            setUser(response?.data?.user);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        } finally {
          setLoad(false);
        }
      };

      fetchUser();
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser, load, setLoad }}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export const useUser = () => useContext(UserContext);
