# Contexto y Reglas de Negocio - Hawaiian Paradise Andamar

## 1. Información del Negocio
- **Nombre:** Hawaiian Paradise Andamar
- **Ubicación:** Kiosco en pasillo de Plaza Andamar, frente a Café Don Justo.
- **Tipo de Negocio:** Franquicia de Hawaiian Paradise con adición de productos propios (híbrido).

## 2. Productos y Restricciones
- **Productos Franquicia:** Raspados, Aguas Frescas, Smoothies, Cafés de Franquicia.
  - *Regla estricta:* Los envases desechables, popotes, vasos y materia prima base (jarabes, polvos) DEBEN ser exclusivamente comprados a la franquicia.
- **Productos Propios:** Café de selección propia, Crepas (con branding en envoltorio triangular), Esquites (receta propia), Ramen instantáneo (Maruchan con esquite/preparados) y Marquesitas.
  - *Regla:* Los insumos libres (leche, queso, jamón, elote, mayonesa, etc.) se compran libremente en mercados o tiendas como Costco, Walmart, Chedraui, etc.

## 3. Especificaciones Técnicas del Software
- **Entorno:** App de Escritorio Windows (compatible con Win 7, 10, 11) corriendo en PC All-in-One táctil.
- **Tecnologías:** React + Vite + CSS (Vanilla) + Electron.js + Dexie.js (IndexedDB local) + Firebase Firestore sync.
- **Principios de Diseño UI/UX:**
  - 100% Optimizado para pantalla táctil (botones grandes, zonas táctiles cómodas, sin requerir mouse fino).
  - Estética vibrante, hawayana, moderna (colores tropicales, oscuros/claros elegantes, contraste alto para rápido cobro).
  - Cobro rápido en menos de 3 toques.
  - Operabilidad **Offline-first** (todo se guarda en local y se sincroniza a la nube en segundo plano).

## 4. Roles y Permisos
- **Cajero:** Realiza ventas, aplica modificadores, hace corte ciego de caja, consulta base de conocimiento.
- **Gerente/Admin:** Cancelaciones, ajustes de inventario, consulta de utilidades y ventas en tiempo real, gestión de empleados y documentos.

## 5. Reglas de Entorno y Desarrollo
- **Ruta Oficial del Proyecto:** `C:\PROYECTOS ANTIGRAVITY\HAWAIIAN PARADISE`
- **Gestor de Paquetes Exclusivo:** `pnpm` (`pnpm install`, `pnpm add`, `pnpm run ...`).
- **Manejo de `node_modules`:** Reside de forma nativa e individual en `.\node_modules` en la raíz del proyecto.
- **Prohibiciones de Entorno:**
  - No usar `C:\NODE_BUFFERS` ni enlaces simbólicos (symlinks) a carpetas externas o Google Drive.
  - No incluir directiva `modules-dir` en `.npmrc`.
  - Siempre ejecutar `git add .`, `git commit` y `git push` tras completar cambios.
