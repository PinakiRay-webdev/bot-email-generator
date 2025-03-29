import {useState , useEffect} from 'react'
const Navbar = () => {

  const [greet, setGreet] = useState("");

  const displayGreet = () =>{
    const date = new Date();
    const hours = date.getHours();
    if(hours >= 5 && hours < 12){
      setGreet("Good morning");
    }else if(hours >= 12 && hours < 18){
      setGreet("Good afternoon")
    }else if(hours >= 18 && hours < 23){
      setGreet("Good evening")
    }else {
      setGreet("Still awake!")
    }
  }

  useEffect(() =>{
    displayGreet()
  } , []) 


  return (
    <div className='text-white flex justify-between items-center' >
      <h1 className='text-3xl' >{greet}</h1>
      <section id='accounts' className='flex gap-2' >
        <button className='ring-1 ring-gray-500 px-4 py-1 rounded' >Get started</button>
        <button className='ring-1 bg-gray-500 px-4 py-1 rounded' >Login</button>
      </section>
    </div>
  )
}

export default Navbar
