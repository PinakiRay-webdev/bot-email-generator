import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import googleIcon from '../../../../../assets/google.svg';
import { useForm } from "react-hook-form";
import { supabase } from "../../../../../../supabaseClient";

const ScheduleMeeting = ({ isGoogleMeetingOpen, setIsGoogleMeetingOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [formVisibility, setFormVisibility] = useState("hidden");
  const [textVisibility, setTextVisibility] = useState("block");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const proceedEvent = () => {
    setFormVisibility('block');
    setTextVisibility('hidden');
  };

  const closeBox = () => {
    setFormVisibility('hidden');
    setTextVisibility('block');
    setIsGoogleMeetingOpen('hidden');
  };

  const onSubmit = async (data) => {
    if (!session?.provider_token) {
      alert("Missing Google access token!");
      return;
    }

    if (new Date(data.end) <= new Date(data.start)) {
      alert("⚠️ End time must be after start time.");
      return;
    }

    const event = {
      summary: data.title,
      description: data.subtitle,
      start: {
        dateTime: new Date(data.start).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(data.end).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      setLoading(true);
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();
      if (result.id) {
        alert("✅ Event added to Google Calendar!");
        closeBox();
      } else {
        console.log(result);
        alert("❌ Failed to add event. Check console.");
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${isGoogleMeetingOpen} bg-white pb-8 h-fit w-[28vw] rounded-md absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
    >
      <header className="flex justify-end relative bg-lime-200 h-[6rem] p-1">
        <p onClick={closeBox} className="text-lime-700 text-2xl cursor-pointer">
          <IoIosCloseCircle />
        </p>
        <img className="absolute bottom-[-2rem] left-[50%] translate-x-[-50%] z-10 rounded-full w-18" src={googleIcon} alt="" />
      </header>

      <section className="error-text h-fit overflow-y-hidden mt-12">
        <h2 className={`text-center font-semibold text-lime-600 text-xl ${textVisibility}`}>
          Shall I add to your Google Calendar?
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className={`w-[90%] mx-auto ${formVisibility}`}>
          {/* Title */}
          <fieldset className="border-2 border-blue-500 rounded px-2 py-1 mb-2">
            <legend className="text-blue-500 font-semibold px-1">Title</legend>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full text-black outline-none"
            />
          </fieldset>
          {/* Sub Title */}
          <fieldset className="border-2 border-blue-500 rounded px-2 py-1 mb-2">
            <legend className="text-blue-500 font-semibold px-1">Sub Title</legend>
            <input
              type="text"
              {...register("subtitle", { required: true })}
              className="w-full text-black outline-none"
            />
          </fieldset>
          {/* Start Date */}
          <fieldset className="border-2 border-blue-500 rounded px-2 py-1 mb-2">
            <legend className="text-blue-500 font-semibold px-1">Start Time</legend>
            <input
              type="datetime-local"
              {...register("start", { required: true })}
              className="w-full text-black outline-none"
            />
          </fieldset>
          {/* End Date */}
          <fieldset className="border-2 border-blue-500 rounded px-2 py-1 mb-4">
            <legend className="text-blue-500 font-semibold px-1">End Time</legend>
            <input
              type="datetime-local"
              {...register("end", { required: true })}
              className="w-full text-black outline-none"
            />
          </fieldset>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded-md cursor-pointer hover:bg-blue-700"
          >
            {loading ? "Adding Event..." : "Add"}
          </button>
        </form>

        {/* Text + Buttons */}
        <div className={`flex flex-col gap-2 w-[70%] mx-auto mt-4 ${textVisibility}`}>
          <button onClick={proceedEvent} className="bg-green-700 text-white py-2 rounded-2xl cursor-pointer">
            Add the Event
          </button>
          <button onClick={closeBox} className="border border-green-700 text-green-700 py-2 rounded-2xl cursor-pointer">
            Not required
          </button>
        </div>
      </section>
    </div>
  );
};

export default ScheduleMeeting;
