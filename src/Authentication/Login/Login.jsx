import React , {useState} from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { IoEyeOff, IoEye } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const [isvisible, setIsvisible] = useState(false)

  const TogglePasswordVisiblity = () =>{
        setIsvisible(!isvisible)
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

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
              <p onClick={TogglePasswordVisiblity} className="cursor-pointer text-xl">
                {
                    isvisible ? <IoEye /> : <IoEyeOff /> 
                }
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
