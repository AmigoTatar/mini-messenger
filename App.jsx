import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ProfilePanel from './components/ProfilePanel';

// Заменяем 5000 на 5001
const socket = io('http://localhost:5001'); 


const INITIAL_CHATS = [
  {
    id: "chat_1", name: "Дмитрий (Разработка)", avatar: "👨‍💻",
    messages: [
      { id: "m1", text: "Привет! Как там компас?", sender: "friend", time: "14:15" },
      { id: "m2", text: "Привет! Всё работает, пишу шаблон", sender: "me", time: "14:16", status: "read" },
      { id: "m3", text: "Отлично, давай пилить мессенджер!", sender: "friend", time: "14:17" }
    ]
  },
  { id: "chat_2", name: "Флудилка (Кофе)", avatar: "☕", messages: [{ id: "m4", text: "Кто пойдет пить кофе?", sender: "friend", time: "15:00" }] },
  { id: "chat_3", name: "Мама", avatar: "❤️", messages: [{ id: "m5", text: "Ты покушал?", sender: "friend", time: "11:02" }] }
];

export default function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('messenger_chats');
    return savedChats ? JSON.parse(savedChats) : INITIAL_CHATS;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('messenger_dark_mode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Тестируем соединение с бэкендом
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Успешно подключились к бэкенд серверу через WebSockets!');
    });
    return () => { socket.off('connect'); };
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('messenger_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => { setIsProfileOpen(false); }, [activeChatId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChat?.messages, activeChatId]);
  useEffect(() => { localStorage.setItem('messenger_chats', JSON.stringify(chats)); }, [chats]);

  useEffect(() => {
    if (!activeChatId) return;
    const readTimeout = setTimeout(() => {
      setChats(prev => prev.map(c => c.id === activeChatId ? {
        ...c, messages: c.messages.map(m => m.sender === 'me' && m.status !== 'read' ? { ...m, status: 'read' } : m)
      } : c));
    }, 1500);
    return () => clearTimeout(readTimeout);
  }, [activeChatId, activeChat?.messages?.length]);

  const handleDeleteMessage = (msgId) => {
    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, isDeleted: true } : m)
    } : c));
  };

  const triggerBotReply = (replyText) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        setChats(prev => prev.map(c => c.id === activeChatId ? {
          ...c, messages: [...c.messages, { id: 'reply_' + Date.now(), text: replyText, sender: 'friend', time: timeStr }]
        } : c));
      }, 3000);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || !activeChatId) return;
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c, messages: [...c.messages, { id: 'm_' + Date.now(), text, sender: 'me', time: timeStr, status: 'sent' }]
    } : c));
    setInputValue('');
    triggerBotReply("Интересно! Расскажи подробнее 🤔");
  };

  const handleSendImage = (base64Image) => {
    if (!activeChatId) return;
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c, messages: [...c.messages, { id: 'img_' + Date.now(), type: 'image', image: base64Image, sender: 'me', time: timeStr, status: 'sent' }]
    } : c));
    triggerBotReply("Ого, классная картинка! 👍");
  };

  const handleSendAudio = (base64Audio) => {
    if (!activeChatId) return;
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c, messages: [...c.messages, { id: 'audio_' + Date.now(), type: 'audio', audio: base64Audio, sender: 'me', time: timeStr, status: 'sent' }]
    } : c));
    triggerBotReply("Послушал твоё голосовое, всё понял! 🎧");
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white h-screen flex justify-center items-center font-sans antialiased transition-colors duration-300">
      <div className="w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-2xl md:border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex overflow-hidden shadow-2xl transition-colors duration-300">
        <Sidebar chats={filteredChats} activeChatId={activeChatId} setActiveChatId={setActiveChatId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
        <ChatArea activeChatId={activeChatId} activeChat={activeChat} setActiveChatId={setActiveChatId} inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} messagesEndRef={messagesEndRef} isTyping={isTyping} onDeleteMessage={handleDeleteMessage} onSendImage={handleSendImage} onSendAudio={handleSendAudio} onToggleProfile={() => setIsProfileOpen(!isProfileOpen)} />
        <ProfilePanel activeChat={activeChat} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </div>
    </div>
  );
}
