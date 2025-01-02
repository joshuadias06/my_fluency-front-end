import React, { useEffect, useRef, useState } from 'react';
import './ChatRecorder.css';

const ChatRecorder = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const chatWindowRef = useRef(null);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { text: currentMessage, sender: 'user' }]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    // Rola para o final da janela de mensagens sempre que uma nova mensagem for adicionada
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    // Configura o SpeechRecognition se o navegador for compatível
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'pt-BR'; // Definindo a língua para português
      recognitionInstance.interimResults = true; // Permite que a transcrição seja exibida enquanto o usuário fala

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setCurrentMessage(transcript); // Atualiza o campo de mensagem com a transcrição
      };

      recognitionInstance.onerror = (event) => {
        console.error('Erro no reconhecimento de fala:', event.error);
      };

      setRecognition(recognitionInstance); // Armazena a instância de reconhecimento de fala
    } else {
      console.error('SpeechRecognition não é suportado no seu navegador.');
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="chat-recorder">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message-wrapper ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="chat-message">
              {msg.text}
            </div>
            <div className={msg.sender === 'user' ? 'user-icon' : 'bot-icon'}>
              <i className="fas fa-user"></i> {/* Ícone de usuário */}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Digite ou fale sua mensagem"
            className="chat-input"
          />
          <div className="chat-controls">
            <div className="audio-controls">
              <button 
                onClick={startRecording} 
                disabled={isRecording} 
                className="record-button"
              >
                <i className="fas fa-microphone"></i>
              </button>
              <button 
                onClick={stopRecording} 
                disabled={!isRecording} 
                className="stop-button"
              >
                <i className="fas fa-square"></i>
              </button>
            </div>
            <button 
              onClick={handleSendMessage} 
              className="send-button"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRecorder;
