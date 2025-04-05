import React, { useState } from "react";
import { useForm } from "react-hook-form";
import translate from "google-translate-api-x";
import { toast, ToastContainer } from "react-toastify";
import { generateFORM } from "../../../../../functions/geminiAI";
import { generateMail } from "../../../../../functions/generateMail";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { IoCopy } from "react-icons/io5";
import { MdGTranslate , MdKeyboardVoice } from "react-icons/md";

let dynamicInputArray = [];

const Input = () => {
  const userData = JSON.parse(localStorage.getItem("userCredentials"));
  const navigate = useNavigate();

  const [isSubmitVisible, setIsSubmitVisible] = useState("block");
  const [isGenerateVisible, setIsGenerateVisible] = useState("hidden");
  const [mail, setMail] = useState("");
  const [isDynamicFormVisible, setIsDynamicFormVisible] = useState("block");
  const [sub, setSub] = useState("");
  const [dynamicData, setDynamicData] = useState({});
  const [isListening, setIsListening] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const api_key = import.meta.env.VITE_API_KEY;

  const resetForm = () => {
    reset({ subject: ""});
    setIsSubmitVisible("block");
    setIsGenerateVisible("hidden");
    setIsDynamicFormVisible("hidden");

    dynamicInputArray = [];
    setDynamicData({});
  };

  const handleFormData = async (data) => {
    if (!userData) {
      toast.warning("Create an account first", { theme: "dark" });
      setTimeout(() => navigate("/signup"), 1200);
      return;
    }

    toast.loading("Submitting...", { theme: "dark" });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      toast.dismiss();
      setIsSubmitVisible("hidden");
      setIsGenerateVisible("block");
      setIsDynamicFormVisible("block")

      // Generate dynamic input fields
      dynamicInputArray = await generateFORM(api_key, data.subject);
      setSub(data.subject);

      // Prepare dynamic data
      const tempDynamicData = {};
      dynamicInputArray.forEach((key) => {
        tempDynamicData[key] = data[key]?.trim() || `Default value for ${key}`;
      });

      setDynamicData(tempDynamicData);
      toast.success("Submitted!", { theme: "dark" });
    } catch (error) {
      toast.dismiss();
      toast.error("Submission failed!", { theme: "dark" });
      console.error(error);
    }
  };

  const genMail = async () => {
    setMail(await generateMail(api_key, sub, dynamicData));
  };

  const copyToClipboard = () => {
    if (mail) {
      navigator.clipboard.writeText(mail).then(() => {
        toast.success("Copied to clipboard", {
          theme: "dark",
          position: "top-center",
          autoClose: 1200,
        });
      });
    }
  };

  const translateMail = async () => {
    const response = await translate(mail, { to: "hi" });
    setMail(response.text);
  };

  // Voice typing function
  const startVoiceTyping = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition is not supported in this browser.", { theme: "dark" });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...", { theme: "dark" });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue("subject", transcript); 
      toast.success("Voice input captured!", { theme: "dark" });
    };

    recognition.onerror = (event) => {
      toast.error(`Error: ${event.error}`, { theme: "dark" });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="text-slate-400 mt-28">
      <form
        onSubmit={handleSubmit(handleFormData)}
        className="grid grid-cols-3 gap-6 w-[80%] mx-auto"
      >
        <fieldset className={`border px-2 py-1 col-span-2 rounded-md ${errors.subject ? "border-red-500" : "border-zinc-600"}`}>
          <legend className={`px-1 ${errors.subject && "text-red-500"}`}>
            {errors.subject ? errors.subject.message : "Subject"}
          </legend>
          <div className="flex items-center">
            <input
              {...register("subject", { required: "Subject is required" })}
              className="w-full outline-none"
              type="text"
              placeholder="E.g leave application to HR"
            />
            {isListening ? <p>Listening..</p> : <p onClick={startVoiceTyping} className="text-2xl cursor-pointer" ><MdKeyboardVoice /></p>}
          </div>
        </fieldset>

        <fieldset className="border border-zinc-600 px-2 py-1 rounded-md">
          <legend className="px-1">Select Tone</legend>
          <select {...register("tone")} className="w-full">
            <option className="text-black" value="Formal">Formal</option>
            <option className="text-black" value="Informal">Informal</option>
          </select>
        </fieldset>

        <div className="grid grid-cols-3 col-span-3 gap-6">
          {dynamicInputArray.length > 0 &&
            dynamicInputArray.map((key, index) => (
              <fieldset key={index} className={`border px-2 py-1 rounded-md ${isDynamicFormVisible} ${errors[key] ? "border-red-500" : "border-zinc-600"}`}>
                <legend className={`px-1 ${errors[key] && "text-red-500"}`}>
                  {errors[key] ? errors[key].message : key}
                </legend>
                <input
                  {...register(key, { required: "This is required" })}
                  className="w-full outline-none"
                  type="text"
                  placeholder={`Provide ${key}`}
                />
              </fieldset>
            ))}
        </div>

        <div className="flex justify-center items-center col-span-3">
          <button className={`bg-green-600 ${isSubmitVisible} text-black py-2 w-[20%] rounded-md cursor-pointer`}>
            Submit
          </button>
        </div>
      </form>

      {/* Generate Mail Button */}
      <section className="flex justify-center mt-4">
        <button
          onClick={genMail}
          className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${isGenerateVisible} w-[20%] text-black rounded-md cursor-pointer py-2`}
        >
          Generate Mail
        </button>
      </section>

      {/* Reset Form Button */}
      <section className="flex justify-center mt-4">
        <button
          onClick={resetForm}
          className={`bg-red-500 border border-red-400 ${isGenerateVisible} w-[20%] text-white rounded-md cursor-pointer py-2`}
        >
          Reset Form
        </button>
      </section>

      {/* Mail Output */}
      {mail !== "" && (
        <div className="bg-zinc-800 px-4 py-6 mt-5 rounded-xl text-white w-[80%] mx-auto">
          <header className="flex justify-end mb-5">
            <p onClick={copyToClipboard} className="text-zinc-400 text-2xl cursor-pointer"><IoCopy /></p>
            <p onClick={translateMail} className="text-zinc-400 text-2xl cursor-pointer"><MdGTranslate /></p>
          </header>
          <p className="whitespace-pre-line">{mail}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Input;