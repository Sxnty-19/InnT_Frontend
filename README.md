# InnTech - Plataforma Hotelera (Frontend)

Frontend de la plataforma hotelera InnTech, construido con Angular 21 y TypeScript. Esta aplicación gestiona la interfaz de usuario principal para el hotel, incluyendo acceso administrativo y funciones de cliente.

## 🚀 Descripción

La aplicación frontend ofrece:
- Autenticación de usuario (login / register)
- Panel administrativo para:
  - check-in y check-out
  - administración de habitaciones
  - gestión de reservas
  - administración de roles y usuarios
  - gestión de solicitudes y documentos
  - estadísticas hoteleras
- Módulos de cliente para:
  - consultar información del hotel
  - reservar habitaciones
  - ver reservas
  - solicitar servicios
  - consultar habitaciones disponibles
- Manejo de rutas basado en Angular Router
- Conexión con un backend REST mediante HttpClient

## 📁 Estructura principal

- `src/app/app.ts` - componente raíz de la aplicación
- `src/app/app.routes.ts` - definición de rutas y páginas
- `src/app/app.config.ts` - configuración de la aplicación, router e HttpClient
- `src/app/pages/` - páginas principales de la aplicación
- `src/app/components/` - componentes reutilizables como navbar y footer
- `src/app/services/` - servicios para llamadas al backend
- `src/app/config/api.config.ts` - configuración de URL de API
- `public/` - activos estáticos públicos

## 🧭 Rutas disponibles

- `/` - Inicio
- `/login` - Login
- `/register` - Registro
- `/perfil` - Perfil de usuario
- `/principal` - Panel principal
- `/a-check-in` - Check-in administrativo
- `/a-check-out` - Check-out administrativo
- `/a-documentos` - Documentos administrativos
- `/a-estadisticas` - Estadísticas
- `/a-habitaciones` - Gestión de habitaciones
- `/a-reservas` - Gestión de reservas
- `/a-roles` - Gestión de roles
- `/a-solicitudes` - Gestión de solicitudes
- `/a-usuarios` - Gestión de usuarios
- `/c-informaciont` - Información del hotel
- `/c-reservar` - Reservar habitación
- `/c-reservas-h` - Reservas de cliente
- `/c-solicitar` - Solicitar servicio
- `/l-habitaciones` - Lista de habitaciones
- `**` - Página no encontrada

## ⚙️ Dependencias principales

- Angular 21
- `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/router`
- `rxjs`
- `typescript`
- `vitest` para pruebas unitarias

## 🛠️ Scripts útiles

- `npm install` - instala dependencias
- `npm start` - ejecuta la aplicación en modo desarrollo
- `npm run build` - genera la aplicación para producción
- `npm run watch` - compila en modo watch
- `npm test` - ejecuta pruebas

## 🔌 Configuración del backend

La URL del backend está definida en:

- `src/app/config/api.config.ts`

## 💡 Notas

- El proyecto usa componentes standalone de Angular.
- El frontend se sirve desde `src/main.ts` y `src/index.html`.
- Los activos están disponibles en `public/`.
