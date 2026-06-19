import { useState, useRef, useEffect } from 'react';
// Импортируем оба наших компонента
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const INITIAL_CHATS = [
  {
    id: "chat_1",
    name: "Дмитрий (Разработка)",
    avatar: "👨‍💻",
    messages: [
      { id: "m1", text: "Привет! Как там компас?", sender: "friend", time: "14:15" },
      { id: "m2", text: "Привет! Всё работает, пишу шаблон", sender: "me", time: "14:16" },
      { id: "m3", text: "Отлично, давай пилить мессенджер!", sender: "friend", time: "14:17" }
    ]
  },
  {
    id: "chat_2",
    name: "Флудилка (Кофе)",
    avatar: "☕",
    messages: [
      { id: "m4", text: "Кто пойдет пить кофе через 5 минут?", sender: "friend", time: "15:00" }
    ]
  },
  {
    id: "chat_3",
    name: "Мама",
    avatar: "❤️",
    messages: [
      { id: "m5", text: "Ты покушал?", sender: "friend", time: "11:02" }
    ]
  }
];

export default function App() {
  // Главные состояния приложения
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('messenger_chats');
    return savedChats ? JSON.parse(savedChats) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const activeChat = chats.find(c => c.id === activeChatId);
  
  // Фильтрация чатов на лету
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Автоскролл к новому сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, activeChatId]);

  // Сохранение в локальное хранилище
  useEffect(() => {
    localStorage.setItem('messenger_chats', JSON.stringify(chats));
  }, [chats]);

  // Функция отправки сообщения
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || !activeChatId) return;

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { id: 'm_' + Date.now(), text, sender: 'me', time: timeStr }]
        };
      }
      return chat;
    }));

    setInputValue('');

    // ИСПРАВЛЕНО: Правильная вложенность таймеров автоответа
    setTimeout(() => {
      setIsTyping(true); // Включаем статус печати через 2 секунды

      setTimeout(() => {
        setIsTyping(false); // Выключаем статус печати ещё через 3 секунды
        
        const replyTime = new Date();
        const replyTimeStr = replyTime.getHours().toString().padStart(2, '0') + ':' + replyTime.getMinutes().toString().padStart(2, '0');

        setChats(prevChats => prevChats.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, { 
                id: 'reply_' + Date.now(), 
                text: "Интересно! Расскажи подробнее 🤔", 
                sender: 'friend', 
                time: replyTimeStr 
              }]
            };
          }
          return chat;
        }));
      }, 3000); // Симуляция печати длится 3 секунды

    }, 2000); // Пауза до начала печати составляет 2 секунды
  };

  return (
    <div class="bg-zinc-900 text-white h-screen flex justify-center items-center font-sans antialiased">
      {/* Главный контейнер приложения */}
      <div class="w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-2xl md:border md:border-zinc-800 bg-zinc-950 flex overflow-hidden shadow-2xl">
        
        {/* Левая ... панель */}
        <Sidebar 
          chats={filteredChats} 
          activeChatId={activeChatId} 
          setActiveChatId={setActiveChatId} 
          searchQuery={searchQuery}       
          setSearchQuery={setSearchQuery} 
        />

        {/* Правая панель */}
        <ChatArea 
          activeChatId={activeChatId}
          activeChat={activeChat}
          setActiveChatId={setActiveChatId}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
          isTyping={isTyping}
        />

      </div>
    </div>
  );
}
