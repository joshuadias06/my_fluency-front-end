import React from 'react';
import './App.css';
import ChatRecorder from './ChatRecorder';

function App() {
  return (
    <div className="App">
      <h1>Fluency App</h1>
      <ChatRecorder />  {/* Verifique se o ChatRecorder está renderizando aqui */}
    </div>
  );
}

export default App;
