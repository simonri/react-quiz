import { useCookies } from "react-cookie";

const useAuth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["authtoken"]);

  const loggedIn = () => !!(cookies.authtoken || null);

  const logout = () => removeCookie("authtoken");

  const getToken = () => ({
    headers: {
      Authorization: `Bearer ${cookies.authtoken}`,
    },
  });

  const login = async (email, password, remember) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status !== 200) {
        return false;
      }

      const responseValue = await response.json();
      setCookie("authtoken", responseValue.token, {
        path: "/",
        expires: remember
          ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
        domain:
          process.env.NODE_ENV !== "production"
            ? "localhost"
            : process.env.REACT_APP_PUBLIC_URL,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status !== 201) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  return {
    login,
    register,
    logout,
    getToken,
    get loggedIn() {
      return loggedIn();
    },
  };
};

export default useAuth;
