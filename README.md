# backend
API RESTfull unihorizonte

# Comandos Docker

# Crear una imagen
docker build -t unihorizonte-restapi .

# Listar imagenes creadas
docker images

# Ejecutar de manera interactiva
docker run -it -p 7000:6000 unihorizonte-restapi # Se define el puerto de entrada y el puerto de salida

# Ejecuar como un proceso
docker run -d -p 7000:6000 unihorizonte-restapi # Se define el puerto de entrada y el puerto de salida

# Procesos en ejecución
docker ps

# Parar procesos
docker stop id del proceso en ejecución

# Visualizar procesos ejecutados
deocker ps -a






