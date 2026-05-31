import { createContext, useCallback, useContext, useMemo, useState } from "react";
import userService from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const saveUser = useCallback((nextUser) => {
    const { password, ...safeUser } = nextUser;
    setUser(safeUser);
    localStorage.setItem("currentUser", JSON.stringify(safeUser));
    return safeUser;
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const matchedUser = await userService.login({ username, password });

    if (!matchedUser) {
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
    }

    return saveUser(matchedUser);
  }, [saveUser]);

  const register = useCallback(async ({ fullname, username, password }) => {
    const nextUser = await userService.createUser({
      fullname,
      username,
      password,
      role: "user",
    });

    return saveUser(nextUser);
  }, [saveUser]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
