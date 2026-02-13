# 🚀 Cómo Iniciar Calendapp

## Requisitos Previos
- ✅ MongoDB instalado y corriendo en tu máquina
- ✅ Node.js instalado

## Paso 1: Verificar MongoDB
Asegúrate de que MongoDB esté corriendo:
```bash
# En una terminal, ejecuta:
mongod
```
Deja esta terminal abierta.

## Paso 2: Crear Usuario Administrador
En una **nueva terminal**, ve a la carpeta del servidor:
```bash
cd server
npm run seed
```
Esto creará un usuario admin con:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## Paso 3: Iniciar el Backend
En la misma terminal (o una nueva):
```bash
cd server
npm start
```
Deberías ver: `Server running on port 5000` y `MongoDB Connected`

## Paso 4: Iniciar el Frontend
En una **nueva terminal**:
```bash
cd client
npm run dev
```
Verás algo como: `Local: http://localhost:5173`

## Paso 5: Probar la Aplicación
1. Abre tu navegador en `http://localhost:5173`
2. Haz clic en "Login"
3. Ingresa:
   - Usuario: `admin`
   - Contraseña: `admin123`
4. ¡Listo! Deberías ver el calendario

## Funcionalidades para Probar

### Como Admin:
- ✅ Haz clic en cualquier día del calendario
- ✅ Verás botones para asignar turnos (M, N, F, Hol)
- ✅ Asigna diferentes turnos y observa los colores
- ✅ Agrega tareas con prioridad Alta o Baja
- ✅ Ve a "Manage Users" para aprobar nuevos usuarios

### Crear Usuarios Normales:
- ✅ Cierra sesión (Logout)
- ✅ Haz clic en "Register here"
- ✅ Crea un usuario nuevo
- ✅ Verás mensaje: "Please wait for admin approval"
- ✅ Vuelve a iniciar sesión como admin
- ✅ Ve a "Manage Users" y aprueba el usuario
- ✅ Ahora el nuevo usuario puede iniciar sesión

## Solución de Problemas

### Error: "MongoDB Connection Failed"
- Verifica que MongoDB esté corriendo (`mongod`)
- Revisa que el puerto sea 27017 (puerto por defecto)

### Error: "Port 5000 already in use"
- Cambia el puerto en `server/.env`: `PORT=5001`

### No aparece nada en el navegador
- Verifica que ambos servidores estén corriendo
- Revisa la consola del navegador (F12) para errores
