import React from 'react';

// Компонент принимает данные через пропсы (props) от главного родителя
// 1. Принимаем searchQuery и setSearchQuery в круглых скобках функции:
export default function Sidebar({ chats, activeChatId, setActiveChatId, searchQuery, setSearchQuery }) {
  return (
    <div class={`w-full md:w-80 border-r border-zinc-800 flex flex-col h-full bg-zinc-950/50 shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
      
      {/* Шапка */}
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h1 class="text-xl font-bold tracking-wide">Мессенджер</h1>
        <span class="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-medium">Онлайн</span>
      </div>

      {/* НОВАЯ ФИЧА: Поле поиска чатов */}
      <div class="p-3 border-b border-zinc-900/60 bg-zinc-950/20">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск чатов..."
          class="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500/50 transition text-white placeholder-zinc-500"
        />
      </div>

      
      {/* Список чатов */}
      <div class="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-900">
        {chats.map(chat => {
          const lastMsg = chat.messages[chat.messages.length - 1];
          return (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              class={`p-4 flex items-center cursor-pointer hover:bg-zinc-900/50 transition ${chat.id === activeChatId ? 'bg-zinc-900 border-l-2 border-emerald-500' : ''}`}
            >
              <div class="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-xl mr-3 shrink-0 shadow-inner">{chat.avatar}</div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="font-medium text-sm truncate">{chat.name}</h3>
                  <span class="text-[10px] text-zinc-500 whitespace-nowrap ml-2">{lastMsg?.time || ''}</span>
                </div>
                <p class="text-xs text-zinc-400 truncate">{lastMsg?.text || 'Нет сообщений'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
