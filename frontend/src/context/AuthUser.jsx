import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    // Only fetch user if we don't have one and we're not already loading
    if (!user && load) {
      const fetchUser = async () => {
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
  }, [load]); // Remove user from dependencies to prevent infinite loop

  return (
    <>
      <UserContext.Provider value={{ user, setUser, load, setLoad }}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export const useUser = () => useContext(UserContext);
