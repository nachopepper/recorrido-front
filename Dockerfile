# Usa la imagen oficial de Node.js como imagen base
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos al directorio que Nginx servirá
COPY --from=0 /app/dist /usr/share/nginx/html

# Exponer el puerto en el que Nginx estará escuchando
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
