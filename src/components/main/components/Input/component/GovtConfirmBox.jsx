import { IoIosCloseCircle } from "react-icons/io";
import { IoWarning } from "react-icons/io5";

const GovtConfirmBox = ({govtBoxVisibility , setGovtBoxVisibility}) => {

  const closeBox = () =>{
    setGovtBoxVisibility('hidden')
  }

  return (
    <div
      className={`${govtBoxVisibility} bg-white h-[55vh] w-[28vw] rounded-md absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
    >
      <header className="flex justify-end relative bg-lime-200 h-[30%] p-1">
        <p onClick={closeBox} className="text-lime-700 text-2xl cursor-pointer">
          <IoIosCloseCircle />
        </p>
        <article className="absolute bottom-[-2rem] left-[50%] translate-x-[-50%] z-10 bg-lime-400 rounded-full p-3">
          <p className="text-lime-700 text-5xl">
            <IoWarning />
          </p>
        </article>
      </header>
      <section className="error-text h-[85%] overflow-y-hidden mt-12">
        <h2 className="text-center font-semibold text-lime-600 text-xl">
          Confirmation for Govenrmental work
        </h2>
        <div className="h-[58%] w-[90%] mx-auto">
          <p
            id="disclaimer"
            className="whitespace-pre-line text-zinc-600 font-semibold my-2 text-sm text-center"
          >
            By proceeding, you confirm that you possess the necessary
            documentation and authorization to communicate with governmental
            bodies on behalf of the concerned entity.
          </p>
          <div className="flex flex-col gap-2 w-[70%] mx-auto mt-4">
            <button className="bg-green-700 text-white py-2 rounded-2xl cursor-pointer">
              I understand
            </button>
            <button className="border border-green-700 text-green-700 py-2 rounded-2xl cursor-pointer">
              cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GovtConfirmBox;
