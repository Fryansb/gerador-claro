const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet'); // Proteção de cabeçalhos
const rateLimit = require('express-rate-limit'); // Proteção contra spam
const compression = require('compression'); // Deixa o site mais rápido
const gerarRoute = require('./routes/gerar');

const app = express();
// IMPORTANTE: Em produção (na nuvem), a porta é dada pelo servidor, não escolhemos 3000 fixo.
const PORT = process.env.PORT || 3000;

// 1. Segurança: Helmet (Protege contra vulnerabilidades conhecidas de HTTP)
app.use(helmet({
    contentSecurityPolicy: false, // Desativado pois usamos scripts locais/simples
}));

// 2. Performance: Compressão (Deixa o site mais leve)
app.use(compression());

// 3. Segurança: Rate Limiting (Evita ataques de negação de serviço/spam)
// Permite apenas 100 requisições a cada 15 minutos por IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Muitas tentativas vindas deste IP, tente novamente mais tarde."
});
app.use(limiter);

// 4. Configuração de CORS (Quem pode acessar seu site)
app.use(cors()); // Em produção real, você configuraria: { origin: 'https://seu-site.com' }

app.use(bodyParser.json());

// Servir arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/gerar', gerarRoute);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});