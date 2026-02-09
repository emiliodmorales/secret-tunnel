import { createContext, useContext, useEffect, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  const storage = window.sessionStorage;
  useEffect(() => {
    const data = storage.getItem("token");
    if (data) {
      setToken(data);
      setLocation("TABLET");
    }
  }, []);

  // TODO: signup
  function signup(username) {
    fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((result) => {
        try {
          console.log(result.message);
          if (result.success) {
            storage.setItem("token", result.token);
            setToken(result.token);
            setLocation("TABLET");
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  // TODO: authenticate
  function authenticate() {
    fetch(API + "/authenticate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        try {
          console.log(result.message);
          if (result.success) {
            setLocation("TUNNEL");
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
