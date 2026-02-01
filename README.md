# TaskBoard (Vue 3 + Firebase + Vercel)

Aplicación web tipo tablón de tareas. Primero te registras o inicias sesión.  
Solo cuando el usuario tiene el correo verificado puede entrar a la parte privada y ver el tablón.

En el tablón (`/`) se cargan todas las tareas desde una API externa y se pueden asignar al área de trabajo del usuario (`/workspace`).  
Una tarea no puede ser asignada por dos usuarios a la vez.

---

## Tecnologías usadas

- **Vue 3** (Composition API)
- **Vue Router** (rutas protegidas)
- **Firebase Authentication** (registro/login + verificación de email)
- **Firestore** (guardar tareas asignadas por usuario)
- **Axios** (consumo de API)
- **Vite** (dev server y build)
- **Vercel** (deploy)

---

## Ejecutar en local

### 1) Instalar dependencias
npm install

### 2) Crear el archivo .env.local

En la raíz del proyecto crea un archivo llamado .env.local con estas variables (las sacas del panel de Firebase → Project settings):

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...


### 3) Arrancar el proyecto
npm run dev

---

## Enlace del deploy (Vercel)

https://task-board-app-vue.vercel.app/

---

## Firestore: estructura de la base de datos

La base de datos se usa para guardar las tareas que cada usuario se asigna en su área de trabajo.

Existe una colección llamada workspaces

Cada documento representa a un usuario

El ID del documento es el uid del usuario de Firebase Auth

Ejemplo:

workspaces/{uid}

Dentro del documento se guarda un campo:

Campo: tasks (array)

Es una lista/array con las tareas asignadas por el usuario.

Cada elemento guarda como mínimo:

id (id de la tarea)

text (texto de la tarea)

completed (boolean)

Ejemplo de documento:

workspaces: {

  "uidDelUsuario123": {
  
    tasks: [
      { id: 1, text: "Do something nice...", completed: false },
      { id: 5, text: "Watch a documentary", completed: false }
    ]
  }
  
}

---

## API de tareas

Las tareas del tablón se cargan desde:

https://dummyjson.com/todos

Se muestran con estado Pendiente/Completada, y hay un filtro para:

Todas

Completadas

Pendientes

Asignadas

---

## Notas sobre acceso (rutas protegidas)

Si no hay sesión → te manda a /login

Si hay sesión pero el email NO está verificado → bloquea / y /workspace y muestra la pantalla de verificación

Si hay sesión y email verificado → puedes entrar al tablón y al workspace
