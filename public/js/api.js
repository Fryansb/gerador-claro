const Api = {
    gerarDocumento: async (dados) => {
        try {
            const response = await fetch('/gerar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) throw new Error('Erro ao gerar documento');

            // Recebe o Blob (arquivo binário)
            const blob = await response.blob();
            
            // Cria link temporário para download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Declaracao_${dados.nome.replace(/\s+/g, '_')}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            return true;
        } catch (error) {
            console.error(error);
            alert("Erro ao processar documento no servidor.");
            return false;
        }
    }
};