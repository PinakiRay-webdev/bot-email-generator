import React from 'react'
import { IoIosCloseCircle } from "react-icons/io";
const ErrorBox = ({errorBoxVisibility , setErrorBoxVisibilit , suggestion}) => {

    const closeBox = () =>{
        setErrorBoxVisibilit("hidden")
    }

  return (
    <div className={`${errorBoxVisibility} bg-white h-[50vh] w-[25vw] rounded-md p-3 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`} >
      <header className='flex justify-end' >
        <p onClick={closeBox} className='text-red-500 text-2xl cursor-pointer' ><IoIosCloseCircle/></p>
      </header>
        <section className='error-text h-[85%] overflow-y-hidden mt-8' >
            <p className='whitespace-pre-line text-zinc-600 font-semibold' >{suggestion}</p>
        </section>
    </div>
  )
}

export default ErrorBox
