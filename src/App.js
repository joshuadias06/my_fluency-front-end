import React, { useState, useEffect } from 'react';
import './App.css';
import ChatRecorder from './ChatRecorder';

function App() {
  // Estado para armazenar o tema
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Função para alternar entre tema claro e escuro
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Ao carregar a página, verifica se o tema foi previamente salvo
  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
  }, [theme]);

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

      {/* Botão para alternar entre temas */}
      <div className="theme-toggle-btn" onClick={toggleTheme}>
        <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
      </div>

      {/* Renderizando o componente ChatRecorder */}
      <ChatRecorder />
    </div>
  );
}

export default App;
