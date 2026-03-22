# 🏀 EQUIPO BASKET — Producto 1 (Angular Frontend)

Aplicación desarrollada con **Angular** para la gestión y visualización de un equipo de baloncesto.  
El proyecto implementa una SPA (Single Page Application) con componentes independientes que se comunican entre sí.

---

## 🚀 Cómo ejecutar el proyecto

Este proyecto está preparado para ejecutarse en **CodeSandbox**.

### ⚠️ IMPORTANTE
Para que funcione correctamente:

1. Debes hacer un **fork del proyecto** en CodeSandbox  
2. Una vez hecho el fork, el entorno iniciará automáticamente  
3. Abre el navegador en:


http://localhost:4200


Ahí podrás ver la aplicación funcionando.

---

## 🧩 Estructura de la aplicación

La aplicación está basada en arquitectura de componentes de Angular:

- **PlayersComponent**
  - Muestra el listado de jugadores
  - Incluye búsqueda y filtrado

- **DetailComponent**
  - Muestra la información detallada del jugador seleccionado

- **MediaComponent**
  - Reproductor de vídeo del jugador
  - Controles personalizados: play, pause, stop, progreso y volumen

---

## 🔄 Comunicación entre componentes

- `PlayersComponent` → emite el jugador seleccionado
- `AppComponent` → gestiona el estado global
- `DetailComponent` y `MediaComponent` → reciben el jugador mediante `@Input`

---

## 🔍 Funcionalidades principales

- ✔ Listado dinámico con `*ngFor`
- ✔ Condicionales con `*ngIf`
- ✔ Selección de jugador con feedback visual
- ✔ Comunicación entre componentes (EventEmitter + Input)
- ✔ Reproductor multimedia con control manual
- ✔ Barra de progreso sincronizada
- ✔ Control de volumen
- ✔ Pipe de filtrado con:
  - búsqueda por nombre/equipo
  - filtro por posición

---

## 📁 Estructura de datos

Los datos se encuentran en un archivo separado, simulando una fuente de datos local:


/data/players.ts


Esto permite desacoplar la lógica de los componentes.

---

## 🎬 Recursos multimedia

Los vídeos y recursos visuales se almacenan en:


/assets/


---

## 📐 Documentación adicional

Dentro del proyecto se incluye una carpeta:


/doc/


Que contiene:

- 📊 Diagrama UML (MVC)
- 📌 Estructura conceptual de la aplicación

---

## 🛠️ Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap (para estilos base)

---

## 🎯 Objetivo del proyecto

Aplicar los conceptos fundamentales de Angular:

- Componentes
- Binding
- Comunicación entre componentes
- Pipes
- Organización del código

---

## 👨‍💻 Autor

Leonardo Cuevas  
FP.067 — Desarrollo Front-End con frameworks

---