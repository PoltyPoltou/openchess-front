import { RouterProvider } from "react-router-dom";
import "./App.css"
import { getRouter } from "./routes";




function App() {
  return (
    <RouterProvider router={getRouter()} />
  );
}

export default App;
