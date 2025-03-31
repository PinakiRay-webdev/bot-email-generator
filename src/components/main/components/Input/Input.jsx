import React, { useEffect , useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { generateFORM } from "../../../../../functions/geminiAI";
import { generateMail } from "../../../../../functions/generateMail";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


let dynamicInputArray;

const Input = () => {

  const userData = JSON.parse(localStorage.getItem('userCredentials'))
  const navigate = useNavigate();

  const [buttonText, setButtonText] = useState("Submit")
  const [buttonBgColor, setButtonBgColor] = useState("bg-green-500")
  const [mail, setMail] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const api_key = import.meta.env.VITE_API_KEY;

  const handleFormData = async (data) => {
    if(!userData){
      toast.warning(`Create an account first` , {theme : 'dark'})
      setTimeout(() => {
        navigate('/signup')
      }, 1200);
      return;
    }
    toast.loading("submitting...", { theme: "dark" });
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
    try {
      toast.dismiss();
      dynamicInputArray = await generateFORM(api_key, data.subject);
  
      const dynamicData = {};
      dynamicInputArray.forEach((key) => {
        dynamicData[key] = data[key]?.trim() || `Default value for ${key}`;
      });
      toast.success("Submitted!!", { theme: "dark" });
      setButtonText("Generate");
      setButtonBgColor("bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500");
  
      if (buttonText === "Generate") {
        setMail(await generateMail(api_key, data.subject, dynamicData));
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Submission failed!", { theme: "dark" });
      console.error(error);
    }
  };

  const sendMail = () =>{
    
  }

  useEffect(() => {
    
  }, [dynamicInputArray]);

  return (
    <div className="text-slate-400 mt-28">
      <form
        onSubmit={handleSubmit(handleFormData)}
        className="grid grid-cols-3 gap-6 w-[80%] mx-auto"
      >
        <fieldset
          className={`border px-2 py-1 rounded-md ${
            errors.subject ? "border-red-500" : "border-zinc-600"
          }`}
        >
          <legend className={`px-1 ${errors.subject && "text-red-500"} `}>
            {errors.subject ? errors.subject.message : "Subject"}
          </legend>
          <input
            {...register("subject", {
              required: {
                value: true,
                message: "Subject is required",
              },
            })}
            className="w-full outline-none"
            type="text"
            placeholder="E.g leave application to hr"
          />
        </fieldset>

        <fieldset className="border border-zinc-600 px-2 py-1 rounded-md">
          <legend className="px-1">Select Tone</legend>
          <select {...register("tone")} className="w-full">
            <option className="text-black" value="Formal">
              Formal
            </option>
            <option className="text-black" value="Informal">
              Informal
            </option>
          </select>
        </fieldset>

        {dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[0]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[0]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[0]]
                ? errors[dynamicInputArray[0]].message
                : dynamicInputArray[0]}
            </legend>
            <input
              {...register(dynamicInputArray[0], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Mention the recipient`}
            />
          </fieldset>
        )}

        {dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[1]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[1]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[1]]
                ? errors[dynamicInputArray[1]].message
                : dynamicInputArray[1]}
            </legend>
            <input
              {...register(dynamicInputArray[1], {
                required: {
                  value: true,
                  message: "This required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Mention the sender`}
            />
          </fieldset>
        )}

        {dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[2]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[2]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[2]]
                ? errors[dynamicInputArray[2]].message
                : dynamicInputArray[2]}
            </legend>
            <input
              {...register(dynamicInputArray[2], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Let us know your ${[dynamicInputArray[2]]}`}
            />
          </fieldset>
        )}


        {dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[3]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[3]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[3]]
                ? errors[dynamicInputArray[3]].message
                : dynamicInputArray[3]}
            </legend>
            <input
              {...register(dynamicInputArray[3], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Let us know your ${[dynamicInputArray[3]]}`}
            />
          </fieldset>
        )}

{dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[4]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[4]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[4]]
                ? errors[dynamicInputArray[4]].message
                : dynamicInputArray[4]}
            </legend>
            <input
              {...register(dynamicInputArray[4], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Let us know your ${[dynamicInputArray[4]]}`}
            />
          </fieldset>
        )}

{dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[5]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[5]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[5]]
                ? errors[dynamicInputArray[5]].message
                : dynamicInputArray[5]}
            </legend>
            <input
              {...register(dynamicInputArray[5], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Let us know your ${[dynamicInputArray[5]]}`}
            />
          </fieldset>
        )}

{dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[6]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[6]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[6]]
                ? errors[dynamicInputArray[6]].message
                : dynamicInputArray[6]}
            </legend>
            <input
              {...register(dynamicInputArray[6], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Let us know your ${[dynamicInputArray[6]]}`}
            />
          </fieldset>
        )}

{dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md ${
              errors[dynamicInputArray[7]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[7]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[7]]
                ? errors[dynamicInputArray[7]].message
                : dynamicInputArray[7]}
            </legend>
            <input
              {...register(dynamicInputArray[7], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Let us know your ${[dynamicInputArray[7]]}`}
            />
          </fieldset>
        )}

{dynamicInputArray !== undefined && (
          <fieldset
            className={`border px-2 py-1 rounded-md col-span-2 ${
              errors[dynamicInputArray[8]]
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            <legend
              className={`px-1 ${
                errors[dynamicInputArray[8]] && "text-red-500"
              } `}
            >
              {errors[dynamicInputArray[8]]
                ? errors[dynamicInputArray[8]].message
                : dynamicInputArray[8]}
            </legend>
            <input
              {...register(dynamicInputArray[8], {
                required: {
                  value: true,
                  message: "This is required",
                },
              })}
              className="w-full outline-none"
              type="text"
              placeholder={`Provide the reason behind this mail`}
            />
          </fieldset>
        )}

        <div className="flex justify-center items-center col-span-3">
          <button className={`${buttonBgColor} text-black py-2 w-[20%] rounded-md cursor-pointer`}>
            {buttonText}
          </button>
        </div>
      </form>
      
      {mail !== "" && (
        <div className="bg-zinc-800 px-4 py-6 mt-5 rounded-xl text-white w-[80%] mx-auto" >
          <button onClick={sendMail} >Send email</button>
          <p className="whitespace-pre-line" >{mail}</p>
        </div>
      )}
        <ToastContainer/>
    </div>
  );
};

export default Input;
