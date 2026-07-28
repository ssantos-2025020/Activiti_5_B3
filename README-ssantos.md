# Implementación de la Entidad "Categoria"

## Resumen
La entidad `Categoria` está completamente implementada en el proyecto Kinal Inventario. Es la primera de las 3 entidades relacionadas (Categoria → Producto → Movimiento) y no depende de ninguna otra tabla.

## Problema Resuelto
El proyecto tenía un problema con la carga de variables de entorno. El archivo `backend/.env` tenía saltos de línea incorrectos que cortaban las variables en medio, por ejemplo:
```
DATABASE_URL=postgresql://postgres:ad
min@localhost:5432/kinal_inventario?schema=public
```

Esto hacía que dotenv no pudiera cargar `DATABASE_URL` correctamente, lo que causaba que Prisma no pudiera conectarse a la base de datos. Como resultado, los endpoints `/api/categorias`, `/api/productos` y `/api/movimientos` devolvían "Error interno del servidor".

La solución fue:
1. Recrear el archivo `backend/.env` con el formato correcto usando PowerShell
2. Configurar `backend/src/index.ts` para que `import "dotenv/config"` sea la primera línea del archivo
3. Verificar que todos los endpoints funcionen correctamente

## Comandos para Ejecutar el Proyecto
```bash
# Backend
cd backend
pnpm dev

# Frontend (en otra terminal)
cd kinal-inventario-frontend
pnpm start
```

## Archivos del Backend

### 1. Modelo Prisma
**Archivo:** `backend/prisma/schema.prisma`

Define el modelo de datos en la base de datos PostgreSQL:
- `id`: Autoincremental, clave primaria
- `nombre`: String único, máximo 100 caracteres
- `descripcion`: String opcional, máximo 255 caracteres
- `creadoEn`: DateTime con valor por defecto `now()`
- `actualizadoEn`: DateTime que se actualiza automáticamente
- Relación 1:N con `Producto`

```prisma
model Categoria {
  id          Int        @id @default(autoincrement())
  nombre      String     @unique @db.VarChar(100)
  descripcion String?    @db.VarChar(255)
  creadoEn    DateTime   @default(now())
  actualizadoEn DateTime @updatedAt
  productos   Producto[]
  @@map("categorias")
}
```

### 2. Tipos y Validación Zod
**Archivo:** `backend/src/types/categoria.types.ts`

Define esquemas de validación usando Zod:
- `crearCategoriaSchema`: Valida datos para crear (nombre requerido, descripción opcional)
- `actualizarCategoriaSchema`: Versión parcial del esquema de creación (todos los campos opcionales)
- `CrearCategoriaDTO` y `ActualizarCategoriaDTO`: Tipos TypeScript inferidos automáticamente

### 3. Servicio CRUD
**Archivo:** `backend/src/services/categoria.service.ts`

Contiene la lógica de negocio:
- `listar()`: Retorna todas las categorías ordenadas por nombre, con conteo de productos
- `obtenerPorId(id)`: Retorna una categoría específica con sus productos
- `crear(data)`: Crea una nueva categoría, validando que no exista el nombre
- `actualizar(id, data)`: Actualiza una categoría existente
- `eliminar(id)`: Elimina una categoría solo si no tiene productos asociados

### 4. Controlador
**Archivo:** `backend/src/controllers/categoria.controller.ts`

Maneja las peticiones HTTP:
- `listarCategorias`: GET /api/categorias
- `obtenerCategoria`: GET /api/categorias/:id
- `crearCategoria`: POST /api/categorias (requiere token)
- `actualizarCategoria`: PUT /api/categorias/:id (requiere token)
- `eliminarCategoria`: DELETE /api/categorias/:id (requiere token)

Usa `catchAsync` para manejo de errores y Zod para validación.

### 5. Rutas
**Archivo:** `backend/src/routes/categoria.routes.ts`

Define los endpoints REST:
- Lectura pública: GET / y GET /:id
- Escritura protegida: POST /, PUT /:id, DELETE /:id (requieren token JWT)

### 6. Registro de Rutas
**Archivo:** `backend/src/index.ts`

La ruta está registrada:
```typescript
app.use("/api/categorias", categoriaRoutes);
```

## Archivos del Frontend (Angular Standalone)

### 7. Modelo TypeScript
**Archivo:** `kinal-inventario-frontend/src/app/core/models/categoria.model.ts`

Define interfaces TypeScript:
- `Categoria`: Interfaz completa con todos los campos del backend
- `CategoriaForm`: Tipo para formularios (omite id, fechas y _count)

### 8. Servicio HTTP
**Archivo:** `kinal-inventario-frontend/src/app/core/services/categoria.service.ts`

Servicio inyectable que usa `HttpClient` y `Observable`:
- `listar()`: GET todas las categorías
- `obtener(id)`: GET una categoría por ID
- `crear(datos)`: POST nueva categoría
- `actualizar(id, datos)`: PUT actualizar categoría
- `eliminar(id)`: DELETE eliminar categoría

Retorna `Observable<ApiResponse<T>>` donde ApiResponse es el wrapper estándar de la API.

### 9. Componente Lista
**Archivos:** 
- `kinal-inventario-frontend/src/app/features/categorias/categoria-list/categoria-list.component.ts`
- `kinal-inventario-frontend/src/app/features/categorias/categoria-list/categoria-list.component.html`

Componente standalone que:
- Muestra tabla con todas las categorías usando `*ngFor`
- Muestra conteo de productos por categoría
- Permite editar y eliminar solo si el usuario está autenticado
- Usa `AuthService` para controlar visibilidad de acciones
- Implementa confirmación antes de eliminar

### 10. Componente Formulario
**Archivos:**
- `kinal-inventario-frontend/src/app/features/categorias/categoria-form/categoria-form.component.ts`
- `kinal-inventario-frontend/src/app/features/categorias/categoria-form/categoria-form.component.html`

Componente standalone con formulario reactivo (ReactiveForms):
- Usa `FormBuilder` para crear el formulario
- Valida: nombre requerido, mínimo 2 caracteres
- Detecta modo edición vs creación desde la URL
- `patchValue` para cargar datos en edición
- Navega a la lista después de guardar exitosamente

### 11. Rutas Angular
**Archivo:** `kinal-inventario-frontend/src/app/app.routes.ts`

Rutas configuradas con lazy loading:
- `/categorias`: Lista de categorías (público)
- `/categorias/nuevo`: Formulario crear (protegido con authGuard)
- `/categorias/editar/:id`: Formulario editar (protegido con authGuard)

## Endpoints Disponibles

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/categorias` | Listar todas las categorías | No |
| GET | `/api/categorias/:id` | Obtener una categoría por ID | No |
| POST | `/api/categorias` | Crear nueva categoría | Sí |
| PUT | `/api/categorias/:id` | Actualizar categoría existente | Sí |
| DELETE | `/api/categorias/:id` | Eliminar categoría | Sí |

## Comandos curl para Pruebas

### 1. Listar todas las categorías
```bash
curl http://localhost:3000/api/categorias
```

### 2. Obtener una categoría por ID
```bash
curl http://localhost:3000/api/categorias/1
```

### 3. Crear una nueva categoría (requiere token)
```bash
# Primero obtener token (reemplaza con tus credenciales)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kinal.edu.gt","password":"admin123"}' \
  | jq -r '.data.token')

# Crear categoría
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre":"Papelería","descripcion":"Artículos de oficina y papelería"}'
```

### 4. Actualizar una categoría (requiere token)
```bash
curl -X PUT http://localhost:3000/api/categorias/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre":"Papelería y Oficina"}'
```

### 5. Eliminar una categoría (requiere token)
```bash
curl -X DELETE http://localhost:3000/api/categorias/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Pasos para Probar la Funcionalidad Completa

### Backend
1. Asegúrate de que PostgreSQL esté corriendo
2. Configura `DATABASE_URL` en `backend/.env`
3. Ejecuta migración (si no se ha ejecutado):
   ```bash
   cd backend
   pnpm prisma:migrate
   ```
4. Genera el cliente Prisma:
   ```bash
   pnpm prisma:generate
   ```
5. Inicia el servidor:
   ```bash
   pnpm dev
   ```
6. Prueba los endpoints con los comandos curl arriba

### Frontend
1. Configura la URL de la API en `kinal-inventario-frontend/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     apiUrl: 'http://localhost:3000/api'
   };
   ```
2. Instala dependencias:
   ```bash
   cd kinal-inventario-frontend
   pnpm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   pnpm start
   ```
4. Abre `http://localhost:4200` en el navegador
5. Navega a `/categorias` para ver la lista
6. Inicia sesión para poder crear/editar/eliminar categorías
7. Prueba crear una nueva categoría en `/categorias/nuevo`
8. Prueba editar una categoría existente
9. Prueba eliminar una categoría (solo si no tiene productos)
