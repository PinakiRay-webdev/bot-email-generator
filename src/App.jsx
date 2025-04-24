import React from "react";
import Sidenav from "./components/side nav/Sidenav";
import Main from "./components/main/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Authentication/Login/Login";
import SignUp from "./Authentication/SignUp/SignUp";
import Home from "./Pages/Home/Home";
import Meeting from "./Pages/Meeting/Meeting";
const App = () => {
  const endpoints = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },
    {
      path: "/mail",
      element: (
        <div className="flex h-screen">
          <Sidenav />
          <Main />
        </div>
      ),
    },
    {
      path: "/meeting",
      element: (
        <Meeting/>
      ),
    },
    {
      path : '/login',
      element: <Login/>
    },
    {
      path : '/signup',
      element: <SignUp/>
    }
  ]);

  return <RouterProvider router={endpoints} ></RouterProvider>;
};

export default App;
