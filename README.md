# TaskBoard (Vue 3 + Firebase + Vercel)

Aplicación web tipo “tablón de tareas” para una empresa.  
Primero te registras / inicias sesión y **solo si el email está verificado** puedes entrar a la parte privada.  
Dentro hay dos vistas:

- **/** → tablón con todas las tareas (vienen de una API).
- **/workspace** → tu área de trabajo con las tareas que te has asignado.

> Proyecto realizado con **Vue 3 (Composition API)**, **Firebase Authentication + Firestore**, **axios** y **Vue Router**. Desplegado en **Vercel**.

---

## Vercel

https://task-board-app-vue.vercel.app/

---

## Funcionalidades principales

### Autenticación (Firebase Auth)
- Registro con **email y contraseña**.
- Al registrarse se envía **correo de verificación** y se muestra un aviso para revisarlo.
- Inicio de sesión:
  - Si el usuario inicia sesión **sin verificar el email**, no puede acceder a las rutas privadas y se redirige a **/verify-email**.
  - Cuando el email ya está verificado, puede entrar a la app.

### Tablón de tareas (/**)
- Las tareas se cargan desde la API: `https://dummyjson.com/todos` (con **axios**).
- Se muestra:
  - texto de la tarea
  - estado (**Completada / Pendiente**)
  - estado de carga (**loading**) y mensaje de error si falla la petición.
- Filtro por select:
  - Todas
  - Completadas (`completed: true`)
  - Pendientes (`completed: false`)
  - Asignadas (tareas que ya están en el workspace de alguien)

### Asignación de tareas
Reglas implementadas:
- Si `completed === true` → **no** se puede asignar (no aparece el botón).
- Si `completed === false` y **no está asignada** → aparece botón **Agregar**.
- Si `completed === false` pero **ya está asignada** → aparece como **Asignada** (y no permite agregar).
- En **/workspace** solo aparecen las tareas asignadas por el usuario logueado.

---

## Tecnologías usadas

- **Vue 3** (Composition API)
- **Vite**
- **Vue Router**
- **Firebase v9 (modular)**:
  - Authentication (Email/Password + verificación)
  - Firestore
- **axios**
- **Vercel** (deploy)

---

## Instalación y ejecución en local

1) Clona el repositorio e instala dependencias:

```bash
npm install
```

2) Crea el archivo de variables de entorno.

En el proyecto tienes un ejemplo llamado **`.env.plantilla`**. Cópialo como **`.env.local`** y rellena los valores:

```bash
cp .env.plantilla .env.local
```

3) Arranca el proyecto:

```bash
npm run dev
```

La app se abrirá con Vite (normalmente en `http://localhost:5173`).

---

## Variables de entorno (Firebase)

El proyecto usa estas variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Estas claves salen al crear una **Web App** dentro de tu proyecto de Firebase.

---

## Estructura de Firestore

Para guardar las tareas asignadas se usa **Firestore**.

### Colección principal (requerida): `workspaces`
- **Colección:** `workspaces`
- **Documento:** un doc por usuario, usando como **id el `uid`** de Firebase Auth
- **Campo:** `tasks` (array)

Ejemplo:

```
workspaces/{uid}
{
  tasks: [
    { id: 1, text: "Do something", completed: false },
    { id: 2, text: "Another task", completed: false }
  ]
}
```

### Colección extra (para evitar duplicados): `assignments`
Para asegurar que **una tarea no la puedan coger dos usuarios**, guardo también una colección `assignments` donde cada documento tiene como id el **taskId**.

Ejemplo:

```
assignments/{taskId}
{
  taskId: 1,
  text: "Do something",
  completed: false,
  assignedTo: "{uid}",
  assignedAt: <timestamp>
}
```

La asignación se hace con una **transacción** (archivo `src/firestore/tasksFirestore.js`) para comprobar si ya existe el documento y, si no existe, crearlo y añadir la tarea al workspace del usuario.

---

## Rutas protegidas (Vue Router)

Las rutas privadas son:

- `/` (dashboard)
- `/workspace`

La lógica de protección es:
- Si **no hay sesión** → redirige a `/login`
- Si hay sesión pero **email NO verificado** → redirige a `/verify-email`
- Si hay sesión y **email verificado** → permite entrar

---

## Estructura del proyecto (carpetas)

- `src/api/` → llamada a la API de tareas (`todosApi.js`)
- `src/components/` → componentes de lista/ítem de tareas
- `src/composables/` → lógica reutilizable:
  - `useAuth.js` (auth y verificación)
  - `useTasks.js` (carga, filtros y asignación)
- `src/firebase/` → configuración y servicios de Firebase
- `src/firestore/` → funciones para Firestore (workspaces / assignments)
- `src/router/` → rutas y guards
- `src/views/` → vistas (Login, Register, VerifyEmail, Dashboard, Workspace)

---

## Despliegue en Vercel 

1. Subir el proyecto a GitHub.
2. En Vercel: **Import Project** desde GitHub.
3. Configuración típica para Vite:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Añadir en Vercel las mismas variables de entorno de Firebase (las `VITE_*`).
5. El archivo `vercel.json` incluye un **rewrite** para que Vue Router funcione bien en producción (SPA).

---

## Notas

- Si te registras y no te llega el correo, revisa **Spam**.
- La ruta `/verify-email` tiene botón para **reenviar** el correo y otro para **cerrar sesión**.

