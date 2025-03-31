import React , {useState} from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { IoEyeOff, IoEye } from "react-icons/io5";


import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {

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
      createUserWithEmailAndPassword(auth, data.userEmail, data.userPassword)
        .then((credentials) => {
          const user = credentials.user;
          localStorage.setItem('userCredentials' , JSON.stringify({
            userEmail: data.userEmail,
            userPassword: data.userPassword
          }))
          toast.success("login successfully", { theme: "dark" });
          setTimeout(() => {
            navigate('/')
          }, 1500);
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(`Error: ${error.code}, ${error.message}` , {theme : 'dark'});
        });
    });
  };

  return (
    <div className="bg-[#212529] h-screen flex justify-center items-center ">
      <div className="border h-[70vh] w-[30vw] min-w-[300px] rounded-xl bg-[#131515]">
        <form onSubmit={handleSubmit(loginWithEmail)} className="p-5">
          {/* first and last name  */}
          <section id="first_and_last_name" className="flex justify-between">
            <fieldset
              className={`border text-[#adb5bd] p-2 rounded ${
                errors.userFirstName ? "border-red-500" : "border-[#595959]"
              }`}
            >
              <legend
                className={`font-semibold px-1 capitalize ${
                  errors.userFirstName && "text-red-500"
                } `}
              >
                {errors.userFirstName
                  ? errors.userFirstName.message
                  : "First Name"}
              </legend>
              <input
                {...register("userFirstName", {
                  required: {
                    value: true,
                    message: "Required",
                  },
                })}
                autoComplete="true"
                className={`w-full outline-none`}
                type="text"
                placeholder="Abc"
              />
            </fieldset>

            <fieldset
              className={`border text-[#adb5bd] p-2 rounded ${
                errors.userLastName ? "border-red-500" : "border-[#595959]"
              }`}
            >
              <legend
                className={`font-semibold px-1 capitalize ${
                  errors.userLastName && "text-red-500"
                }`}
              >
                {errors.userLastName ? errors.userLastName.message : "Password"}
              </legend>
              <input
                {...register("userLastName", {
                  required: {
                    value: true,
                    message: "required",
                  },
                })}
                autoComplete="false"
                className={`w-full outline-none`}
                type="text"
                placeholder="xyz"
              />
            </fieldset>
          </section>

          {/* user email section  */}
          <fieldset
            className={`border text-[#adb5bd] p-2 rounded mt-4 ${
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
            <div className="flex justify-baseline items-center" >
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
            {isSubmitting ? "Signing you...." : "Sign up"}
          </button>
          <p className="text-zinc-400 text-center text-sm" >Already have an account ? <span className="font-semibold cursor-pointer" onClick={() => navigate('/login')} >Log in</span></p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
