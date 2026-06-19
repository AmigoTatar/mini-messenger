// Имитация базы данных (Mock Data) как в ТГ/Ватсап
const chatsData = [{
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

let activeChatId = null;

// Находим элементы DOM (вспоминаем ключевые слова!)
const chatsList = document.getElementById('chats-list');
const sidebar = document.getElementById('sidebar');
const chatArea = document.getElementById('chat-area');
const chatPlaceholder = document.getElementById('chat-placeholder');
const chatActive = document.getElementById('chat-active');

const chatTitle = document.getElementById('chat-title');
const chatAvatar = document.getElementById('chat-avatar');
const messagesContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const backBtn = document.getElementById('back-btn');

// 1. Функция отрисовки списка чатов в сайдбаре
function renderChats() {
    chatsList.innerHTML = ''; // Очищаем список перед перерисовкой

    chatsData.forEach(chat => {
        const lastMsg = chat.messages[chat.messages.length - 1];
        const lastText = lastMsg ? lastMsg.text : 'Нет сообщений';
        const lastTime = lastMsg ? lastMsg.time : '';

        // Создаем элемент чата
        const chatItem = document.createElement('div');
        chatItem.className = `p-4 flex items-center cursor-pointer hover:bg-zinc-900/50 transition ${chat.id === activeChatId ? 'bg-zinc-900 border-l-2 border-emerald-500' : ''}`;

        chatItem.innerHTML = `
                    <div class="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-xl mr-3 shrink-0 shadow-inner">${chat.avatar}</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-baseline mb-0.5">
                            <h3 class="font-medium text-sm truncate">${chat.name}</h3>
                            <span class="text-[10px] text-zinc-500 whitespace-nowrap ml-2">${lastTime}</span>
                        </div>
                        <p class="text-xs text-zinc-400 truncate">${lastText}</p>
                    </div> `;

        // Вешаем клик на выбор чата
        chatItem.addEventListener('click', () => selectChat(chat.id));
        chatsList.appendChild(chatItem);
    });
}

// 2. Логика выбора чата и адаптивного переключения экранов
function selectChat(chatId) {
    activeChatId = chatId;
    const chat = chatsData.find(c => c.id === chatId);

    // Обновляем шапку активного чата
    chatTitle.innerText = chat.name;
    chatAvatar.innerText = chat.avatar;

    // Переключаем видимость блоков (для ПК и Мобилок)
    chatPlaceholder.classList.add('hidden');
    chatActive.classList.remove('hidden');

    // Мобильная адаптивность: при выборе чата скрываем сайдбар, показываем чат
    if (window.innerWidth < 768) {
        sidebar.classList.add('hidden');
        chatArea.classList.remove('hidden');
        chatArea.classList.add('flex');
    }

    renderMessages(chat.messages);
    renderChats(); // Перерисовываем сайдбар, чтобы подсветить активный чат
}

// 3. Функция отрисовки сообщений внутри выбранного чата
function renderMessages(messages) {
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const isMe = msg.sender === 'me';
        const msgBubble = document.createElement('div');

        // Настраиваем стили: сообщения "от меня" справа (зеленые), "от друга" слева (серые)
        msgBubble.className = `flex ${isMe ? 'justify-end' : 'justify-start'}`;

        // ИСПРАВЛЕНО: Добавлены закрывающие теги </p> и </div>, а также обертка для времени
        msgBubble.innerHTML = `
            <div class="max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm flex flex-col gap-0.5
                ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-100 rounded-bl-none'}">
                <p class="leading-relaxed break-words">${msg.text}</p>
                <span class="text-[9px] self-end text-white/60">${msg.time}</span>
            </div>
        `;
        messagesContainer.appendChild(msgBubble);
    });
    // Автоскролл вниз к последнему сообщению
    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
}

// 4. Обработка отправки нового сообщения
messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Запрещаем перезагрузку страницы
    const text = messageInput.value.trim();

    if (!text || !activeChatId) return;

    const chat = chatsData.find(c => c.id === activeChatId);
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    // Добавляем новое сообщение в массив чата
    chat.messages.push({ id: 'm_' + Date.now(), text: text, sender: 'me', time: timeStr });
    messageInput.value = ''; // Очищаем поле ввода

    renderMessages(chat.messages); // Обновляем переписку
    renderChats(); // Обновляем сайдбар (чтобы изменился текст последнего сообщения)
}); // ИСПРАВЛЕНО: Закрыли функцию отправки здесь!

// 5. Кнопка "Назад" для мобильных устройств
backBtn.addEventListener('click', () => {
    sidebar.classList.remove('hidden');
    chatArea.classList.add('hidden');
    chatArea.classList.remove('flex');
    activeChatId = null;
    renderChats();
});

// ПЕРВИЧНЫЙ ЗАПУСК: Эта строчка обязательна, она наполняет список чатов!
renderChats();