import tensorflowjs as tfjs
import tensorflow as tf

# Cargar el modelo .h5
model = tf.keras.models.load_model(r"C:\Users\estro\Desktop\rcp-model\trained\rcp_keypoints_model.h5")

# Exportar a formato TensorFlow.js
tfjs.converters.save_keras_model(model, r"C:\Users\estro\Desktop\rcp-model\trained\tfjs_model")
