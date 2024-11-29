import React, { useEffect, useState } from "react";
import { UserList } from "../components/UserList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

export const Users = () => {
  const { loading, err, sendReq, clearErr } = useHttpClient();

  const [loadUsers, setLoadUsers] = useState();
  useEffect(() => {
    document.title = "user";
    const fetchUser = async () => {
      try {
        const res = await sendReq("http://localhost:5000/api/users");

        setLoadUsers(res.users);
      } catch (error) {}
    };
    fetchUser();
  }, [sendReq]);

  return (
    <React.Fragment>
      <ErrorModal
        error={err}
        onClear={clearErr}
      ></ErrorModal>
      {loading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!loading && loadUsers && <UserList items={loadUsers} />}
    </React.Fragment>
  );
};
