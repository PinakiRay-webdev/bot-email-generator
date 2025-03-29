import React from 'react'
import Sidenav from './components/side nav/Sidenav'
import Main from './components/main/Main'
const App = () => {
  return (
    <div className='flex h-screen' >
      <Sidenav/>
      <Main/>
    </div>
  )
}

export default App
