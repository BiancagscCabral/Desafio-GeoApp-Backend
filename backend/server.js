require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//configurações
app.use(cors());
// para aceitar img 
app.use(express.json({ limit: '50mb' }));


const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 Conectado ao MongoDB Atlas (SisManutenção)!'))
  .catch(err => console.error('Erro ao conectar no Mongo:', err));

// modelo de dados
const DefeitoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  local: String,       // Ex: Bancada 01
  laboratorio: String, // Ex: Lab Química
  foto: String,        // Foto em Base64
  data: { type: Date, default: Date.now }
});

const Defeito = mongoose.model('Defeito', DefeitoSchema);

//rotas


app.get('/', (req, res) => {
  res.send('Servidor SisManutenção Online! 🚒');
});

// cria
app.post('/api/defeitos', async (req, res) => {
  try {
    const novoDefeito = new Defeito(req.body);
    await novoDefeito.save();
    
    console.log(`[NOVO REGISTRO] ${req.body.titulo} - ${req.body.laboratorio}`);
    res.status(201).json(novoDefeito);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ error: error.message });
  }
});

// lista
app.get('/api/defeitos', async (req, res) => {
  try {
    
    const lista = await Defeito.find().sort({ data: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// iniciar servidor
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});