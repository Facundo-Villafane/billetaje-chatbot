// src/App.jsx
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import './index.css'

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '¡Hola! Soy tu asistente para la materia de Billetaje y Reservas Aeronáuticas. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al fondo cuando llegan nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para enviar mensajes a la API de Groq
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Añadir el mensaje del usuario a la conversación
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Llamada a la API a través de nuestro backend
      const response = await fetch('/.netlify/functions/ask-groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      // Añadir respuesta del bot
      if (data.response) {
        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Lo siento, ha ocurrido un error al procesar tu pregunta.' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'bot', content: 'Lo siento, ha ocurrido un error de conexión.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-airline-blue py-3 px-4 text-white">
        <h1 className="text-xl font-semibold">Asistente de Billetaje y Reservas</h1>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg px-4 py-2 markdown ${
                message.role === 'user' 
                  ? 'bg-airline-blue text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de entrada */}
      <div className="border-t border-gray-300 p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airline-blue"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-airline-blue hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;