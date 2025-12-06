const express = require('express');
const router = express.Router();
const docService = require('../services/docService');

router.post('/', (req, res) => {
    try {
        const dados = req.body;
        console.log("Recebendo dados para geração:", dados.nome);

        const buffer = docService.gerarDocumento(dados);

        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename=declaracao.docx',
            'Content-Length': buffer.length
        });
        res.end(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar o documento.' });
    }
});

module.exports = router;