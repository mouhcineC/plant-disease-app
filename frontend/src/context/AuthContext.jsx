import { createContext, useContext, useMemo, useState } from "react";
import { authLogin, authRegister } from "../api/axios";

const AuthContext = createContext(null);

const readStorage = (key) => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(key) || "";
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStorage("auth_token"));
  const [userEmail, setUserEmail] = useState(readStorage("auth_email"));

  const persistAuth = (nextToken, email) => {
    if (typeof window === "undefined") {
      return;
    }
    if (nextToken) {
      window.localStorage.setItem("auth_token", nextToken);
    }
    if (email) {
      window.localStorage.setItem("auth_email", email);
    }
  };

  const clearAuth = () => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("auth_email");
  };

  const login = async (payload) => {
    const response = await authLogin(payload);
    const nextToken = response?.data?.auth_token || response?.data?.token || "";
    const email = payload?.email || "";
    setToken(nextToken);
    setUserEmail(email);
    persistAuth(nextToken, email);
    return response;
  };

  const register = async (payload) => {
    const response = await authRegister(payload);
    const nextToken = response?.data?.auth_token || response?.data?.token || "";
    const email = payload?.email || "";
    setToken(nextToken);
    setUserEmail(email);
    persistAuth(nextToken, email);
    return response;
  };

  const logout = () => {
    setToken("");
    setUserEmail("");
    clearAuth();
  };

  const value = useMemo(
    () => ({
      token,
      userEmail,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
