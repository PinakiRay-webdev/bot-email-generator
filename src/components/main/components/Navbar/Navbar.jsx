import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [greet, setGreet] = useState("");

  const displayGreet = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
      setGreet("Good morning");
    } else if (hours >= 12 && hours < 18) {
      setGreet("Good afternoon");
    } else if (hours >= 18 && hours < 23) {
      setGreet("Good evening");
    } else {
      setGreet("Still awake!");
    }
  };



  useEffect(() => {
    displayGreet();
  }, []);


  return (
    <div>
      <div className="text-white flex justify-between items-center">
        <h1 className="text-3xl">{greet}</h1>

      </div>
        <ToastContainer />
    </div>
  );
};

export default Navbar;
