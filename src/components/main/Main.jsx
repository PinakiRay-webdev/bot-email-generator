import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Input from './components/Input/Input'
const Main = () => {
  return (
    <div className='bg-zinc-900 flex-1 px-4 py-3 overflow-y-scroll' >
      <Navbar/>
      <Input/>
    </div>
  )
}

export default Main
