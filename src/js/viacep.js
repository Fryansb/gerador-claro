const ViaCep = {
    consultar: async (cep) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            alert("CEP inválido");
            return null;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                alert("CEP não encontrado.");
                return null;
            }
            return data;
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            alert("Erro de conexão com ViaCEP.");
            return null;
        }
    }
};