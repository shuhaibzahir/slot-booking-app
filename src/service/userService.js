import { browser } from "$app/environment"
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "changeme";
const userStorage = browser && localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

export const loginUser = ({ email, password }) => { 
  const user = userStorage.find((user) => user.email === email && user.password === password);
  if (user) {
    return user;
  }
  if(email === ADMIN_EMAIL && password ===ADMIN_PASSWORD) {
    return {
      email: ADMIN_EMAIL,
      name: "Admin",
      isAdmin: true,
    };
  }
  return false;
};

export const registerUser = ({ email, password, name }) => {
     return new Promise((resolve, reject) => {
      const user = userStorage.find((user) => user.email === email);
      if (user) {
        reject("Username already exists");
      } else {
        const newUser = {
          email,
          password,
          name,
        };
        userStorage.push(newUser);
        browser&& localStorage.setItem("users", JSON.stringify(userStorage));
        resolve(newUser);
      }
    });
    
  };