// Função para enviar a mensagem do usuário
async function sendMessage() {
  const userInputElement = document.getElementById('user-input');
  const userInput = userInputElement.value;

  if (userInput.trim() === '') {
    return; // não envia mensagens vazias
  }

  // Adiciona a mensagem do usuário com o rótulo "Você"
  addMessage('Você', userInput, 'user');

  // Limpa o campo de texto
  userInputElement.value = '';

  try {
    const response = await fetch('/send-msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();

    // Adiciona a resposta do bot com o rótulo "BOT"
    addMessage('BOT', data.reply, 'bot');

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    addMessage('BOT', 'Erro ao conectar com o servidor.', 'bot');
  }
}

// Função para adicionar mensagens no chat
function addMessage(senderLabelText, messageText, senderClass) {
  const chatBox = document.getElementById('chat-box');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', senderClass);

  // Cria e insere o rótulo do remetente (Você ou BOT)
  const senderLabel = document.createElement('span');
  senderLabel.classList.add('sender-label');
  senderLabel.textContent = senderLabelText;

  // Cria a mensagem propriamente dita
  const messageContent = document.createElement('div');
  messageContent.textContent = messageText;

  messageDiv.appendChild(senderLabel);
  messageDiv.appendChild(messageContent);

  chatBox.appendChild(messageDiv);

  // Scroll automático para a última mensagem
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Ativa o botão Enter para enviar a mensagem
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
