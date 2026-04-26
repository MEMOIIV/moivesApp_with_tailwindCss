import Joi from "joi";
import React, { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "../../../utils/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [joiError, setJoiError] = useState([]);

  const [eyeIcon, setEyeIcon] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
    }
  }

  async function getUserData() {
    try {
      let res = await axios.get("http://localhost:3000/user");
      let allData = res.data;
      allData.map((data) => {
        if (data.email == user.email && data.password == user.password) {
          navigate("/home");
        } else {
          setErrorMessage("email or password not success");
        }
      });
    } catch (error) {
      console.log(error);
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

          <div className="mt-5 w-full text-end">
            <button className=" bg-bgTransparent px-12 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-300">
              login
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
