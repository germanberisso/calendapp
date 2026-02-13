# Calendapp - Guía de Instalación Local

Esta guía te permitirá instalar y ejecutar Calendapp en tu computadora local.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **Git**
   - Descarga desde: https://git-scm.com/
   - Verifica la instalación: `git --version`

3. **Cuenta MongoDB Atlas** (base de datos en la nube - GRATIS)
   - Crea una cuenta en: https://www.mongodb.com/cloud/atlas/register

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/germanberisso/calendapp.git
cd calendapp
```

### 2. Configurar MongoDB Atlas

1. Ve a https://cloud.mongodb.com/
2. Inicia sesión con tu cuenta
3. Crea un nuevo cluster (opción gratuita M0)
4. En "Database Access":
   - Click "Add New Database User"
   - Crea un usuario con contraseña
   - Guarda el usuario y contraseña
5. En "Network Access":
   - Click "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
6. En "Database":
   - Click "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia la connection string (URI)
   - Reemplaza `<password>` con tu contraseña

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `server`:

```bash
cd server
```

Crea el archivo `.env` con este contenido:

```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/calendapp?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_super_seguro_aqui_cambialo
PORT=5000
```

**IMPORTANTE:** Reemplaza:
- `usuario:contraseña` con tus credenciales de MongoDB
- `cluster` con el nombre de tu cluster
- `tu_secreto_super_seguro_aqui_cambialo` con una cadena aleatoria

### 4. Instalar Dependencias

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 5. Iniciar la Aplicación

Necesitas **DOS terminales** abiertas:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

Deberías ver:
```
Server running on port 5000
MongoDB Connected
✅ Patterns routes registered
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Deberías ver:
```
VITE v5.4.21  ready in 317 ms
➜  Local:   http://localhost:5173/
```

### 6. Acceder a la Aplicación

Abre tu navegador y ve a: **http://localhost:5173**

## 👤 Primer Uso

### Crear Cuenta de Administrador

1. En la página de login, click en "Registrarse"
2. Crea tu usuario (ej: "admin")
3. Ingresa una contraseña
4. Click "Registrarse"
5. Inicia sesión con tus credenciales

### Crear Patrones Personalizados

1. Ve a: http://localhost:5173/patterns
2. Click "Nuevo Patrón"
3. Completa:
   - **Nombre**: ej. "Patrón 4x4"
   - **Segmentos**: 
     - Mañana (M): 2 días
     - Noche (N): 2 días
     - Franco (F): 4 días
4. Vista previa mostrará: `2M-2N-4F`
5. Click "Guardar"

### Aplicar Patrón a Turnos

1. Ve al Dashboard
2. Click "Auto-completar Turnos"
3. Selecciona tu patrón del dropdown
4. Elige fechas de inicio y fin
5. Click "Aplicar Patrón Automático"

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución:**
- Verifica que tu IP esté permitida en MongoDB Atlas (Network Access)
- Confirma que el `MONGO_URI` en `.env` sea correcto
- Asegúrate de haber reemplazado `<password>` con tu contraseña real

### Error: "Port 5000 already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <numero_del_proceso>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Error: "Module not found"

**Solución:**
```bash
# Reinstalar dependencias
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

## 📱 Funcionalidades Disponibles

✅ **Gestión de Turnos**
- Crear turnos: Mañana (M), Noche (N), Franco (F), Feriado (Fe)
- Editar y eliminar turnos
- Vista de calendario

✅ **Patrones Personalizables**
- Crear patrones ilimitados
- Editar y eliminar patrones
- Establecer patrón por defecto
- Auto-completar turnos con patrones

✅ **Tareas Colaborativas**
- Crear tareas compartidas
- Asignar responsables
- Marcar como completadas

✅ **PWA (Progressive Web App)**
- Instalar como app en escritorio
- Funciona offline (limitado)

## 🔐 Seguridad

- Cambia el `JWT_SECRET` en `.env` por algo único
- No compartas tu archivo `.env`
- Usa contraseñas seguras para MongoDB
- El archivo `.env` está en `.gitignore` (no se sube a GitHub)

## 🎉 ¡Listo!

Ahora tienes Calendapp funcionando localmente con todas las funcionalidades.

**Disfruta usando Calendapp!** 🚀
