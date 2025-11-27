require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- CONFIGURAÇÕES ---
app.use(cors());
// Aumentamos o limite para 50mb para garantir que as fotos do celular passem
app.use(express.json({ limit: '50mb' }));

// --- CONEXÃO COM O MONGODB ATLAS ---
// ATENÇÃO: Substitui <password> pela tua senha real do Atlas e o nome do banco (ex: sisManutencaoDB)
const MONGO_URI = "mongodb+srv://biancagsccabral_db_user:RxTKkrZ69XzEHGlT@cluster0.4ar8aan.mongodb.net/sisManutencaoDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 Conectado ao MongoDB Atlas (SisManutenção)!'))
  .catch(err => console.error('Erro ao conectar no Mongo:', err));

// --- MODELO DE DADOS (O que vamos salvar) ---
const DefeitoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  local: String,       // Ex: Bancada 01
  laboratorio: String, // Ex: Lab Química
  foto: String,        // Foto em Base64
  data: { type: Date, default: Date.now }
});

const Defeito = mongoose.model('Defeito', DefeitoSchema);

// --- ROTAS ---

// Rota de Teste (Para ver se o servidor está de pé)
app.get('/', (req, res) => {
  res.send('Servidor SisManutenção Online! 🚒');
});

// 1. SALVAR um novo defeito (POST)
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

// 2. LISTAR todos os defeitos (GET)
app.get('/api/defeitos', async (req, res) => {
  try {
    // Busca tudo e ordena do mais recente para o mais antigo
    const lista = await Defeito.find().sort({ data: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- INICIAR SERVIDOR ---
// O IP 0.0.0.0 ajuda a tornar o servidor visível na rede local
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});