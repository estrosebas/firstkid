import tensorflow as tf

# Carga tu modelo .keras
model = tf.keras.models.load_model("burn_class_model.keras")

# Guardalo como HDF5
model.save("burn_class_model_temp.h5")
