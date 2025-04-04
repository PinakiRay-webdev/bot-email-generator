import React from "react";
import Sidenav from "./components/side nav/Sidenav";
import Main from "./components/main/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Authentication/Login/Login";
import SignUp from "./Authentication/SignUp/SignUp";
const App = () => {
  const endpoints = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="flex h-screen">
          <Sidenav />
          <Main />
        </div>
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
