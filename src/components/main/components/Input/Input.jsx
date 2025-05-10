import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../../supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import { generateFORM } from "../../../../../functions/geminiAI";
import { generateMail } from "../../../../../functions/generateMail";
import "react-toastify/dist/ReactToastify.css";
import { IoCopy } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import { makeTranslate } from "../../../../../functions/Translate";
import { makeSuggestion } from "../../../../../functions/Suggestion";
import { checkGovernmental } from "../../../../../functions/checkGovernment";
import ErrorBox from "./component/ErrorBox";
import GovtConfirmBox from "./component/GovtConfirmBox";
import { checkMeeting } from "../../../../../functions/checkForMeeting";
import ScheduleMeeting from "./component/ScheduleMeeting";
import emailjs from 'emailjs-com'

let dynamicInputArray = [];

const Input = () => {
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitVisible, setIsSubmitVisible] = useState("block");
  const [isGenerateVisible, setIsGenerateVisible] = useState("hidden");
  const [mail, setMail] = useState("");
  const [isDynamicFormVisible, setIsDynamicFormVisible] = useState("hidden");
  const [sub, setSub] = useState("");
  const [dynamicData, setDynamicData] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [errorBoxVisibility, setErrorBoxVisibility] = useState("hidden");
  const [govtBoxVisibility, setGovtBoxVisibility] = useState("hidden");
  const [isGoogleMeetingOpen, setIsGoogleMeetingOpen] = useState("hidden");
  const [isSubjectEditable, setIsSubjectEditable] = useState(true);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user?.email) {
      setLoggedInUser(session.user.email)
    }
  });
}, []);

  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      subject: "",
      tone: "Formal",
    },
  });

  useEffect(() => {
    if (typeof dynamicInputArray === "string") {
      setErrorBoxVisibility("absolute");
    } else {
      setErrorBoxVisibility("hidden");
    }
  }, [dynamicInputArray]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const api_key = import.meta.env.VITE_API_KEY; // Ensure this is correctly set up

  const resetForm = () => {
    reset({ subject: "", tone: "Formal" });
    setIsSubmitVisible("block");
    setIsGenerateVisible("hidden");
    setIsDynamicFormVisible("hidden");
    setIsSubjectEditable(true);
    setMail("");
    setIsGoogleMeetingOpen("hidden");
    setScheduleDate(null);
    setScheduleTime(null);
    setErrorBoxVisibility("hidden");
    setGovtBoxVisibility("hidden");
    setSuggestion("");

    dynamicInputArray = [];
    setDynamicData({});
    setFormData({});
    setSub("");
  };

  const handleFormData = async (data) => {
    if (!session) {
      toast.warning("Please create an account or log in first.", {
        theme: "dark",
      });
      return;
    }

    toast.loading("Generating form fields...", {
      theme: "dark",
      autoClose: false,
    });

    setMail("");
    setIsGoogleMeetingOpen("hidden");
    setScheduleDate(null);
    setScheduleTime(null);
    setErrorBoxVisibility("hidden");
    setSuggestion("");
    dynamicInputArray = [];
    setDynamicData({});
    setIsDynamicFormVisible("hidden");

    const isGovtApproved = await checkGovernmental(data.subject);
    if (isGovtApproved === "true") {
      setGovtBoxVisibility("absolute");
    }

    try {
      const generatedFields = await generateFORM(api_key, data.subject);
      toast.dismiss();

      if (typeof generatedFields === "string") {
        dynamicInputArray = [];
        setSuggestion(await makeSuggestion(data.subject));
        setErrorBoxVisibility("absolute");
        throw new Error(generatedFields);
      }

      dynamicInputArray = generatedFields;
      const translatedSubject = await makeTranslate(data.subject);

      setIsSubjectEditable(false);
      setValue("subject", translatedSubject);
      setIsSubmitVisible("hidden");
      setIsGenerateVisible("block");
      setIsDynamicFormVisible("block");

      setFormData({ subject: translatedSubject, tone: data.tone });
      setSub(data.subject);

      toast.success("Form fields generated! Please fill them out.", {
        theme: "dark",
      });
    } catch (error) {
      toast.dismiss();
      toast.error(`Error generating form: ${error.message}`, { theme: "dark" });
      setIsSubjectEditable(true);
      setIsSubmitVisible("block");
      setIsGenerateVisible("hidden");
      setIsDynamicFormVisible("hidden");
      dynamicInputArray = [];
    }
  };

const genMail = async () => {
  const currentFormValues = getValues();

  const tempDynamicData = {};
  let foundDateKey = null;
  let foundTimeKey = null;

  if (
    typeof dynamicInputArray !== "object" ||
    !Array.isArray(dynamicInputArray)
  ) {
    console.error("dynamicInputArray is not an array:", dynamicInputArray);
    toast.error("Error: Form fields structure is invalid.", {
      theme: "dark",
    });
    return;
  }

  dynamicInputArray.forEach((key) => {
    if (typeof key !== "string") {
      console.warn("Invalid key found in dynamicInputArray:", key);
      return;
    }
    tempDynamicData[key] = currentFormValues[key]?.trim() ?? "";

    if (!foundDateKey && key.toLowerCase().includes("date")) {
      foundDateKey = key;
    }
    if (!foundTimeKey && key.toLowerCase().includes("time")) {
      foundTimeKey = key;
    }
  });

  const dateValue = foundDateKey ? tempDynamicData[foundDateKey] : null;
  const timeValue = foundTimeKey ? tempDynamicData[foundTimeKey] : null;

  setScheduleDate(dateValue);
  setScheduleTime(timeValue);

  setDynamicData(tempDynamicData);

  toast.loading("Generating mail...", { theme: "dark", autoClose: false });
  try {
    const generatedMailContent = await generateMail(
      api_key,
      sub,
      tempDynamicData
    );
    setMail(generatedMailContent);
    toast.dismiss();
    toast.success("Mail generated successfully!", { theme: "dark" });

    
    toast.loading("Sending email...", { theme: "dark", autoClose: false });
    const emailParams = {
      to_email: loggedInUser,
      subject: sub,
      message: generatedMailContent,
    };

    emailjs
      .send(
        "service_0g5sarg",  
        "template_aeoxcny",
        emailParams,
        "4DQhQ16fMjXCVTJB1"
      )
      .then(() => {
        toast.dismiss();
        toast.success("Email sent successfully!", { theme: "dark" });
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(`Failed to send email: ${error.text}`, { theme: "dark" });
      });

    const isMeeting = await checkMeeting(sub);

    if (isMeeting && dateValue && timeValue) {
      setIsGoogleMeetingOpen("absolute");
    } else {
      setIsGoogleMeetingOpen("hidden");
    }
  } catch (error) {
    toast.dismiss();
    toast.error(`Error generating mail: ${error.message}`, { theme: "dark" });
    setIsGoogleMeetingOpen("hidden");
  }
};

  const copyToClipboard = () => {
    if (mail) {
      navigator.clipboard.writeText(mail).then(() => {
        toast.success("Copied to clipboard!", {
          theme: "dark",
          position: "top-center",
          autoClose: 1500,
        });
      });
    }
  };

  const startVoiceTyping = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition is not supported in this browser.", {
        theme: "dark",
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"; // Set language
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...", { theme: "dark", autoClose: 3000 });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue("subject", transcript, { shouldValidate: true });
      toast.success("Voice input captured!", { theme: "dark" });
    };

    recognition.onerror = (event) => {
      toast.error(`Voice Recognition Error: ${event.error}`, { theme: "dark" });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- Render ---
  return (
    <div className="text-slate-400 mt-20 md:mt-28 px-4">
      <div className="relative w-[80%] mx-auto">
        <ErrorBox
          errorBoxVisibility={errorBoxVisibility}
          setErrorBoxVisibilit={setErrorBoxVisibility}
          suggestion={suggestion}
        />
        <GovtConfirmBox
          govtBoxVisibility={govtBoxVisibility}
          setGovtBoxVisibility={setGovtBoxVisibility}
        />
      </div>

      <form
        onSubmit={handleSubmit(handleFormData)}
        className="grid grid-cols-3 gap-4 md:gap-6 w-[90%] md:w-[80%] mx-auto mt-8"
      >
        <fieldset
          className={`border px-3 py-2 col-span-1 rounded-md transition-colors ${
            errors.subject
              ? "border-red-500"
              : "border-zinc-600 focus-within:border-blue-500"
          }`}
        >
          <legend
            className={`px-1 text-sm transition-colors ${
              errors.subject ? "text-red-500" : "text-zinc-400"
            }`}
          >
            {errors.subject ? errors.subject.message : "Subject / Topic"}
          </legend>
          <div className="flex items-center">
            <input
              {...register("subject", { required: "Subject is required" })}
              className={`w-full outline-none bg-transparent text-base placeholder-zinc-500 ${
                !isSubjectEditable
                  ? "cursor-not-allowed text-gray-500"
                  : "text-slate-300"
              }`}
              type="text"
              placeholder="e.g., Request for sick leave tomorrow"
              disabled={!isSubjectEditable}
              aria-invalid={errors.subject ? "true" : "false"}
            />
            {isSubjectEditable &&
              (isListening ? (
                <span className="text-sm text-blue-400 animate-pulse ml-2 whitespace-nowrap">
                  Listening...
                </span>
              ) : (
                <button
                  type="button"
                  onClick={startVoiceTyping}
                  className="text-2xl text-zinc-400 hover:text-white transition-colors ml-2 p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                >
                  <MdKeyboardVoice aria-label="Start voice input" />
                </button>
              ))}
          </div>
        </fieldset>

        <fieldset
          className={`border px-3 py-2 col-span-1 rounded-md transition-colors ${"border-zinc-600 focus-within:border-blue-500"}`}
        >
          <legend className="px-1 text-sm text-zinc-400">
            User
          </legend>
            <input type="email" placeholder={loggedInUser} disabled={true} className="cursor-not-allowed w-full"/>
        </fieldset>

        <fieldset
          className={`border px-3 py-2 col-span-1 rounded-md transition-colors ${"border-zinc-600 focus-within:border-blue-500"}`}
        >
          <legend className="px-1 text-sm text-zinc-400">Tone</legend>
          <select
            {...register("tone")}
            className={`w-full outline-none bg-transparent text-base ${
              !isSubjectEditable
                ? "cursor-not-allowed text-gray-500"
                : "text-slate-300"
            }`}
            disabled={!isSubjectEditable}
          >
            <option className="text-black bg-white" value="Formal">
              Formal
            </option>
            <option className="text-black bg-white" value="Informal">
              Informal
            </option>
            <option className="text-black bg-white" value="Casual">
              Casual
            </option>
            <option className="text-black bg-white" value="Professional">
              Professional
            </option>
          </select>
        </fieldset>

        {isDynamicFormVisible === "block" &&
          typeof dynamicInputArray === "object" &&
          Array.isArray(dynamicInputArray) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-4 md:gap-6 mt-4">
              {dynamicInputArray.map((key, index) => {
                if (typeof key !== "string") return null;

                const lowerKey = key.toLowerCase();
                const inputType = lowerKey.includes("date")
                  ? "date"
                  : lowerKey.includes("time")
                  ? "time"
                  : lowerKey.includes("email")
                  ? "email"
                  : lowerKey.includes("number") ||
                    lowerKey.includes("count") ||
                    lowerKey.includes("quantity")
                  ? "number"
                  : "text";

                const legendText = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <fieldset
                    key={`${key}-${index}`}
                    className={`border px-3 py-2 rounded-md transition-colors ${
                      errors[key]
                        ? "border-red-500"
                        : "border-zinc-600 focus-within:border-blue-500"
                    }`}
                  >
                    <legend
                      className={`px-1 text-sm transition-colors ${
                        errors[key] ? "text-red-500" : "text-zinc-400"
                      }`}
                    >
                      {errors[key] ? errors[key].message : legendText}
                    </legend>
                    <input
                      {...register(key, {
                        required: `${legendText} is required`,
                      })}
                      className="w-full outline-none bg-transparent text-base placeholder-zinc-500 text-slate-300"
                      type={inputType}
                      placeholder={`Enter ${legendText.toLowerCase()}`}
                      aria-invalid={errors[key] ? "true" : "false"}
                    />
                  </fieldset>
                );
              })}
            </div>
          )}

        {isSubmitVisible === "block" && (
          <div className="flex justify-center items-center col-span-1 md:col-span-3 mt-4">
            <button
              type="submit"
              className={`bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-8 rounded-md cursor-pointer transition-colors w-full sm:w-auto`}
            >
              Generate Fields
            </button>
          </div>
        )}
      </form>

      {isGenerateVisible === "block" && (
        <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-[90%] md:w-[80%] mx-auto">
          <button
            onClick={genMail}
            className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-2 px-8 rounded-md cursor-pointer transition-all w-full sm:w-auto`}
          >
            Generate Mail
          </button>
          <button
            onClick={resetForm}
            className={`bg-red-600 hover:bg-red-700 border border-red-500 text-white font-medium py-2 px-8 rounded-md cursor-pointer transition-colors w-full sm:w-auto`}
          >
            Reset Form
          </button>
        </section>
      )}

      {mail && (
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 px-4 sm:px-6 py-6 mt-8 rounded-xl text-white w-[90%] md:w-[80%] mx-auto shadow-lg">
          <header className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-300">
              Generated Mail
            </h3>
            <button
              onClick={copyToClipboard}
              className="text-zinc-400 text-2xl cursor-pointer hover:text-white transition-colors p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
              aria-label="Copy mail content"
            >
              <IoCopy />
            </button>
          </header>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-300">
            {mail}
          </p>
        </div>
      )}

      <ScheduleMeeting
        isGoogleMeetingOpen={isGoogleMeetingOpen}
        setIsGoogleMeetingOpen={setIsGoogleMeetingOpen}
        sub={sub}
        date={scheduleDate || ""}
        time={scheduleTime || ""}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Input;
