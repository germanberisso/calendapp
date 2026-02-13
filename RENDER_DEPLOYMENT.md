# 🚀 Despliegue con Render (Alternativa Simple)

## ¿Por qué Render?
- ✅ Más fácil que Railway
- ✅ Tier gratuito generoso
- ✅ No requiere tarjeta de crédito
- ✅ Deploy automático desde GitHub

---

## 📋 PASO 1: MongoDB Atlas (10 min)

### 1. Crear cuenta
- Ve a: https://www.mongodb.com/cloud/atlas/register
- Regístrate gratis (email + contraseña)

### 2. Crear Cluster
- Click "Create" (botón verde)
- Selecciona **M0 FREE**
- Región: Elige la más cercana (ej: São Paulo)
- Click "Create Cluster"

### 3. Configurar Usuario
- Sidebar → "Database Access"
- Click "Add New Database User"
- Username: `calendapp_user`
- Password: (crea una segura y **guárdala**)
- Database User Privileges: "Read and write to any database"
- Click "Add User"

### 4. Permitir Acceso desde Internet
- Sidebar → "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Obtener Connection String
- Sidebar → "Database" → Click "Connect" en tu cluster
- Selecciona "Drivers"
- Copia el string (se ve así):
```
mongodb+srv://calendapp_user:<password>@cluster0.xxxxx.mongodb.net/calendapp?retryWrites=true&w=majority
```
- **Reemplaza `<password>` con tu contraseña real**
- **Guarda este string completo**

---

## 🎨 PASO 2: Render - Backend (15 min)

### 1. Crear cuenta
- Ve a: https://render.com
- Click "Get Started for Free"
- Inicia sesión con GitHub

### 2. Crear Web Service
- Dashboard → "New +" → "Web Service"
- Conecta tu repositorio: `germanberisso/calendapp`
- Click "Connect"

### 3. Configurar el servicio
```
Name: calendapp-backend
Region: Oregon (US West)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 4. Seleccionar Plan
- Scroll down → Selecciona **Free** (0$/mes)

### 5. Variables de Entorno
Antes de hacer deploy, click en "Advanced" y agrega:

```
MONGO_URI = tu_connection_string_completo_de_mongodb_atlas
JWT_SECRET = clave_super_secreta_cambiala_ahora_123
PORT = 10000
FRONTEND_URL = https://calendapp.onrender.com
```

### 6. Deploy
- Click "Create Web Service"
- Espera 5-10 minutos (primera vez tarda más)
- Cuando termine, verás "Live" en verde
- **Copia tu URL** (ej: `https://calendapp-backend.onrender.com`)

---

## ⚡ PASO 3: Render - Frontend (10 min)

### 1. Crear Static Site
- Dashboard → "New +" → "Static Site"
- Conecta el mismo repositorio: `germanberisso/calendapp`

### 2. Configurar
```
Name: calendapp
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

### 3. Variables de Entorno
Click "Advanced" y agrega:
```
VITE_API_URL = https://TU-URL-BACKEND.onrender.com
```
(Usa la URL que copiaste en el paso anterior)

### 4. Deploy
- Click "Create Static Site"
- Espera 3-5 minutos
- Tu app estará en: `https://calendapp.onrender.com`

---

## 👤 PASO 4: Crear Usuario Admin

### Opción A: Desde Render Dashboard
1. Ve a tu backend service en Render
2. Click en "Shell" (terminal)
3. Ejecuta: `npm run seed`

### Opción B: Desde MongoDB Atlas
1. Ve a "Browse Collections"
2. Database: `calendapp` → Collection: `users`
3. Click "Insert Document"
4. Pega esto (cambia la contraseña hasheada):
```json
{
  "username": "admin",
  "password": "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  "role": "admin",
  "status": "active"
}
```
(Esta contraseña hasheada corresponde a "admin123")

---

## 🎉 ¡Listo!

Abre: `https://calendapp.onrender.com`

**Login:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## ⚠️ Nota Importante

El tier gratuito de Render:
- ✅ Funciona perfectamente
- ⏰ Se "duerme" después de 15 min sin uso
- 🐌 Primera carga después de dormir tarda ~30 seg
- 💰 Upgrade a $7/mes para que esté siempre activo

---

## ❓ ¿Problemas?

Avísame en qué paso estás y te ayudo.
