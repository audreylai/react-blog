import React, { useState, useEffect } from "react";
import getUser from "../services/getUser";
import userLogin from "../services/userLogin";
import { Redirect } from "react-router-dom";
import userLogout from "../services/userLogout";

export default function Login() {
  const [uid, setUid] = useState("");
  const [pass, setPass] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    getUser().then((response) => response.data.userid && setLoginStatus(true));
  }, []);

  function handleSubmit(e) {
    console.log(uid, pass);
    userLogin(uid, pass).then(res=>{
      console.log(res);
      if (res.data.userid) {
        setLoginStatus(true);
      }
    });
  }

  return (
    <div>
      {loginStatus && <Redirect to="/" />}
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUid(e.target.value)}
        name="userid"
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPass(e.target.value)}
        name="passwd"
      />
      <button onClick={handleSubmit} name="submit" value="Login">
        submit
      </button>
      <button onClick={userLogout} name="submit" value="Login">
        logout
      </button>
    </div>
  );
}
