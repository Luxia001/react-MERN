import { useCallback, useEffect, useState } from "react";

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpDate, setTokenExpDate] = useState();
  const [userId, setUserId] = useState();

  const login = useCallback((uid, token, expDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExp =
      expDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    setTokenExpDate(tokenExp);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        exp: tokenExp.toISOString(),
      })
    );
  });
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
    clearTimeout(logoutTimer);
  });

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  useEffect(() => {
    const stroedData = JSON.parse(localStorage.getItem("userData"));
    if (stroedData && new Date(stroedData.exp) > new Date()) {
      login(stroedData.uid, stroedData.token, new Date(stroedData.exp));
    }
  }, [login]);
  return { token, tokenExpDate, userId, login, logout };
};
