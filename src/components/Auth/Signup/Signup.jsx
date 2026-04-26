import Joi from "joi";
import React, {useState } from "react";
import { EyeIcon, EyeClosedIcon } from "../../../utils/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    age: 0,
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [joiError, setJoiError] = useState([]);

  const [eyeIcon, setEyeIcon] = useState(true);

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
      first_name: Joi.string().min(3).max(10).required(),
      last_name: Joi.string().min(3).max(10).required(),
      age: Joi.number().min(18).max(80).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org"] },
      }),
      password: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,8}$/)),
    });

    let joiResponse = schema.validate(user, { abortEarly: false });

    if (joiResponse.error == undefined) {
      // call API
      sendUserData();
    } else {
      setJoiError(joiResponse.error?.details);
    }
  }

  async function sendUserData() {
    try {
      let res = await axios.post("http://localhost:3000/user", user);
      console.log(res.data);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section className="w-[80%] md:w-[70%] lg:w-[55%] mx-auto mt-18.75 capitalize ">
        {/* container form */}
        <form
          className={`${joiError.length == 0 ? " space-y-2" : ""}`}
          onSubmit={submitUser}
        >
          <h2 className="text-2xl mb-1 lg:text-3xl">registration form</h2>

          {/* first_name */}
          <label htmlFor="first_name" className="cursor-pointer">
            first name :
          </label>
          <input
            type="text"
            id="first_name"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-2 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p
            className={`${joiError.length == 0 ? "text-green-500" : "text-red-700"} text-[16px]`}
          >
            {" "}
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "first_name")?.message}
          </p>

          {/* last_name */}
          <label htmlFor="last_name" className="cursor-pointer">
            last name :
          </label>
          <input
            type="text"
            id="last_name"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-2 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p
            className={`${joiError.length == 0 ? "text-green-500" : "text-red-700"} text-[16px]`}
          >
            {" "}
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "last_name")?.message}
          </p>

          {/* age */}
          <label htmlFor="age" className="cursor-pointer">
            age :
          </label>
          <input
            type="number"
            id="age"
            className="w-full bg-fontColor px-2 py-2 rounded-md mt-2 mb-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent text-black"
            onChange={getUser}
          />
          <p
            className={`${joiError.length == 0 ? "text-green-500" : "text-red-700"} text-[16px]`}
          >
            {" "}
            {joiError.length == 0
              ? ""
              : joiError.find((err) => err.path[0] === "age")?.message}
          </p>

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

          <div
            className={`${joiError.length == 0 ? "mt-5" : ""} w-full text-end`}
          >
            <button className=" bg-bgTransparent px-12 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-300">
              register
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Signup;
