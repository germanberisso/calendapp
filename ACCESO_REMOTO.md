# Guía de Acceso Remoto - Calendapp

## 🌐 Opción 1: Red Local (LAN) - CONFIGURADO ✅

### Para que otros accedan desde la misma red WiFi:

**1. Tu IP local:**
Ejecuta en tu terminal:
```bash
ipconfig
```
Busca la línea "Dirección IPv4" (ejemplo: `192.168.1.100`)

**2. Comparte esta URL con tus compañeros:**
```
http://TU_IP:5173
```
Ejemplo: `http://192.168.1.100:5173`

**3. Asegúrate que:**
- ✅ Ambos servidores estén corriendo (backend y frontend)
- ✅ Estén en la misma red WiFi
- ✅ El firewall de Windows permita las conexiones (puede pedir permiso la primera vez)

---

## 🌍 Opción 2: Acceso desde Internet (Despliegue)

Para que cualquiera acceda desde cualquier lugar, necesitas desplegar la aplicación:

### A. **Vercel (Frontend) + MongoDB Atlas (Base de datos)** - GRATIS
- Frontend: Vercel
- Backend: Vercel Serverless Functions o Railway
- Base de datos: MongoDB Atlas (gratis hasta 512MB)

### B. **Railway** - Fácil y gratis para empezar
- Todo en un solo lugar
- Conecta tu repositorio de GitHub
- Deploy automático

### C. **Render** - Alternativa gratuita
- Similar a Railway
- Tier gratuito disponible

---

## 📝 Próximos Pasos Recomendados

**Para desarrollo/pruebas locales:**
→ Usa la Opción 1 (Red Local) ✅ Ya configurado

**Para producción/uso real:**
→ Despliega en Vercel + Railway (te puedo ayudar con esto)

¿Quieres que te ayude a configurar el despliegue en la nube?
