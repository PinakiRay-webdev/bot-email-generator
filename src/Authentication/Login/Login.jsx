import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { IoEyeOff, IoEye } from "react-icons/io5";
import google from "../../assets/google.svg";

const Login = () => {
  const navigate = useNavigate();
  const [isvisible, setIsvisible] = useState(false);

  const TogglePasswordVisiblity = () => {
    setIsvisible(!isvisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  //google signin
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar.events");

  const googleSignIN = async () => {
    toast.loading("signin....", { theme: "dark" });
    try {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      }).then(() => {
        toast.dismiss();
        signInWithPopup(auth, provider)
          .then((result) => {
            toast.success('Signed in with google' , {theme: 'dark'})
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            localStorage.setItem('userCredentials' , JSON.stringify({
              userName : user.displayName,
              userEmail: user.email,
              calender_token: token
            }))
            setTimeout(() => {
              navigate('/');
            }, 1500);
          })
          .catch((error) => {
            toast.dismiss();
            toast.error(error.message, { theme: "dark" });
          });
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error.message, { theme: "dark" });
    }
  };

  // login with email
  const loginWithEmail = async (data) => {
    toast.loading("Please wait.....", { theme: "dark" });
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, [1000]);
    }).then(() => {
      toast.dismiss();
      signInWithEmailAndPassword(auth, data.userEmail, data.userPassword)
        .then((credentials) => {
          const user = credentials.user;
          localStorage.setItem(
            "userCredentials",
            JSON.stringify({
              userEmail: data.userEmail,
              userPassword: data.userPassword,
            })
          );
          toast.success("login successfully", { theme: "dark" });
          setTimeout(() => {
            navigate("/");
          }, 1500);
        })
        .catch((error) => {
          toast.error(`Error: ${error.code}. ${error.message}`, {
            theme: "dark",
          });
        });
    });
  };

  return (
    <div className="bg-[#212529] h-screen flex justify-center items-center ">
      <div className="border h-[70vh] w-[30vw] min-w-[300px] rounded-xl bg-[#131515]">
        <form onSubmit={handleSubmit(loginWithEmail)} className="p-5">
          <fieldset
            className={`border text-[#adb5bd] p-2 rounded ${
              errors.userEmail ? "border-red-500" : "border-[#595959]"
            }`}
          >
            <legend
              className={`font-semibold px-1 capitalize ${
                errors.userEmail && "text-red-500"
              } `}
            >
              {errors.userEmail ? errors.userEmail.message : "Email"}
            </legend>
            <input
              {...register("userEmail", {
                required: {
                  value: true,
                  message: "required",
                },
              })}
              autoComplete="true"
              className={`w-full outline-none`}
              type="email"
              placeholder="Abc@example.com"
            />
          </fieldset>
          <fieldset
            className={`border text-[#adb5bd] p-2 rounded mt-4 ${
              errors.userPassword ? "border-red-500" : "border-[#595959]"
            }`}
          >
            <legend
              className={`font-semibold px-1 capitalize ${
                errors.userPassword && "text-red-500"
              }`}
            >
              {errors.userPassword ? errors.userPassword.message : "Password"}
            </legend>
            <div className="flex items-center">
              <input
                {...register("userPassword", {
                  required: {
                    value: true,
                    message: "required",
                  },
                })}
                autoComplete="false"
                className={`w-full outline-none`}
                type={isvisible ? "text" : "password"}
                placeholder="*********"
              />
              <p
                onClick={TogglePasswordVisiblity}
                className="cursor-pointer text-xl"
              >
                {isvisible ? <IoEye /> : <IoEyeOff />}
              </p>
            </div>
          </fieldset>
          <button
            className={`py-2 text-white bg-[#595959] w-full rounded my-6 ${
              isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
            } disabled:${isSubmitting}`}
          >
            {isSubmitting ? "login you...." : "Log in"}
          </button>
          <p className="text-zinc-400 text-center text-sm">
            Didn't have an account ?{" "}
            <span
              className="font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </form>

        <div className="flex items-center gap-2 px-12 my-5">
          <div className="h-[1px] w-full bg-gray-500"></div>
          <p className="text-gray-500">or</p>
          <div className="h-[1px] w-full bg-gray-500"></div>
        </div>

        {/* google sign in  */}
        <div
          onClick={googleSignIN}
          className="w-[90%] mx-auto h-12 bg-zinc-800 rounded-md flex items-center justify-center gap-6 cursor-pointer"
        >
          <img className="w-8" src={google} alt="" />
          <p className="text-zinc-300 text-lg ">Continue using google</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
