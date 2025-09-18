import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import Dashboard from "./pages/Dashboard";
import { VideoDetails } from "./pages/VideoDetails";

function App() {
  let routers = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: ":id",
          element: <VideoDetails />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}

export default App;
