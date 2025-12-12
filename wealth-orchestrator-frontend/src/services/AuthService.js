import api from "./api";

export const login = async (identifier, password) => {
  const res = await api.post("/auth/login", {
    identifier,
    password,
  });

  const { token, username } = res.data;

  if (token) {
 
    const pureToken = token.replace("Bearer ", "").trim();

    localStorage.setItem("token", pureToken);
    localStorage.setItem("username", username);
  }

  return res.data;
};


export const register = async (username, email, password) => {
  const res = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return res.data;
};


export function getLoggedInUsername() {
  return localStorage.getItem("username");
}


export function isLoggedIn() {
  return !!localStorage.getItem("token");
}


export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}
