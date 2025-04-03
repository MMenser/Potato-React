import { useEffect, useState } from "react";
import "./styles.css";
import Box from "./components/box";
function App() {
  return (
    <div className="bg-black min-h-screen flex flex-row">
      <div className="w-full flex-col">
        {/* First Row */}
        <div className="w-full h-1/2 flex-auto flex-row">
          <Box id={1} />
          <Box id={2} />
        </div>
      </div>

      <div className="w-full flex-col">
        {/* Second Row */}
        <div className="w-full h-1/2 flex-auto flex-row">
          <Box id={3} />
          <Box id={4} />
        </div>
      </div>
    </div>
  );
}

export default App;
