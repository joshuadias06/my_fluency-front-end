import React, { useEffect, useRef, useState } from 'react';
import './ChatRecorder.css';

const ChatRecorder = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const chatWindowRef = useRef(null);  // Referência para a janela de chat

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, currentMessage]);
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
      setCurrentMessage(data.transcription);
    })
    .catch(error => {
      console.error('Erro ao transcrever áudio:', error);
    });
  };

  return (
    <div className="chat-recorder">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">{msg}</div>
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
                <i className="fas fa-microphone"></i> {/* Ícone de Microfone */}
              </button>
              <button 
                onClick={stopRecording} 
                disabled={!isRecording} 
                className="stop-button"
              >
                <i className="fas fa-square"></i> {/* Ícone de Quadrado */}
              </button>
            </div>
            <button 
              onClick={handleSendMessage} 
              className="send-button"
            >
              <i className="fas fa-arrow-up"></i> {/* Ícone de Setinha para cima */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRecorder;
