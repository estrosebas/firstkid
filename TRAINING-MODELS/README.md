# Proyecto RCP / Modelos de visión por computadora

## Resumen breve

Este repositorio contiene varios experimentos y modelos de visión por computadora desarrollados con TensorFlow para tareas relacionadas con detección/ clasificación sobre imágenes (ej.: detección de nariz sangrando / epistaxis, clasificación de piel quemada, y modelos basados en keypoints/pose). El proyecto está desordenado — hay scripts experimentales, notebooks y artefactos — pero en esencia hay tres líneas de trabajo:

- 1. Modelo basado en keypoints / MediaPipe (detección/pose)
- 2. Modelos CNN entrenados desde cero o con MobileNetV2 (clasificación binaria: p.ej. "nariz_sangre" vs "nariz_sana", "quemadas" vs "sanas")
- 3. Transfer learning / export a TFJS (modelos preparados para web con conversión a TFJS)

## Estructura principal

- `nose-model/` - scripts y dataset local para detección/clasificación de nariz (ej.: `trainmodel.py`, `trainmodel.py` entrena un MobileNetV2 para clasificación binaria)
- `burn-skin-model/` - experimentos para clasificación de piel quemada (scripts: `trainmode2web.py`, `testmodel.py`, `augmentationsburn.py`, modelos guardados `.h5`)
- `collect_nose_images.py`, `download_images.py`, `image_urls.txt` - scripts para recolectar imágenes desde Google Images y descargar thumbnails/URLs listadas
- `tfjs-env/` - (posible entorno o artefactos relacionados con TFJS)
- `venv-cpr/` - un virtualenv incluido (no es necesario usarlo si prefieres crear el tuyo)

## Archivos clave y propósito (rápido)

- `nose-model/trainmodel.py` — Script de entrenamiento (MobileNetV2, congelado) para clasificar `nariz_sangre` vs `nariz_sana`. Carga imágenes desde `nose-model/nariz_sangre` y `nose-model/nariz_sana`, realiza split, aplica data augmentation (capas de Keras) y entrena. Guarda modelo en `burn_class_model_tfjs.h5`.
- `burn-skin-model/trainmode2web.py` — Entrenamiento similar para datos de piel quemada; guarda `.h5` listo para convertir a TFJS.
- `burn-skin-model/augmentationsburn.py` — Script que genera imágenes aumentadas usando `ImageDataGenerator`.
- `burn-skin-model/testmodel.py` — Script para cargar un modelo entrenado y evaluar predicciones sobre algunas imágenes de prueba.
- `collect_nose_images.py` — Plantilla de script que complementa la extracción de URLs (pensado para usarse con Playwright para extraer `imgurl` originales de Google Images).
- `download_images.py` — Lee `image_urls.txt` y descarga imágenes a `nose-model/`.

## Dependencias

Recomendado crear un virtualenv nuevo y usar `pip` para instalar las librerías. Un `requirements.txt` no está disponible en la raíz; los paquetes utilizados por los scripts incluyen al menos:

- python >= 3.8
- tensorflow
- opencv-python (cv2)
- numpy
- scikit-learn
- requests (para descargar imágenes)
- Pillow (opcional, para manipular imágenes)

## Comandos básicos (PowerShell)

Crear virtualenv e instalar dependencias (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install tensorflow opencv-python numpy scikit-learn requests pillow
```

Entrenar el modelo de nariz (ejemplo):

```powershell
python .\nose-model\trainmodel.py
```

## Recolectar imágenes (flujo recomendado)

1. Usar Playwright o manualmente buscar en Google Images y extraer URLs reales (no sólo thumbnails) — `collect_nose_images.py` es una plantilla para el paso de descarga.
2. Guardar las URLs en `image_urls.txt` (una por línea).
3. Ejecutar `download_images.py` para descargar las imágenes a `nose-model/`.

## Buenas prácticas y próximos pasos recomendados

- Reorganizar el repo: crear carpetas `datasets/`, `models/`, `src/`, `notebooks/`.
- Añadir un `requirements.txt` en la raíz con versiones fijas para reproducibilidad.
- Mejorar el extractor para capturar `imgurl` (original) en lugar de proxies `encrypted-tbn0...` y aumentar la cantidad de imágenes con paginación.
- Añadir scripts de preprocesado: deduplicación, filtrado por tamaño/resolución, etiquetado y split (train/val/test).
- Añadir instrucciones claras para exportar a TFJS (usar `tensorflowjs_converter` o `model.save` y `tensorflowjs_converter --input_format=keras`) y vincular con `convert_to_tfjs.py` si se desea.

## Licencia y notas

No se ha incluido una licencia en la raíz — si piensas publicar o compartir, considera añadir una (MIT o similar) y confirma que las imágenes recolectadas respetan derechos de autor.

## Contacto

Si quieres puedo:

- Limpiar la estructura del repo moviendo scripts y creando `requirements.txt`.
- Implementar extractor mejorado que capture `imgurl` y haga paginación automática.
- Añadir preprocesado y un script reproducible para entrenar y exportar cada modelo.

---

Generado automáticamente a partir del contenido del repositorio por una revisión rápida.
