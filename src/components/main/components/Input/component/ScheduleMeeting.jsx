import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import googleIcon from "../../../../../assets/google.svg";
import { supabase } from "../../../../../../supabaseClient";

const ScheduleMeeting = ({ isGoogleMeetingOpen, setIsGoogleMeetingOpen , sub , date , time }) => {

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  const proceedEvent = async () => {
    if (!session?.provider_token) {
      alert("Missing Google access token!");
      return;
    }
  
    try {
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
  
      if (isNaN(startDateTime.getTime())) {
        alert("Invalid date/time format.");
        return;
      }
  
      const event = {
        summary: sub,
        description: "sample meeting",
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
  
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

  const closeBox = () => {
    setIsGoogleMeetingOpen("hidden");
  };

  return (
    <div
      className={`${isGoogleMeetingOpen} bg-white pb-8 h-fit w-[28vw] rounded-md absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
    >
      <header className="flex justify-end relative bg-lime-200 h-[6rem] p-1">
        <p onClick={closeBox} className="text-lime-700 text-2xl cursor-pointer">
          <IoIosCloseCircle />
        </p>
        <img
          className="absolute bottom-[-2rem] left-[50%] translate-x-[-50%] z-10 rounded-full w-18"
          src={googleIcon}
          alt=""
        />
      </header>

      <section className="error-text h-fit overflow-y-hidden mt-12">
        <h2
          className={`text-center font-semibold text-lime-600 text-xl`}
        >
          Shall I add to your Google Calendar?
        </h2>

        {/* Text + Buttons */}
        <div
          className={`flex flex-col gap-2 w-[70%] mx-auto mt-4`}
        >
          <button
            onClick={proceedEvent}
            className="bg-green-700 text-white py-2 rounded-2xl cursor-pointer"
          >
            Add the Event
          </button>
          <button
            onClick={closeBox}
            className="border border-green-700 text-green-700 py-2 rounded-2xl cursor-pointer"
          >
            Not required
          </button>
        </div>
      </section>
    </div>
  );
};

export default ScheduleMeeting;
