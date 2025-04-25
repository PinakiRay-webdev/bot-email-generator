import { IoIosCloseCircle } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import googleIcon from '../../../../../assets/google.svg'

const ScheduleMeeting = ({isGoogleMeetingOpen , setIsGoogleMeetingOpen}) => {

  const closeBox = () =>{
    setIsGoogleMeetingOpen('hidden')
  }

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
        <h2 className="text-center font-semibold text-lime-600 text-xl">
          Shall I add to your google calendar?
        </h2>
          <div className="flex flex-col gap-2 w-[70%] mx-auto mt-4">
            <button className="bg-green-700 text-white py-2 rounded-2xl cursor-pointer">
                Add the Event
            </button>
            <button className="border border-green-700 text-green-700 py-2 rounded-2xl cursor-pointer">
              Not required
            </button>
          </div>
      </section>
    </div>
  );
};

export default ScheduleMeeting;
