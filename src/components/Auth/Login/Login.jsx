import Joi from "joi";
import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "../../../utils/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { ApiContext } from "../../../context/context";
function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [joiError, setJoiError] = useState([]);
  const [clickButton, setClickButton] = useState(false);

  const [eyeIcon, setEyeIcon] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // context from ApiContext \\
  const { logVerification } = useContext(ApiContext);

  function getUser(e) {
    // // deep copy
    let newUser = { ...user };

    let propertyName = e.target.id;
    // propertyName ==> have value string
    newUser[propertyName] = e.target.value;
    // console.log(newUser);
    setUser(newUser);
    setJoiError([]);
  }

  function submitUser(e) {
    // change value clickButton to disable button
    setClickButton(true);
    e.preventDefault();
    const schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org"] },
      }),
      password: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,8}$/)),
    });

    let joiResponse = schema.validate(user, { abortEarly: false });

    if (joiResponse.error == undefined) {
      // call API
      getUserData();
    } else {
      setJoiError(joiResponse.error?.details);
      // change value clickButton to enable button
      setClickButton(false);
    }
  }

  // System Login
  async function getUserData() {
    try {
      let { data } = await axios.post("http://localhost:3000/auth/login", user);
      if (data.message == "success") {
        // i need user data from token
        localStorage.setItem("token", data.data.credentials.access_token);
        logVerification();
        navigate("/home");
        // change value clickButton to enable button
        setClickButton(false);
      }
    } catch (error) {
      console.log(error.code);
      // change value clickButton to enable button
      setClickButton(false);

      if (error.code == "ERR_BAD_REQUEST") {
        setErrorMessage("Invalid Email or Password");
      }
    }
  }

  // Login by gmail
  async function handleSuccess(credentialResponse) {
    // 1 : google send Encoded token called credential
    const googleToken = credentialResponse.credential;
    try {
      // 2 : send the token you get from google to backend API
      const { data } = await axios.post(
        "http://localhost:3000/auth/login/gmail",
        { idToken: googleToken },
      );
      // 3 : check data success and save the token in the localStorage
      if (data.message == "success") {
        localStorage.setItem("token", data.data.access_token);
        logVerification();
        navigate("/home");
      }
    } catch (error) {
      console.log("Login Failed", error);
    }
  }

  return (
    <>
      <section className=" flex items-center justify-center h-screen capitalize">
        {/* container form */}
        <form className="space-y-5 w-[40%]" onSubmit={submitUser}>
          <h2 className="text-2xl mb-4 lg:text-3xl">Login form</h2>

          {/* email */}
          <label htmlFor="email" className="cursor-pointer">
            email :
          </label>
          <input
            type="email"
            id="email"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-2 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p
            className={`${joiError.length == 0 ? "text-green-500" : "text-red-700"} text-[16px]`}
          >
            {" "}
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "email")?.message}
          </p>

          {/* password */}
          <label htmlFor="password" className="cursor-pointer">
            password :
          </label>
          <div className="relative flex items-center">
            <input
              type={eyeIcon ? "password" : "text"}
              id="password"
              className="w-full bg-fontColor px-2 py-2 rounded-md mt-2 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black pr-10"
              onChange={getUser}
            />

            {eyeIcon ? (
              <EyeClosedIcon
                className="absolute right-2 cursor-pointer text-black mt-0.5"
                size={24}
                onClick={() => setEyeIcon(!eyeIcon)}
              />
            ) : (
              <EyeIcon
                className="absolute right-2 cursor-pointer text-black mt-0.5"
                size={24}
                onClick={() => setEyeIcon(!eyeIcon)}
              />
            )}
          </div>
          <p
            className={`${joiError.length == 0 ? "text-green-500" : "text-red-700"} text-[16px]`}
          >
            {" "}
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "password")?.message}
          </p>

          <p className="text-red-700 text-[18px] text-center">{errorMessage}</p>

          <div className="mt-5 w-full text-end flex flex-col items-center gap-4 lg:flex-row lg:justify-center ">
            <button
              disabled={clickButton ? true : false}
              className={`order-0 lg:order-1 bg-bgTransparent px-12 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-300 tracking-wider 
                ${clickButton ? "cursor-not-allowed bg-gray-700 hover:opacity-100" : "cursor-pointer"}`}
            >
              login
            </button>

            <GoogleLogin
              disabled={clickButton ? true : false}
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
