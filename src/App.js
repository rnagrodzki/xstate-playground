import React from "react";
import "./styles.css";
import service from "./xstateMachines";

export default function App() {
  return (
    <div className="App">
      <h1>xState playground</h1>
      <h2>Please check console.</h2>
      <button onClick={event => service.send("machine.init")}>
        Init Machine
      </button>
      <button onClick={event => service.send("async.machine.init")}>
        Init async Machine
      </button>
    </div>
  );
}
