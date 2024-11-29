import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  // const activeHttpReq = useRef([]);

  const sendReq = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      //   const httpAbordCtrl = new AbortController();
      //   activeHttpReq.push(httpAbordCtrl);

      try {
        const res = await fetch(url, {
          method,
          body,
          headers,
          //   signal: httpAbordCtrl.signal,
        });

        const resData = await res.json();

        // activeHttpReq.current = activeHttpReq.current.filter(
        //   (reqCtrl) => reqCtrl !== httpAbordCtrl
        // );

        if (!res.ok) {
          setErr(resData.message);
          throw new Error(resData.message);
        }

        setLoading(false);
        return resData;
      } catch (error) {
        setLoading(false);
        setErr(err.message);
        throw err;
      }
    },
    []
  );

  const clearErr = () => {
    setErr(null);
  };

  useEffect(() => {
    return () => {
      // activeHttpReq.current.forEach((aborCtrl) => aborCtrl.abort());
    };
  }, []);

  return { loading, err, sendReq, clearErr };
};
