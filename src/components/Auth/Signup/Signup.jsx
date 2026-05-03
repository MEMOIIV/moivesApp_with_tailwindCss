import Joi from "joi";
import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "../../../utils/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [joiError, setJoiError] = useState([]);

  const [eyeIcon1, setEyeIcon1] = useState(true);
  const [eyeIcon2, setEyeIcon2] = useState(true);
  const [errorApi, setErrorApi] = useState("");
  const [clickedButton, setClickedButton] = useState(false);

  function getUser(e) {
    // // deep copy
    let newUser = { ...user };

    let propertyName = e.target.id;
    // propertyName ==> have value string
    newUser[propertyName] = e.target.value;
    // console.log(newUser);
    setUser(newUser);
    // make setJoiError Empty
    setJoiError([]);
  }

  function submitUser(e) {
    // change value clickButton to enable button
    setClickedButton(true);
    e.preventDefault();
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(10).required(),
      lastName: Joi.string().min(3).max(10).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org"] },
        })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        )
        .required(),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Passwords do not match",
        }),
    });

    let joiResponse = schema.validate(user, { abortEarly: false });

    // check Error empty or not
    if (joiResponse.error == undefined) {
      // call API
      sendUserData();
    } else {
      // save error in useState
      setJoiError(joiResponse.error?.details);
      // change value clickButton to enable button
      setClickedButton(false);
    }
  }

  // Api User
  async function sendUserData() {
    try {
      let { data } = await axios.post(`${API_URL}/auth/signup`, user);
      setClickedButton(false);
      if (data.message == "success") {
        navigate("/home");
      }
    } catch (error) {
      setErrorApi(error.response.data.error_message);
      setClickedButton(false);
    }
  }

  return (
    <>
      <section className="w-[80%] md:w-[70%] lg:w-[55%] mx-auto mt-15.75 capitalize ">
        {/* container form */}
        <form
          className={`${joiError.length == 0 ? " space-y-2" : ""}`}
          onSubmit={submitUser}
        >
          <h2 className="text-2xl mb-1 lg:text-3xl">registration form</h2>

          {/* first_name */}
          <label htmlFor="firstName" className="cursor-pointer">
            first name :
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p className="text-red-700 text-[14px]">
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "firstName")?.message}
          </p>

          {/* last_name */}
          <label htmlFor="lastName" className="cursor-pointer">
            last name :
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p className="text-red-700 text-[14px]">
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "lastName")?.message}
          </p>

          {/* email */}
          <label htmlFor="email" className="cursor-pointer">
            email :
          </label>
          <input
            type="email"
            id="email"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p className="text-red-700 text-[14px]">
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
              type={eyeIcon1 ? "password" : "text"}
              id="password"
              className="w-full bg-fontColor px-2 py-2 rounded-md mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black pr-10"
              onChange={getUser}
            />

            {eyeIcon1 ? (
              <EyeClosedIcon
                className="absolute right-2 cursor-pointer text-black mt-0.5"
                size={24}
                onClick={() => setEyeIcon1(!eyeIcon1)}
              />
            ) : (
              <EyeIcon
                className="absolute right-2 cursor-pointer text-black mt-0.5"
                size={24}
                onClick={() => setEyeIcon1(!eyeIcon1)}
              />
            )}
          </div>
          <p className="text-red-700 text-[14px]">
            {joiError.length == 0
              ? ""
              : '"Password" must be at least 8 characters long and include uppercase, lowercase letters, and numbers'}
          </p>

          {/* Confirm password */}
          <label htmlFor="confirmPassword" className="cursor-pointer">
            confirm password :
          </label>
          <div className="relative flex items-center">
            <input
              type={eyeIcon2 ? "password" : "text"}
              id="confirmPassword"
              className="w-full bg-fontColor px-2 py-2 rounded-md mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black pr-10"
              onChange={getUser}
            />

            {eyeIcon2 ? (
              <EyeClosedIcon
                className="absolute right-2 cursor-pointer text-black mt-0.5"
                size={24}
                onClick={() => setEyeIcon2(!eyeIcon2)}
              />
            ) : (
              <EyeIcon
                className="absolute right-2 cursor-pointer text-black mt-0.5"
                size={24}
                onClick={() => setEyeIcon2(!eyeIcon2)}
              />
            )}
          </div>
          <p className="text-red-700 text-[14px]">
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "confirmPassword")
                  ?.message}
          </p>

          <p className="text-red-700 text-[16px] text-center">{errorApi}</p>

          <div
            className={`${joiError.length == 0 ? "mt-5" : ""} w-full text-end`}
          >
            <button
              disabled={clickedButton ? true : false}
              className={`bg-bgTransparent px-12 py-2 rounded-md hover:opacity-85 transition-all duration-300 
                ${clickedButton ? "cursor-not-allowed bg-gray-700 hover:opacity-100" : "cursor-pointer"}
                `}
            >
              register
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Signup;
