document.addEventListener("DOMContentLoaded", function() {
    const seed = localStorage.getItem("seed");
    const versao = localStorage.getItem("versao");
    const tamanho = localStorage.getItem("tamanho");

    document.getElementById("seed").value =seed
    document.getElementById("versao").value =versao
    document.getElementById("tamanho").value =tamanho

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          let url = tabs[0].url;
          document.getElementById("servico").value = extractMainDomain(url);
        }
      });

    const botao = document.getElementById("button");
    botao.addEventListener("click", function() {
        gerarESexibirSenha()
    });
});
 

 function gerarESexibirSenha() {
            const seed = document.getElementById("seed").value;
            const versao = document.getElementById("versao").value;
            const servico = document.getElementById("servico").value;
            const tamanho = document.getElementById("tamanho").value;

            localStorage.setItem("seed", seed);
            localStorage.setItem("versao", versao);
            localStorage.setItem("tamanho", tamanho);


            try {
                const senhaGerada = gerarSenha(seed, versao, servico, tamanho);
                document.getElementById("senha").value = senhaGerada;
            } catch (error) {
                alert(error.message);
            }
        }

        function gerarSenha(seed, versao, servico, tamanho) {
            if (tamanho < 4) {
                throw new Error("O tamanho da senha deve ser pelo menos 4 para garantir todos os tipos de caracteres.");
            }
			var concatbase = parseInt(seed) + parseInt(versao)
            const base = `${servico.toLowerCase()}-${concatbase}`;
			
            const hashDigest = CryptoJS.SHA256(base).toString(CryptoJS.enc.Hex); // Usando crypto-js
			//const hashDigest = "85c085ed1dd9510dedc87ac79a50b83237fc0738a876f67deb9cbacf68fd1100"
            const maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const minusculas = "abcdefghijklmnopqrstuvwxyz";
            const numeros = "0123456789";
            const especiais = "!@";
            const caracteresDisponiveis = maiusculas + minusculas + numeros + especiais;

            const maiuscula = maiusculas[parseInt(hashDigest.substring(0, 2), 16) % maiusculas.length];
            const minuscula = minusculas[parseInt(hashDigest.substring(2, 4), 16) % minusculas.length];
            const numero = numeros[parseInt(hashDigest.substring(4, 6), 16) % numeros.length];
            const especial = especiais[parseInt(hashDigest.substring(6, 8), 16) % especiais.length];

            let restantes = [];
            for (let i = 8; i < 8 + (tamanho - 4) * 2; i += 2) {
                restantes.push(caracteresDisponiveis[parseInt(hashDigest.substring(i, i + 2), 16) % caracteresDisponiveis.length]);
            }

            return maiuscula + minuscula + numero + especial + restantes.join('').substring(0, tamanho - 4);
        }


        function extractMainDomain(url) {
            try {
                // Cria um objeto URL para processar a URL
                const parsedUrl = new URL(url);
                
                // Remove o protocolo (http:// ou https://)
                let domain = parsedUrl.hostname;
                
                // Remove 'www.' se existir
                domain = domain.replace(/^www\./, '');
                
                // Separa o domínio pelos pontos
                const parts = domain.split('.');
                
                // Retorna o primeiro segmento (domínio principal)
                return parts[0];
            } catch (error) {
                // Caso a URL seja inválida
                return null;
            }
        }