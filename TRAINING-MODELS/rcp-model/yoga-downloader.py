import os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# Carpeta donde están los .txt
dataset_dir = r"C:\Users\estro\Desktop\rcp-model\dataset_yoga"
# Carpeta donde guardaremos las imágenes NO-RCP
output_dir = r"C:\Users\estro\Desktop\rcp-model\NO-RCP"
os.makedirs(output_dir, exist_ok=True)

# Número de imágenes a tomar de cada archivo
num_images = 20
# Número de hilos
num_threads = 8

def download_image(args):
    local_path, url = args
    img_name = os.path.basename(local_path)
    save_path = os.path.join(output_dir, img_name)
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            with open(save_path, "wb") as img_file:
                img_file.write(resp.content)
            return f"✅ Descargada: {img_name}"
        else:
            return f"❌ Error {resp.status_code}: {url}"
    except Exception as e:
        return f"❌ No se pudo descargar {url}: {e}"

# Recolectamos todas las imágenes a descargar
tasks = []
for txt_file in os.listdir(dataset_dir):
    if txt_file.endswith(".txt"):
        txt_path = os.path.join(dataset_dir, txt_file)
        with open(txt_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for line in lines[:num_images]:
            parts = line.strip().split("\t")
            if len(parts) < 2:
                continue
            tasks.append((parts[0], parts[1]))

# Descargar en paralelo
with ThreadPoolExecutor(max_workers=num_threads) as executor:
    futures = [executor.submit(download_image, task) for task in tasks]
    for future in as_completed(futures):
        print(future.result())

print("✅ Descarga completada")
