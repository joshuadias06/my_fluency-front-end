import React from 'react';
import './App.css';
import ChatRecorder from './ChatRecorder';

function App() {
  return (
    <div className="App">
      <h1 className="title">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
          alt="US Flag"
          className="flag"
        />
        MyFluency
      </h1>
      <ChatRecorder /> {/* Verifique se o ChatRecorder está renderizando aqui */}
    </div>
  );
}

export default App;
