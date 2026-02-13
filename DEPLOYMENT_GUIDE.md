# Guía de Despliegue en la Nube - Calendapp

## 🚀 Arquitectura de Despliegue

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (Node.js + Express)
- **Base de Datos**: MongoDB Atlas (Cloud)

---

## 📋 Paso 1: MongoDB Atlas (Base de Datos)

### 1.1 Crear cuenta en MongoDB Atlas
1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Regístrate gratis (no necesitas tarjeta de crédito)
3. Crea un nuevo cluster (elige el tier GRATIS - M0)

### 1.2 Configurar acceso
1. **Database Access**: Crea un usuario de base de datos
   - Username: `calendapp_user`
   - Password: (guarda esta contraseña, la necesitarás)
   
2. **Network Access**: Permite acceso desde cualquier IP
   - Click en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)

### 1.3 Obtener connection string
1. Click en "Connect" en tu cluster
2. Selecciona "Connect your application"
3. Copia el connection string (se ve así):
   ```
   mongodb+srv://calendapp_user:<password>@cluster0.xxxxx.mongodb.net/calendapp?retryWrites=true&w=majority
   ```
4. Reemplaza `<password>` con tu contraseña real

---

## 🚂 Paso 2: Railway (Backend)

### 2.1 Preparar el repositorio
Tu código ya está en GitHub ✅

### 2.2 Desplegar en Railway
1. Ve a https://railway.app
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio: `germanberisso/calendapp`
6. Railway detectará automáticamente que es un proyecto Node.js

### 2.3 Configurar variables de entorno
En Railway, ve a tu proyecto → Variables:
```
MONGO_URI=tu_connection_string_de_mongodb_atlas
JWT_SECRET=una_clave_secreta_muy_segura_cambiala
PORT=5000
```

### 2.4 Configurar el directorio raíz
- En Settings → Root Directory: `server`
- Start Command: `npm start`

### 2.5 Obtener la URL del backend
Railway te dará una URL como: `https://calendapp-production.up.railway.app`
**Guarda esta URL**, la necesitarás para el frontend.

---

## ⚡ Paso 3: Vercel (Frontend)

### 3.1 Actualizar la configuración del frontend
Antes de desplegar, necesitas actualizar la URL del backend en el código.

### 3.2 Desplegar en Vercel
1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Click en "Add New Project"
4. Importa tu repositorio: `germanberisso/calendapp`
5. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Variables de entorno (si las necesitas)
En Vercel → Settings → Environment Variables:
```
VITE_API_URL=https://tu-backend-railway.up.railway.app
```

### 3.4 Deploy
Click en "Deploy" y espera unos minutos.

Vercel te dará una URL como: `https://calendapp.vercel.app`

---

## 🎯 Paso 4: Crear Usuario Admin en Producción

Una vez desplegado, necesitas crear el usuario admin:

### Opción A: Desde Railway CLI
```bash
railway run npm run seed
```

### Opción B: Desde MongoDB Atlas Compass
Conecta a tu base de datos y crea manualmente el usuario admin.

---

## ✅ Verificación Final

1. Abre tu URL de Vercel: `https://calendapp.vercel.app`
2. Deberías ver la página de login
3. Inicia sesión con `admin` / `admin123`
4. ¡Listo! Ahora cualquiera puede acceder desde internet

---

## 🔧 Solución de Problemas

### Error de CORS
Si ves errores de CORS, asegúrate que el backend tenga configurado:
```javascript
app.use(cors({
  origin: 'https://calendapp.vercel.app'
}));
```

### Error de conexión a MongoDB
Verifica que:
- La IP 0.0.0.0/0 esté permitida en Network Access
- El connection string sea correcto
- La contraseña no tenga caracteres especiales sin encodear

---

## 📝 Próximos Pasos

¿Necesitas ayuda con algún paso específico? Puedo:
- Ayudarte a configurar MongoDB Atlas
- Actualizar el código para producción
- Configurar dominios personalizados
