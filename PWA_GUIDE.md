# 📱 Calendapp - Ahora es una PWA!

## ✅ ¿Qué es una PWA?

Una **Progressive Web App** es una aplicación web que funciona como una app nativa en tu celular:
- 📲 Se instala en la pantalla de inicio
- 🚀 Abre en pantalla completa (sin barra del navegador)
- 📴 **Funciona offline** - Puedes ver el calendario sin internet
- 🔄 Sincroniza cambios cuando vuelves a estar online

---

## 📥 Cómo Instalar en tu Celular

### **Android (Chrome/Edge)**

1. Abre la app en el navegador: `http://192.168.0.31:5173` (o tu URL de producción)
2. Toca el menú (⋮) → **"Agregar a pantalla de inicio"** o **"Instalar app"**
3. Confirma la instalación
4. ¡Listo! El ícono aparecerá en tu pantalla de inicio

### **iPhone/iPad (Safari)**

1. Abre la app en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Confirma
5. ¡Listo! La app está instalada

---

## 🌐 Modo Offline

### **¿Cómo funciona?**

✅ **Sin internet puedes:**
- Abrir la aplicación
- Ver el calendario completo
- Ver turnos y tareas guardadas
- Navegar entre meses

❌ **Sin internet NO puedes:**
- Crear nuevos turnos o tareas
- Editar información existente
- Ver cambios hechos por otros usuarios

### **Sincronización Automática**

Cuando recuperes la conexión:
- 🔄 Los datos se actualizan automáticamente
- ⚠️ Verás un banner amarillo cuando estés offline
- ✅ El banner desaparece cuando vuelvas online

---

## 🎨 Iconos de la App

**NOTA:** Los iconos aún no están creados. Necesitas:

1. **icon-192.png** (192x192 píxeles)
2. **icon-512.png** (512x512 píxeles)

Puedes crearlos con:
- **Canva** (gratis): https://www.canva.com
- **Figma** (gratis): https://www.figma.com
- Cualquier editor de imágenes

**Diseño sugerido:**
- Fondo azul (#2563eb)
- Ícono de calendario blanco
- Diseño simple y minimalista

Guárdalos en: `client/public/icon-192.png` y `client/public/icon-512.png`

---

## 🧪 Probar el Modo Offline

1. Instala la app en tu celular
2. Abre la app
3. Activa el **modo avión** en tu celular
4. La app seguirá funcionando
5. Verás un banner amarillo: "⚠️ Sin conexión - Modo offline"
6. Desactiva el modo avión
7. El banner desaparece y los datos se sincronizan

---

## 🚀 Para Producción

Cuando despliegues en Vercel/Render:
- La PWA funcionará automáticamente
- Los usuarios podrán instalarla desde cualquier lugar
- El modo offline funcionará globalmente

---

## 📊 Ventajas de la PWA

✅ **No ocupa espacio** - Se guarda en caché del navegador
✅ **Actualizaciones automáticas** - Sin ir a la tienda
✅ **Funciona en Android e iOS** - Una sola app para todos
✅ **Modo offline** - Trabaja sin internet
✅ **Rápida** - Carga instantánea después de la primera vez

---

## ❓ Preguntas Frecuentes

**¿Necesito publicarla en Google Play o App Store?**
No. Los usuarios la instalan directamente desde el navegador.

**¿Funciona en todos los celulares?**
Sí, en Android e iOS modernos (2018+).

**¿Los datos se guardan en el celular?**
Sí, en caché. Pero la fuente de verdad sigue siendo el servidor.

**¿Puedo desinstalarla?**
Sí, como cualquier app: mantén presionado el ícono → Desinstalar.

---

¡Tu Calendapp ahora es una PWA completa! 🎉
