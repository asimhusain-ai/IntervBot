// This code is written by - Asim Husain

import React from "react";
import InterviewScreen from "./pages/InterviewScreen";
import "./styles/App.css"; 

function App() {
  return (
    <>
       {/* Background animation */}
      <div className="app-container" style={{ position: "relative", zIndex: 1 }}>
        <InterviewScreen />
      </div>
    </>
  );
}


export default App;
