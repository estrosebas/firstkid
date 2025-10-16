# Reporte de Librerías Relevantes para CNN

Este documento resume las librerías de Python más importantes para modelos de Redes Neuronales Convolucionales (CNN) utilizadas en los diferentes proyectos de este repositorio.

---

## 1. Proyecto: `rcp-model`

Este proyecto cuenta con un archivo `requirements.txt` que especifica las versiones exactas.

*   **Framework de Deep Learning:**
    *   `tensorflow`: 2.15.0
    *   `keras`: 2.15.0
    *   `torch`: 2.5.1+cu121
*   **Procesamiento de Imágenes y Datos:**
    *   `opencv-contrib-python`: 4.12.0.88
    *   `mediapipe`: 0.10.14
    *   `numpy`: 1.26.4
    *   `pandas`: 2.3.2
    *   `Pillow`: 11.3.0
*   **Utilerías de Machine Learning y Visualización:**
    *   `scikit-learn`: 1.7.2
    *   `matplotlib`: 3.10.6
    *   `h5py`: 3.14.0 (Para guardar y cargar modelos en formato HDF5)

---

## 2. Proyecto: `burn-skin-model`

No se encontró un archivo `requirements.txt`. El análisis del código fuente (`.py`) sugiere el uso de las siguientes librerías (versiones no especificadas):

*   **Framework de Deep Learning:**
    *   `tensorflow` / `keras` (Inferido por el uso de `tf.keras` y la manipulación de archivos `.h5` y `.keras`).
*   **Procesamiento de Imágenes y Aumentación de Datos:**
    *   `opencv-python` (Uso de `cv2`).
    *   `numpy`
    *   `Pillow` (Uso de `PIL`).
    *   `imgaug` (Para la aumentación de imágenes).

---

## 3. Proyecto: `nose-model`

No se encontró un archivo `requirements.txt`. El análisis del código fuente (`.py`) sugiere el uso de las siguientes librerías (versiones no especificadas):

*   **Framework de Deep Learning:**
    *   `tensorflow` / `keras` (Inferido por el uso de `tf.keras` y la manipulación de archivos `.h5`).
*   **Procesamiento de Imágenes y Aumentación de Datos:**
    *   `opencv-python` (Uso de `cv2`).
    *   `numpy`
    *   `Pillow` (Uso de `PIL`).
    *   `imgaug` (Para la aumentación de imágenes).
*   **Recolección de Datos (Scripts auxiliares):**
    *   `requests`
    *   `bing-image-downloader`

---
**Recomendación:** Para asegurar la reproducibilidad de los entornos, se recomienda crear archivos `requirements.txt` para los proyectos `burn-skin-model` y `nose-model` ejecutando `pip freeze > requirements.txt` en sus respectivos entornos virtuales.
