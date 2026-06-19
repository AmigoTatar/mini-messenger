import React from 'react';

export default function ChatArea({ 
  activeChatId, 
  activeChat, 
  setActiveChatId, 
  inputValue, 
  setInputValue, 
  handleSendMessage, 
  messagesEndRef,
  isTyping // Принимаем проп
}) {
  return (
    <div class={`flex-col flex-1 h-full bg-zinc-900/30 ${activeChatId ? 'flex' : 'hidden md:flex'}`}>
      
      {!activeChatId ? (
        /* Заглушка, когда ни один чат не выбран */
        <div class="flex-1 flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
          <span class="text-4xl mb-2">💬</span>
          <p class="text-sm">Выберите чат, чтобы начать общение</p>
        </div>
      ) : (
        /* Активное окно чата */
        <div class="flex flex-col h-full">
          
          {/* Шапка чата */}
          <div class="p-4 border-b border-zinc-800 flex items-center bg-zinc-950/40">
            <button onClick={() => setActiveChatId(null)} class="md:hidden mr-3 p-1 hover:bg-zinc-800 rounded-lg transition">
              <span class="text-xl">🔙</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg mr-3 shadow-inner">
              {activeChat.avatar}
            </div>
            <div>
              <h2 class="font-semibold text-sm">{activeChat.name}</h2>
              <span class="text-xs transition-colors duration-300">
                {isTyping ? <span class="text-emerald-400 animate-pulse">печатает...</span> : <span class="text-zinc-400">онлайн</span>}
              </span>
            </div>
          </div>

          {/* Лента сообщений */}
          <div class="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-zinc-950/20">
            {activeChat.messages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} class={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div class={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm flex flex-col gap-0.5 ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-100 rounded-bl-none'}`}>
                    <p class="leading-relaxed break-words">{msg.text}</p>
                    <span class="text-[9px] self-end text-white/60">{msg.time}</span>
                  </div>
                </div>
              );
            })}

            {/* Анимация печатающих точек в ленте (стоит ПОСЛЕ массива сообщений) */}
            {isTyping && (
              <div class="flex justify-start mb-2">
                <div class="bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm flex items-center gap-1">
                  <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Панель ввода */}
          <form onSubmit={handleSendMessage} class="p-4 bg-zinc-950/40 border-t border-zinc-800 flex gap-2 items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Напишите сообщение..." 
              autocomplete="off" 
              class="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition text-white placeholder-zinc-500"
            />
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition active:scale-95 shadow-md shadow-emerald-900/20">
              Отправить
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
