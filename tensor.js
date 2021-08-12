    //Inicialização da variável URL
    var URL = "";
    
    //inicialização das variáveis utilizadas no código
    let modelo, webcam, labelContainer, maxPredictions;
    
    async function url_objetos(){
        URL = "https://teachablemachine.withgoogle.com/models/qgzYBZe2l/";
        inic_objetos();
    }
    async function url_cores(){
        URL = "https://teachablemachine.withgoogle.com/models/U3WXNbc6R/";
        inic_objetos();
    }

    // Carrega o modelo de imagem, configurar e ligar o vídeo a partir da webcam
    async function inic_objetos() {
        //Carrega o modelo e os metadados
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Refere o modelo e os metadados na API para carregar os arquivos no caminho especificado
        modelo = await tmImage.load(modelURL, metadataURL);
        // Obtem a quantidade de classes existentes nos dados treinados
        maxPredictions = modelo.getTotalClasses();

        // Configurar e ligar a webcam
        const flip = true; // Virar a imagem da camera
        webcam = new tmImage.Webcam(370, 370, flip); // Largura, altura e rotação
        await webcam.setup(); // Solicitar acesso a webcam
        await webcam.play(); // Inicializar a webcam após ter acesso concedido
        window.requestAnimationFrame(loop);
        document.getElementById('btn-ident-obj').style.display='none';
        document.getElementById('btn-ident-cor').style.display='none';

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    // Loop para sempre verificar a imagem da camera e reproduzir o código de predict de qual objeto está sendo identificado
    async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    // Identificar em qual categoria dos dados treinados a imagem se encaixa melhor
    async function predict() {
        const prediction = await modelo.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            if(prediction[i].probability > 0.80) { // Probabilidade necessária para imprimir na tela a categoria em que o objeto se encaixa
                const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
            else {
                labelContainer.childNodes[i].innerHTML = "";
            }
        }
    }





    