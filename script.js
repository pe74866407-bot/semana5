// ==========================================
// CLASIFICADOR DE CELULARES Y TABLETS
// ==========================================


// ==========================================
// RUTAS DEL MODELO
// ==========================================

// Estos son los archivos de TU modelo
const MODEL_URL = "./model.json";
const METADATA_URL = "./metadata.json";


// Variable donde se guardará el modelo
let model = null;


// ==========================================
// ELEMENTOS DE LA PÁGINA
// ==========================================

const imageInput = document.getElementById("imageInput");

const selectButton = document.getElementById("selectButton");

const analyzeButton = document.getElementById("analyzeButton");

const previewImage = document.getElementById("previewImage");

const placeholder = document.getElementById("placeholder");

const status = document.getElementById("status");

const predicted = document.getElementById("predicted");

const resultsList = document.getElementById("resultsList");


// ==========================================
// CARGAR EL MODELO
// ==========================================

async function cargarModelo() {

    try {

        status.textContent =
            "⏳ Cargando modelo de inteligencia artificial...";


        // Cargar el modelo de Teachable Machine
        model = await tmImage.load(
            MODEL_URL,
            METADATA_URL
        );


        // El modelo terminó de cargar
        status.textContent =
            "✅ Modelo cargado correctamente. Puedes seleccionar una imagen.";


        // Activamos el botón Analizar
        analyzeButton.disabled = false;


        console.log("Modelo cargado correctamente.");

    } catch (error) {

        console.error(
            "Error al cargar el modelo:",
            error
        );

        status.textContent =
            "❌ No se pudo cargar el modelo. Revisa los archivos.";

    }
}


// ==========================================
// BOTÓN SELECCIONAR IMAGEN
// ==========================================

selectButton.addEventListener(
    "click",
    function () {

        // Abrir explorador de archivos
        imageInput.click();

    }
);


// ==========================================
// SELECCIONAR IMAGEN
// ==========================================

imageInput.addEventListener(
    "change",
    function (event) {

        const archivo = event.target.files[0];


        // Si no seleccionó ningún archivo
        if (!archivo) {
            return;
        }


        // Crear una URL temporal para mostrar la imagen
        const imagenURL =
            URL.createObjectURL(archivo);


        // Colocar imagen en la vista previa
        previewImage.src = imagenURL;

        previewImage.style.display = "block";


        // Ocultar mensaje inicial
        placeholder.style.display = "none";


        // Limpiar resultados anteriores
        predicted.textContent =
            "Imagen lista para analizar";


        resultsList.innerHTML =
            '<p class="sin-resultados">Presiona "Analizar imagen".</p>';

    }
);


// ==========================================
// BOTÓN ANALIZAR IMAGEN
// ==========================================

analyzeButton.addEventListener(
    "click",
    async function () {


        // Comprobar que el modelo esté cargado
        if (!model) {

            status.textContent =
                "⏳ El modelo todavía se está cargando.";

            return;
        }


        // Comprobar que haya una imagen
        if (
            !previewImage.src ||
            previewImage.style.display === "none"
        ) {

            status.textContent =
                "⚠️ Primero selecciona una imagen.";

            return;
        }


        try {

            status.textContent =
                "🔍 Analizando imagen...";


            // Realizar predicción
            const predictions =
                await model.predict(
                    previewImage,
                    false
                );


            // Ordenar resultados
            // El resultado con mayor porcentaje queda primero
            predictions.sort(
                function (a, b) {

                    return b.probability -
                           a.probability;

                }
            );


            // ==========================================
            // MOSTRAR CLASE RECONOCIDA
            // ==========================================

            const mejorResultado =
                predictions[0];


            predicted.textContent =
                mejorResultado.className;


            // ==========================================
            // MOSTRAR PORCENTAJES
            // ==========================================

            resultsList.innerHTML = "";


            predictions.forEach(
                function (resultado) {

                    // Convertir decimal a porcentaje
                    const porcentaje =
                        resultado.probability * 100;


                    // Crear elemento del resultado
                    const item =
                        document.createElement("div");

                    item.className =
                        "result-item";


                    // Crear encabezado
                    const header =
                        document.createElement("div");

                    header.className =
                        "result-header";


                    // Nombre de la clase
                    const nombre =
                        document.createElement("span");

                    nombre.className =
                        "class-name";

                    nombre.textContent =
                        resultado.className;


                    // Porcentaje
                    const porcentajeTexto =
                        document.createElement("span");

                    porcentajeTexto.className =
                        "score";

                    porcentajeTexto.textContent =
                        porcentaje.toFixed(1) + "%";


                    // Colocar nombre y porcentaje
                    header.appendChild(nombre);

                    header.appendChild(
                        porcentajeTexto
                    );


                    // ==================================
                    // CREAR BARRA
                    // ==================================

                    const bar =
                        document.createElement("div");

                    bar.className = "bar";


                    const fill =
                        document.createElement("div");

                    fill.className = "bar-fill";

                    fill.style.width =
                        porcentaje + "%";


                    bar.appendChild(fill);


                    // Agregar elementos al resultado
                    item.appendChild(header);

                    item.appendChild(bar);

                    resultsList.appendChild(item);

                }
            );


            status.textContent =
                "✅ Análisis terminado correctamente.";


        } catch (error) {

            console.error(
                "Error durante la predicción:",
                error
            );

            status.textContent =
                "❌ Ocurrió un error al analizar la imagen.";

        }

    }
);


// ==========================================
// INICIAR EL PROGRAMA
// ==========================================

cargarModelo();