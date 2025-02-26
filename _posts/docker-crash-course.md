---
title: "Docker: Rapido y Furioso"
excerpt: "Si Docker fuera una película, sería esa escena donde presionas el botón de NOS y te mueves a 300 km/hr. 🚀 Ajusta el cinturón, porque este crash course va directo al grano para que containerices tu código como un verdadero Toretto."
coverImage: "/assets/blog/docker-crash-course/cover.jpg"
date: "2025-02-20T17:28:57.211Z"
author:
  name: "Adrian Castillo"
  picture: "/assets/blog/authors/adrian.jpeg"
ogImage:
  url: "/assets/blog/docker-crash-course/cover.jpg"
preview: false
---


## TL;DR
Docker te permite empaquetar aplicaciones en contenedores ligeros que pueden ejecutarse en cualquier sistema sin preocuparte por dependencias. Con Docker Compose, puedes definir múltiples servicios (como una API y su base de datos) en un solo archivo `docker-compose.yml`. Este blogpost es una referencia rápida para recordarme cómo usar Docker de manera efectiva sin perder tiempo buscando documentación.


## 🐳 Introducción rápida a Docker

### 🏗 Containerización vs Virtualización
La containerización no es lo mismo que la virtualización. Mientras que una **máquina virtual (VM)** necesita un sistema operativo completo, un **contenedor** comparte el mismo kernel del host, haciendo que sea más liviano y rápido. Básicamente, las VMs son como casas independientes, mientras que los contenedores son departamentos en el mismo edificio, compartiendo algunos recursos pero aislados entre sí.

### 🔑 Docker: La Magia de la Containerización
Imagina que estás desarrollando una aplicación con dependencias específicas. Configurar el entorno correcto en cada máquina puede ser un dolor de cabeza. Aquí es donde **Docker** brilla, empaquetando todo en **contenedores** que aseguran que tu aplicación se ejecute de manera idéntica en cualquier lugar.

### 🔗 Complemento con **notdefined-workbench**
Si quieres ejemplos listos para levantar y probar diferentes tecnologías con Docker, revisa el repositorio [notdefined-workbench](https://github.com/rodacato/notdefined-workbench). Ahí encontrarás configuraciones listas con `docker-compose.yml` para múltiples stacks.

### 🔑 Problemas que Docker resuelve

¿Aún sigues confundido? Hagamos esto más práctico. ¿Has pasado por alguno de estos problemas?

- **"En mi máquina funciona, pero en producción no"** → Docker encapsula todo, asegurando consistencia en cualquier entorno.
- **"Actualizar dependencias rompe otros servicios"** → Cada contenedor tiene su propio entorno, sin interferencias, y puedes probar versiones antes de actualizar.
- **"Dificultad para compartir y mantener entornos de desarrollo"** → Con solo compartir un `Dockerfile` o `docker-compose.yml`, cualquier equipo puede replicar tu entorno.
- **"Cada vez que agregan un nuevo servicio, tengo que reconfigurar mi máquina"** → Docker Compose gestiona múltiples contenedores fácilmente, manteniendo todo sincronizado.

La clave de Docker es la **containerización**, empaquetando tu aplicación y todas sus dependencias en un contenedor. Esto garantiza que la aplicación se ejecute de manera consistente en cualquier máquina con Docker instalado.

No confundir con la **virtualización**, que crea múltiples entornos virtuales en una sola máquina física. Docker no virtualiza un SO, sino que usa el mismo kernel del sistema host para crear contenedores ligeros.

## 🔑 Conceptos clave en Docker

- **Imagen**: Plantilla con código, librerías y configuraciones necesarias para crear un contenedor.
- **Contenedor**: Instancia en ejecución de una imagen. Son aislados y predecibles.
- **Docker Engine**: Servicio que gestiona la ejecución de contenedores.
- **Docker Hub**: Registro público de imágenes de Docker.
- **Dockerfile**: Archivo con instrucciones para construir una imagen Docker.
- **Volumen**: Almacén de datos persistente para evitar pérdida de información al eliminar contenedores.
- **Red**: Permite la comunicación entre contenedores y con el host.


## 🏗 Instalación de Docker (Mac/Linux)
Para instalar Docker en Linux o macOS, simplemente ejecuta:
```sh
curl -fsSL https://get.docker.com | bash
```
Para verificar que Docker se instaló correctamente:
```sh
docker --version

# Tambien puedes correr el hello-world
docker run hello-world
```

Ejemplo rápido para correr un contenedor de **PostgreSQL**:
```sh
docker run --name postgres -e POSTGRES_PASSWORD=secret -d postgres
```
Para ver los contenedores en ejecución:
```sh
docker ps
```

### 🎉 ¡Felicidades, tu primer contenedor está corriendo! ¿Ahora qué?

Puedes conectarte a PostgreSQL dentro del contenedor, ver logs o persistir los datos usando volúmenes.

Para conectarte desde la terminal:
```sh
docker exec -it postgres psql -U postgres
```

Para ver logs:
```sh
docker logs postgres
```

Para evitar perder datos cuando detengas el contenedor:
```sh
docker stop postgres

docker rm postgres

docker run --name postgres -e POSTGRES_PASSWORD=secret -v pg_data:/var/lib/postgresql/data -d postgres
```

Si quieres conectarte con un cliente como `psql` desde tu máquina:
```sh
docker run --name postgres -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
```
Luego puedes acceder con:
```sh
psql -h localhost -U postgres
```

## 📌 Ejemplo Completo

¿Quieres ensuciarte las manos aún más? Ahora hagamos un ejemplo más completo: vamos a crear una API en Node.js.

Este será nuestro proyecto:

```
mi-app/
├── app/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
```

### `index.js`
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Docker!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### `package.json`
```json
{
  "name": "app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

### `Dockerfile`
```dockerfile
# Usa la imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto 3000 para la API
EXPOSE 3000

# Comando de inicio
CMD ["node", "index.js"]
```

### 🔹  Construcción y Ejecución del Contenedor
Para comenzar, primero tenemos que generar la imagen. Para ello, ejecutamos los siguientes comandos desde el directorio `app` (sin `docker-compose` por ahora):
```sh
docker build -t mi-app .
docker run -p 3000:3000 mi-app
```

Ahora puedes visitar `http://localhost:3000` para ver el servidor en funcionamiento. Para detener el contenedor:
```sh
docker stop <CONTAINER_ID>
```

### 🔹 Usando `docker-compose`

Ahora probemos usando `docker-compose`. Vamos a crear el archivo `docker-compose.yml` fuera del directorio `app`, así:

```
mi-app/
├── docker-compose.yml
├── app/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
```

### `docker-compose.yml`
```yaml
services:
  app:
    build: ./app
    container_name: node_app
    ports:
      - "3000:3000"
    networks:
      - backend
    volumes:
      - ./app:/usr/src/app

networks:
  backend:

volumes:
  pg_data:
```

Ahora podemos iniciar todo con un solo comando mucho más fácil de recordar:
```sh
docker-compose up
```

Muy bonito, pero nada impresionante... Bueno, veamos una configuración más avanzada con base de datos y caché:

```yaml
services:
  db:
    image: postgres
    container_name: postgres_db
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "user"]
      interval: 10s
      retries: 5
      timeout: 5s

  redis:
    image: redis:latest
    container_name: redis_cache
    networks:
      - backend

  app:
    build: ./app
    container_name: node_app
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://user:password@db:5432/mydatabase
    ports:
      - "3000:3000"
    networks:
      - backend
    volumes:
      - ./app:/usr/src/app

networks:
  backend:

volumes:
  pg_data:
```

Después de unos segundos de magia:
```sh
docker-compose up
```

¡Voilà! Ahora tenemos tres contenedores corriendo y comunicándose entre sí (`docker ps`):

```
CONTAINER ID   IMAGE          COMMAND
4c82eb429297   mi-app-app     "docker-entrypoint.s…"
9a37acac283f   postgres       "docker-entrypoint.s…"
7b0c27402fb5   redis:latest   "docker-entrypoint.s…"
```

Empiezas a ver los beneficios, ¿verdad? ¡Estupendo! Ahora imagina tus proyectos corriendo con un solo comando. Alucinante. No olvides detener `docker-compose`, y si quieres jugar con los archivos, puedes obtenerlos desde el repositorio `notdefined-benchmark`.



## 📦 Volúmenes en Docker

Los volúmenes en Docker permiten persistir datos más allá del ciclo de vida de un contenedor. Algunas cosas clave que debes saber:

- **Persistencia de bases de datos:** Evita que los datos se borren al eliminar un contenedor.
- **Compartición de datos entre contenedores:** Dos o más contenedores pueden acceder a un mismo volumen.
- **Optimización del rendimiento:** Los volúmenes son más eficientes que los bind mounts.

Ejemplo de creación de un volumen y asignación a PostgreSQL:
```sh
docker run --name postgres -e POSTGRES_PASSWORD=secret -v pg_data:/var/lib/postgresql/data -d postgres
```

Para listar volúmenes:
```sh
docker volume ls
```

Para eliminar volúmenes no usados:
```sh
docker volume prune
```

## 🌐 Redes en Docker

Docker permite la comunicación entre contenedores a través de redes personalizadas.

Ejemplo de creación de una red y conexión de contenedores:
```sh
docker network create mi_red

docker run -d --name db --network=mi_red -e POSTGRES_PASSWORD=secret postgres

docker run -it --rm --network=mi_red alpine sh
```

Dentro del contenedor Alpine, puedes probar la conexión:
```sh
apk add --no-cache postgresql-client
psql -h db -U postgres
```

## 📉 Optimización de Imágenes en Docker

La optimización de imágenes en Docker es clave para reducir su tamaño, mejorar la seguridad y acelerar despliegues. Aplicamos múltiples estrategias para mejorar nuestras imágenes, pero alcanzamos un punto donde ya no había mejoras en tamaño. Esto indica que hemos eliminado lo innecesario y tenemos una imagen eficiente.

Hay varias estrategias esta lista es algunas de ellas:

- **Cambio a versiones alpine como `node:18-alpine`** para reducir el tamaño base.
- **Uso de multi-stage builds** para copiar solo lo esencial a la imagen final (ejemplo no node_modules).
- **Eliminación de dependencias innecesarias** con `npm install --only=production`.
- **Minimización de capas en el `Dockerfile`**.
- **Uso de `.dockerignore`** para evitar archivos innecesarios en la imagen final.


Después de aplicar estas optimizaciones, construimos diferentes versiones y verificamos su tamaño con:
```sh
docker images | grep mi-app
```

Por ejemplo este `Dockerfile` optimizado:

```dockerfile
# Etapa 1: Builder
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa 2: Producción
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/index.js ./
EXPOSE 3000
CMD ["node", "index.js"]
```

Nos da estos resultados:
```
mi-app-original    latest    abc123456789   5 minutes ago   500MB
mi-app-opt         latest    def987654321   3 minutes ago   150MB
```

## 📡 Logs & Monitoring en Docker

Porque ir a ciegas no es divertido, aquí tienes algunos comandos útiles para ver qué está pasando antes de quedarte pelón como Toretto.


### 🔹 Ver logs de contenedores en tiempo real
```sh
docker logs -f nombre_del_contenedor
```
Esto es útil para monitorear la API en vivo sin necesidad de entrar al contenedor.

### 🔹 Monitoreo de recursos en vivo
```sh
docker stats
```
Muestra el consumo de CPU, memoria y red de los contenedores en ejecución.

### 🔹 Acceder a un contenedor en ejecución
```sh
docker exec -it nombre_del_contenedor sh
```
Si tiene `bash`, puedes usar:
```sh
docker exec -it nombre_del_contenedor bash
```

### 🔹 Detectar contenedores fallidos
Si un contenedor se apaga inesperadamente:
```sh
docker ps -a
```
Si el código de salida es `1`, revisa los logs:
```sh
docker logs nombre_del_contenedor
```

### 🔹 Configurar logs en `docker-compose.yml`
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```
Esto evita que los logs ocupen demasiado espacio.

### 🔹 Ver logs de todos los servicios en `docker-compose`
```sh
docker-compose logs -f
```
Facilita la depuración cuando hay múltiples servicios.

## 🛠 Debugging en Docker

Mientras usemos Docker, no todo va a salir como esperamos. Para esos casos, hay que saber cómo depurar. Aquí tengo unos tips para cuando ese momento llegue, y llegará.

### 🔹 Ver contenedores en ejecución
```sh
docker ps -a
```

### 🔹 Revisar logs de un contenedor
```sh
docker logs nombre_del_contenedor
```

### 🔹 Acceder a un contenedor en ejecución
```sh
docker exec -it nombre_del_contenedor sh
```

### 🔹 Reconstruir imágenes desde cero
```sh
docker-compose build --no-cache
```

### 🔹 Ver códigos de salida
Si un contenedor sale inmediatamente después de ejecutarse, revisa su código de salida:
```sh
docker ps -a
```

Si el estado es `Exited (0)`, significa que el proceso terminó correctamente, pero no tenía un proceso en segundo plano para mantenerlo vivo.

### 🔹 Limpiar Docker de imágenes y contenedores no usados
```sh
docker system prune -a -f
```

## 🔥 Limpiar el entorno de Docker

A medida que usas Docker, los contenedores, imágenes, volúmenes y redes pueden acumularse y ocupar espacio innecesario. Aquí te dejo algunos comandos esenciales para limpiar tu entorno de Docker.

### 🔹 Detener y eliminar contenedores
Para detener todos los contenedores en ejecución:
```sh
docker stop $(docker ps -q)
```
Para eliminar todos los contenedores detenidos:
```sh
docker rm $(docker ps -aq)
```

### 🔹 Eliminar imágenes innecesarias
Para eliminar imágenes que ya no están en uso:
```sh
docker image prune -a
```
Si necesitas eliminar una imagen específica:
```sh
docker rmi nombre_imagen
```

### 🔹 Limpiar volúmenes sin uso
Para eliminar volúmenes que no están en uso:
```sh
docker volume prune
```
Si quieres eliminar un volumen específico:
```sh
docker volume rm nombre_volumen
```

### 🔹 Eliminar redes no utilizadas
Si tienes redes creadas que ya no usas:
```sh
docker network prune
```
Para eliminar una red específica:
```sh
docker network rm nombre_red
```

### 🔹 Limpiar todo el sistema Docker
Si quieres hacer una limpieza completa de contenedores, imágenes, volúmenes y redes no utilizadas, usa:
```sh
docker system prune -a
```
**Advertencia:** Esto eliminará **todo lo que no esté en uso por un contenedor en ejecución**.


## 🔥 Comandos esenciales de Docker

| Comando | Descripción |
|---------|------------|
| `docker build -t <image_name> .` | Construye una imagen a partir de un Dockerfile |
| `docker run -p <host_port>:<container_port> <image_name>` | Ejecuta un contenedor basado en una imagen |
| `docker ps` | Lista los contenedores en ejecución |
| `docker ps -a` | Lista todos los contenedores, incluidos los detenidos |
| `docker images` | Muestra las imágenes descargadas |
| `docker logs <container>` | Muestra los logs de un contenedor |
| `docker stop <container>` | Detiene un contenedor en ejecución |
| `docker rm <container>` | Elimina un contenedor detenido |
| `docker rm $(docker ps -aq)` | Elimina todos los contenedores detenidos |
| `docker rmi <image>` | Elimina una imagen específica |
| `docker image prune -a` | Elimina todas las imágenes sin uso |
| `docker volume ls` | Lista los volúmenes existentes |
| `docker volume prune` | Elimina los volúmenes sin uso |
| `docker network ls` | Lista las redes de Docker |
| `docker network prune` | Elimina las redes sin uso |
| `docker system prune -a` | Limpia imágenes, contenedores, volúmenes y redes innecesarias |
| `docker-compose up -d` | Levanta los servicios en segundo plano |
| `docker-compose down` | Apaga y elimina los servicios definidos en `docker-compose.yml` |
| `docker-compose logs <service>` | Muestra los logs de un servicio en Docker Compose |
| `docker-compose build` | Construye las imágenes especificadas en el archivo `docker-compose.yml` |
| `docker-compose ps` | Lista los servicios en ejecución en Docker Compose |
| `docker-compose restart <service>` | Reinicia un servicio de Docker Compose |

Con esta lista de comandos esenciales, puedes administrar y limpiar tu entorno Docker de manera eficiente.


Como podras haberte dado cuenta ya, Docker y Docker Compose facilitan la creación de entornos replicables y evitan problemas de dependencias, eliminando muchos problemas de configuracion, basta con levantar tus contenedores para estar listo para programar.

