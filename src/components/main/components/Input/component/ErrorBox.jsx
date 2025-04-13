import React from 'react'
import { IoIosCloseCircle} from "react-icons/io";
import { IoWarning } from "react-icons/io5";
const ErrorBox = ({errorBoxVisibility , setErrorBoxVisibilit , suggestion}) => {

    const closeBox = () =>{
        setErrorBoxVisibilit("hidden")
    }

  return (
    <div className={`${errorBoxVisibility} bg-white h-[55vh] w-[38vw] rounded-md absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`} >
      <header className='flex justify-end relative bg-[#f7d9a9] h-[30%] p-1' >
        <p onClick={closeBox} className='text-[#ff9505] text-2xl cursor-pointer' ><IoIosCloseCircle/></p>
        <article className='absolute bottom-[-2rem] left-[50%] translate-x-[-50%] z-10 bg-[#f8bf4e] rounded-full p-3' >
          <p className='text-orange-400 text-5xl' ><IoWarning/></p>
        </article>
      </header>
        <section className='error-text h-[85%] overflow-y-hidden mt-12' >
            <h2 className='text-center font-semibold text-orange-400 text-xl' >we create mail only!!</h2>
            <div className='h-[58%] p-4 overflow-y-scroll' >
            <p className='whitespace-pre-line text-zinc-600 font-semibold mt-2' >{suggestion}</p>
            </div>
        </section>
    </div>
  )
}

export default ErrorBox
