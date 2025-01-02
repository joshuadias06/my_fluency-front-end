import React, { useEffect, useRef, useState } from 'react';
import './ChatRecorder.css';

const ChatRecorder = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
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
  }, [messages]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          setAudioChunks(prevChunks => [...prevChunks, event.data]);
        };
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          transcribeAudio(audioBlob);
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Erro ao acessar o microfone', error);
      });
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const transcribeAudio = (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    fetch('/api/transcribe-audio', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      setMessages([...messages, { text: data.transcription, sender: 'bot' }]);
    })
    .catch(error => {
      console.error('Erro ao transcrever áudio:', error);
    });
  };

  return (
    <div className="chat-recorder">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message-wrapper ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="chat-message">
              {msg.text}
            </div>
            <img 
              className={msg.sender === 'user' ? 'user-icon' : 'bot-icon'} 
              src={msg.sender === 'user' ? '/path-to-user-icon.jpg' : '/path-to-bot-icon.jpg'} 
              alt={msg.sender === 'user' ? 'User icon' : 'Bot icon'} 
            />
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
