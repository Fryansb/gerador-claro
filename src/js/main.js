document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const btnBuscarCep = document.getElementById('btnBuscarCep');
    const form = document.getElementById('declarationForm');

    // Botão de busca de CEP
    btnBuscarCep.addEventListener('click', async () => {
        const cep = cepInput.value;
        const endereco = await ViaCep.consultar(cep);
        
        if (endereco) {
            document.getElementById('logradouro').value = endereco.logradouro;
            document.getElementById('bairro').value = endereco.bairro;
            document.getElementById('cidade_uf').value = `${endereco.localidade}/${endereco.uf}`;
            document.getElementById('numero').focus();
        }
    });

    // Submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        // Pequena validação
        if(!dados.nome || !dados.rg || !dados.cpf) {
            alert("Preencha os campos obrigatórios");
            return;
        }

        const sucesso = await Api.gerarDocumento(dados);
        if(sucesso) {
            alert("Documento gerado com sucesso! Verifique seus downloads.");
        }
    });
});