
import { useState, useRef, useEffect } from 'react'
import './index.css'
import ReactMarkdown from 'react-markdown'

function App() {
  // Nombre del bot 
  const botName = "Billr";
  
// Cargar mensajes desde localStorage o usar el mensaje de bienvenida
const [messages, setMessages] = useState(() => {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    return JSON.parse(savedMessages);
  } else {
    return [{ 
      role: 'bot', 
      content: `¡Hola! Soy ${botName}, tu asistente virtual para la materia de Billetaje y Reservas. ¿En qué puedo ayudarte hoy?` 
    }];
  }
});

const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const messagesEndRef = useRef(null);

// Guardar mensajes en localStorage cuando cambian
useEffect(() => {
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}, [messages]);

  // Auto-scroll al fondo cuando llegan nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para limpiar el historial
  const clearChat = () => {
    const initialMessage = { 
      role: 'bot', 
      content: `¡Hola! Soy ${botName}, tu asistente virtual para la materia de Billetaje y Reservas. ¿En qué puedo ayudarte hoy?` 
    };
    setMessages([initialMessage]);
    localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
  };

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
      {/* Header con logo institucional */}
      <div className="bg-airline-blue py-3 px-4 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center mb-2 sm:mb-0">
            {/* Logo - puedes usar una URL o un archivo importado */}
            <img 
              src="https://sied.utn.edu.ar/pluginfile.php/1/theme_adaptable/adaptablemarkettingimages/0/logoutnwhite.png" 
              alt="Logo Institucional" 
              className="h-6 sm:h-8 mr-2"
            />
            <span className="text-lg sm:text-xl">Asistente de Billetaje y Reservas</span>
          </h1>
          <span className="text-xs sm:text-sm bg-white text-airline-blue px-2 py-1 rounded-full text-center">
          Tecnicatura Universitaria en Gestión Aeronáutica
          </span>
          <button 
              onClick={clearChat} 
              className="ml-2 text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-full"
              title="Limpiar conversación"
            >
              Limpiar
            </button>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar para el bot */}
            {message.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-airline-blue text-white flex items-center justify-center mr-2 flex-shrink-0">
                {botName.charAt(0)}
              </div>
            )}
            
            <div 
              className={`max-w-[75%] rounded-lg px-4 py-2 markdown ${
                message.role === 'user' 
                  ? 'bg-airline-blue text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            
            {/* Avatar para el usuario */}
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center ml-2 flex-shrink-0">
              🙂
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-airline-blue text-white flex items-center justify-center mr-2 flex-shrink-0">
              {botName.charAt(0)}
            </div>
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
            placeholder={`Pregúntale a ${botName} sobre la materia...`}
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
        <div className="text-xs text-center mt-2 text-gray-500">
          Desarrollado para la cátedra de Billetaje y Reservas | Prof. Facundo Villafañe
        </div>
      </div>
    </div>
  );
}

export default App;