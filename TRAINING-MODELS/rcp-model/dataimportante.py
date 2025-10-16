import joblib

# Cargar scaler
scaler = joblib.load(r"C:\Users\estro\Desktop\rcp-model\trained\scaler.save")

# Ver los valores
print("mean:", scaler.mean_)
print("scale:", scaler.scale_)
