import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [greet, setGreet] = useState("");

  const userData = JSON.parse(localStorage.getItem("userCredentials"));

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

  const navigate = useNavigate();

  const Logout = async () => {
    toast.loading("signing you out...", { theme: "dark" });
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1200);
    }).then(() => {
      toast.dismiss();
      signOut(auth)
        .then(() => {
          localStorage.clear();
          toast.success("logged out successfully", { theme: "dark" });
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`, { theme: "dark" });
        });
    });
  };

  useEffect(() => {
    displayGreet();
  }, []);

  useEffect(()=>{

  },[userData])

  return (
    <div>
      <div className="text-white flex justify-between items-center">
        <h1 className="text-3xl">{greet}</h1>

        {!userData ? (
          <section id="accounts" className="flex gap-2">
            <button className="ring-1 ring-gray-500 px-4 py-1 rounded">
              Get started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="ring-1 bg-gray-500 px-4 py-1 rounded"
            >
              Login
            </button>
          </section>
        ) : (
          <section>
            <p onClick={Logout} className="text-4xl cursor-pointer">
              <IoIosLogOut />
            </p>
          </section>
        )}
      </div>
        <ToastContainer />
    </div>
  );
};

export default Navbar;
