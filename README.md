# FirstKid

Aplicación híbrida (React + Vite + TypeScript) para entrenamiento y despliegue de modelos de visión computacional orientados a primeros auxilios. La interfaz corre en web y puede empaquetarse como aplicación móvil mediante Capacitor. El proyecto contiene código de entrenamiento en Python, conversiones a TensorFlow.js y la integración cliente que ejecuta la inferencia en el dispositivo del usuario.

Contenido principal

- `src/` - Código frontend (React + TypeScript). Componentes y páginas principales incluyen el detector de técnicas (`src/pages/Technique.tsx`) y las páginas de `Home`, `Login` y `About`.
- `public/tfjs_model-rcp/`, `public/tfjs_model-skin/`, `public/tfjs_model-nose/` - Modelos convertidos a TensorFlow.js listos para inferencia en el navegador.
- `TRAINING-MODELS/` - Scripts y datasets para entrenamiento en Python (modelos RCP, burn/skin y nose). Contiene scripts como `extractor.py`, `modeltrainer.py`, `trainmodel.py` y utilidades de augmentación y conversión.

Resumen de los modelos de IA

- RCP (detección de técnica de reanimación cardiopulmonar)

  - Framework: TensorFlow/Keras para entrenamiento; MediaPipe para extracción de landmarks; TensorFlow.js para inferencia web.
  - Lenguaje: Python para entrenamiento y exportación; TypeScript/JavaScript para inferencia en la app.
  - Arquitectura: MLP (Multilayer Perceptron) que opera sobre keypoints extraídos por MediaPipe Pose (33 landmarks). Los valores de media y escala calculados en entrenamiento se usan en producción para normalizar entradas.
  - Dataset: Imágenes etiquetadas con RCP correcto y no-RCP (incluye imágenes de yoga como ejemplos negativos). Preprocesamiento por extracción de keypoints y normalización.

- Detección de quemaduras en piel

  - Framework: TensorFlow/Keras; exportado a TensorFlow.js.
  - Arquitectura: CNN (transfer learning con MobileNetV2) para clasificación binaria (quemada vs sana).
  - Dataset: Imágenes de piel con lesiones/quemaduras y piel sana obtenidas de repositorios públicos y colecciones propias. Se aplicó data augmentation.

- Detección de sangrado nasal
  - Framework: TensorFlow/Keras; exportado a TensorFlow.js.
  - Arquitectura: CNN para clasificación binaria.
  - Dataset: Imágenes recolectadas manualmente (nariz sana vs nariz con sangrado). Se aplicó data augmentation.

Flujo de procesamiento (inferencia en la app)

1. Al abrir la vista de técnica la aplicación carga de forma asíncrona el modelo TF.js correspondiente desde `public/tfjs_model-*/model.json`.
2. Se accede a la cámara del dispositivo mediante la API de navegador y se inicializa MediaPipe (para RCP) o se prepara el pipeline de preprocesamiento (canvas + `tf.browser.fromPixels`) para clasificación de imagen.
3. La detección se realiza en ciclos periódicos (muestreo cada ~1 segundo) para equilibrar latencia y consumo de CPU/GPU en dispositivos móviles.
4. Para RCP se extraen 33 keypoints con MediaPipe Pose, se normalizan usando media/scale guardados y se pasa el vector normalizado al MLP que devuelve una probabilidad de corrección.
5. Para piel y nariz las imágenes se redimensionan a 224x224 y se normalizan antes de la inferencia en la CNN.
6. La app dibuja un overlay (esqueleto) y muestra retroalimentación visual y textual, incluyendo niveles de confianza y recomendaciones básicas.

Evaluación, limitaciones y rendimiento

- Precisión: Dependiente de la calidad del dataset y condiciones de captura. En condiciones controladas (buena iluminación y cámara estable) la precisión es adecuada; sin embargo, se observan degradaciones ante poca luz, oclusiones parciales y ángulos de cámara extremos.
- Latencia: El muestreo por segundo proporciona una experiencia interactiva con latencias de inferencia en el orden de cientos de milisegundos en dispositivos modernos; la ejecución local con TensorFlow.js evita round-trips a servidor.
- Consideraciones ambientales: Se recomienda buena iluminación, cámara estable y visibilidad de las partes corporales relevantes. El selector de cámara en la UI permite alternar entre cámaras para mejorar detección.

Infraestructura y requisitos

- Hardware para inferencia (dispositivo de usuario): smartphone moderno con GPU integrada (por ejemplo Snapdragon 660+/Apple A10+), mínimo 3-4 GB RAM y cámara de 5-8 MP para calidad adecuada.
- Hardware para desarrollo/entrenamiento: equipo con GPU (NVIDIA recomendada) y 16 GB RAM o más para entrenar modelos CNN de forma eficiente.
- Software y librerías: Python 3.8+, TensorFlow/Keras para entrenamiento, TensorFlow.js para inferencia web, MediaPipe para extracción de keypoints, OpenCV, NumPy, scikit-learn para preprocesamiento. Frontend con React + TypeScript y Capacitor para empaquetado móvil.

Estructura del sistema

- Entrenamiento: se realiza con scripts Python localmente (archivos en `TRAINING-MODELS`). Los resultados se guardan en formatos `.h5` o `.keras`.
- Conversión: los modelos se convierten a TensorFlow.js mediante utilidades de conversión (scripts presentes en cada subcarpeta de `TRAINING-MODELS`) y se colocan en `public/tfjs_model-*`.
- Inferencia: ejecutada en el cliente (browser o app híbrida) usando TensorFlow.js y MediaPipe; no se requiere backend para inferencia.
- Almacenamiento: la app puede guardar resultados en `localStorage` de forma local; integrar Firebase u otra BD es opcional para sincronización y analytics.

Cómo ejecutar el proyecto localmente (Windows PowerShell)

```powershell
cd c:\Users\estro\Desktop\firstkid
npm install
npm run dev
```

Conversión rápida de modelos TensorFlow a TensorFlow.js (ejemplo)

1. Desde el entorno Python donde tienes TensorFlow instalado, guarda o carga tu modelo en formato SavedModel o .h5.
2. Instala la herramienta de conversión: `pip install tensorflowjs`.
3. Ejecuta la conversión (ejemplo para un archivo Keras `.h5`):

```powershell
python -m tensorflowjs_converter --input_format=keras "ruta\\al\\modelo.h5" "ruta\\de\\salida\\tfjs_model-xxx"
```

Notas finales y mantenimiento

- Las rutas públicas `public/tfjs_model-rcp`, `public/tfjs_model-skin` y `public/tfjs_model-nose` deben contener `model.json` y los shards `.bin` para que la app cargue los modelos correctamente.
- Si deseas, puedo eliminar assets no usados (imágenes de técnicas no implementadas) y añadir un pequeño script que verifique la presencia de `model.json` en `public/tfjs_model-*` durante el arranque.

Contacto

Si necesitas que genere comandos precisos de conversión, verifique los modelos cargados o realice pruebas locales de rendimiento en un dispositivo concreto, indícalo y lo preparo.
