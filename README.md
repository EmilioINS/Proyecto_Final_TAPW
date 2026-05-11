# DocFlow - Generador Dinámico de PDFs

DocFlow es un servicio robusto y centralizado para la generación, almacenamiento y gestión dinámica de documentos PDF a partir de plantillas HTML configurables. Diseñado siguiendo los principios de **Clean Architecture**, ofrece una API RESTful escalable y un frontend modular orientado al ecosistema del Tecnológico Nacional de México (TecNM).

---

## 🚀 Características Principales

*   **Arquitectura Limpia (Clean Architecture):** Separación clara entre Dominio, Casos de Uso, Controladores y Repositorios.
*   **Gestión Dinámica de Plantillas:** Permite almacenar y gestionar plantillas HTML que utilizan [Handlebars](https://handlebarsjs.com/) para inyección de datos.
*   **Seguridad Basada en Tokens:** Cada plantilla genera un UUID único (`token`) que se utiliza para consumir la API de generación de PDFs sin exponer IDs de base de datos.
*   **Optimización de Recursos (Hashing):** Sistema inteligente que calcula un hash `SHA-256` basado en el ID de la plantilla y los datos (JSON) proporcionados. Si se solicita consultar un documento idéntico ya generado, el sistema devuelve la versión almacenada en caché en lugar de volver a renderizarlo, ahorrando costos de CPU.
*   **Renderizado de Alta Fidelidad:** Utiliza **Puppeteer** (Chrome Headless) para convertir el HTML compilado a PDF respetando hojas de estilo complejas.
*   **Almacenamiento en la Nube:** Integración profunda con **Supabase** (PostgreSQL y Storage) para la persistencia de datos y archivos.

---

## 📋 Requisitos Previos

*   [Node.js](https://nodejs.org/) (v16 o superior)
*   NPM (viene incluido con Node.js)
*   Cuenta y proyecto activo en [Supabase](https://supabase.com/)

---

## 🛠️ Instalación y Configuración

### 1. Clonar e Instalar
```bash
git clone https://github.com/EmilioINS/Proyecto_Final_TAPW.git
cd Proyecto_Final_TAPW
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables. Usa tu `Service Role Key` de Supabase para evitar restricciones de RLS (Row Level Security):

```env
PORT=3000
SUPABASE_URL=tu_url_de_supabase_aqui
SUPABASE_ANON_KEY=tu_service_role_key_aqui
JWT_SECRET=tu_secreto_para_firmar_jwt
```

### 3. Configurar Base de Datos (Supabase)
1. Ve al SQL Editor en tu panel de Supabase.
2. Copia y ejecuta el contenido del archivo `db_schema.sql` incluido en el proyecto para crear las tablas necesarias (`users`, `templates`, `generated_documents`).
3. Ve a la sección **Storage** en Supabase, crea un bucket llamado `pdf_documents` y asegúrate de configurarlo como **Público (Public)**.

### 4. Ejecutar el Servidor
Para arrancar el servidor en modo desarrollo (con auto-recarga usando `nodemon`):
```bash
npm run dev
```
El servidor estará disponible en: `http://localhost:3000`

---

## 📖 Reglas de Negocio (Core del Sistema)

1. **Gestión de Plantillas:** 
   * Las plantillas son documentos HTML puros que admiten variables entre llaves dobles, por ejemplo: `{{nombre_alumno}}`.
   * Al registrar una plantilla, la base de datos genera automáticamente un `token` (UUID). Este token es la única llave válida para solicitar la generación de un PDF, protegiendo así el identificador secuencial o primario de la tabla.
2. **Generación de PDFs (Modos de Operación):**
   * **Modo `consult`:** El caso de uso evalúa el hash exacto de los datos (`TemplateID + Payload JSON`). Si encuentra una coincidencia exacta en la tabla `generated_documents`, aborta el renderizado con Puppeteer y devuelve la URL del documento que ya existe en el bucket.
   * **Modo `generate`:** Compila la plantilla, lanza Puppeteer para renderizar el archivo, guarda el PDF binario en el bucket de Supabase Storage, y finalmente registra el hash y los metadatos en la base de datos de PostgreSQL.
3. **Autenticación (JWT Stateless):**
   * El sistema no utiliza sesiones del lado del servidor. El acceso a las APIs se protege mediante un JSON Web Token (JWT) que el frontend almacena y envía en la cabecera HTTP `Authorization: Bearer <token>`.

---

## 🔌 Documentación de APIs (Endpoints)

Todas las rutas base parten de `/api`.

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Body (JSON) | Autorización |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Crea un nuevo usuario administrador. | `{ "name", "email", "password" }` | Pública |
| `POST` | `/auth/login` | Inicia sesión y devuelve el token JWT. | `{ "email", "password" }` | Pública |
| `POST` | `/auth/logout` | Cierra la sesión (Limpia tokens). | - | Pública |

### Plantillas (`/api/templates`)

> **Importante:** Requieren cabecera `Authorization: Bearer <JWT_TOKEN>`

| Método | Endpoint | Descripción | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `/templates` | Sube una nueva plantilla HTML al sistema. | `{ "name", "description", "html_content" }` |
| `GET` | `/templates` | Obtiene el listado de todas las plantillas. | - |
| `GET` | `/templates/:id` | Devuelve el detalle de una plantilla específica. | - |

### Documentos / Generador (`/api/documents`)

> **Importante:** Requieren cabecera `Authorization: Bearer <JWT_TOKEN>`

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/documents` | Genera o consulta un documento PDF dinámicamente. |

**Ejemplo de Payload para Documentos:**
```json
{
    "token": "f5679000-a37f-40dc-9713-cc704ef028f1",
    "mode": "generate", 
    "data": {
        "alumno": "Emilio INS",
        "semestre": "Octavo"
    }
}
```
*(El `mode` puede ser `"generate"` o `"consult"`).*

---

## 📁 Estructura del Proyecto

```text
/
├── .env                    # Variables de entorno
├── app.js                  # Configuración principal de Express
├── package.json            # Dependencias
├── db_schema.sql           # Esquemático SQL de la BD
├── /public                 # Frontend puro (HTML/CSS/JS)
│   ├── /css
│   ├── /js/api
│   ├── /js/pages
│   └── /views
└── /src                    # Backend (Clean Architecture)
    ├── /application        # Lógica de Negocio (Use Cases)
    ├── /domain             # Modelos y Entidades (Models)
    └── /infrastructure     # Detalles técnicos externos
        ├── /config         # Supabase
        ├── /controllers    # Controladores Express
        ├── /middlewares    # Validadores JWT
        ├── /repositories   # Conexión a Base de Datos
        ├── /routes         # Rutas de Express
        └── /services       # Puppeteer & Storage Service
```

---
*Desarrollado para el Tecnológico Nacional de México.*
