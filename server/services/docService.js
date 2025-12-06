const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

// Caminho para o template
const CAMINHO_LOCAL = path.resolve(__dirname, '../templates/DECDEEND.docx');

const gerarDocumento = (dados) => {
    let content;
    try {
        content = fs.readFileSync(CAMINHO_LOCAL, 'binary');
    } catch (error) {
        throw new Error(`Erro: Arquivo não encontrado em ${CAMINHO_LOCAL}`);
    }

    const zip = new PizZip(content);

    let doc;
    try {
        doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            // AQUI ESTÁ O SEGREDO: Usamos colchetes para o Word não dar erro
            delimiters: { start: '[[', end: ']]' }
        });
    } catch (error) {
        // Se der erro, mostra no terminal o motivo exato
        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (err) {
                return err.properties.explanation;
            }).join("\n");
            console.log('ERRO DO WORD:', errorMessages);
            throw new Error(`Erro no Template: ${errorMessages}`);
        }
        throw error;
    }

    // Mapeamento dos dados (Note que as chaves da esquerda continuam iguais)
    doc.render({
        NOME: dados.nome,
        RG: dados.rg,
        CPF: dados.cpf,
        CEP: dados.cep,
        LOGRADOURO: dados.logradouro,
        NUMERO: dados.numero,
        COMPLEMENTO: dados.complemento || "",
        BAIRRO: dados.bairro,
        CIDADE_UF: dados.cidade_uf,
        DATA: dados.data,
        ENDERECO: `${dados.logradouro}, ${dados.numero} ${dados.complemento || ''}`
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    return buf;
};

module.exports = { gerarDocumento };