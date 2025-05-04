const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const path = require('path');

// Aponte para a chave do projeto correto
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'key', 'key-eternal.json');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const sessionId = uuid.v4();

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Função que envia a query para o Dialogflow
async function runDialogflowQuery(text) {
  const sessionClient = new dialogflow.SessionsClient({
    projectId: 'eternal-dynamo-457802-d4',          // <-- ID corrigido
    keyFilename: path.join(__dirname, 'key', 'key-eternal.json'),
  });

  // Gera o path da sessão (Dialogflow ES)
  const sessionPath = sessionClient.projectAgentSessionPath(
    'eternal-dynamo-457802-d4',                     // <-- ID corrigido
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'pt-BR',
      },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  return response.queryResult.fulfillmentText;
}

// Endpoint que recebe mensagens do front-end
app.post('/send-msg', async (req, res) => {
  try {
    const reply = await runDialogflowQuery(req.body.message);
    res.json({ reply });
  } catch (error) {
    console.error('Erro ao se comunicar com o Dialogflow:', error);
    res.status(500).json({ reply: 'Erro ao se comunicar com o Dialogflow.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
