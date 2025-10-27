# Requirements Document

## Introduction

Este documento define los requisitos para un backend REST API construido con Express.js y Firebase. El sistema manejará autenticación de usuarios, registro de uso de funcionalidades, y almacenamiento de scores para tres módulos principales: RCP, Nose, y Burn Skins. La API utilizará Firebase Authentication para login social y correo/contraseña, y Firestore para almacenamiento de datos.

## Glossary

- **Backend API**: El servidor Express.js que expone endpoints REST para la aplicación
- **Firebase Auth**: Servicio de autenticación de Firebase que maneja login social y correo/contraseña
- **Firestore**: Base de datos NoSQL de Firebase para almacenar datos de usuarios, registros de uso y scores
- **Usuario**: Entidad que representa a un usuario autenticado en el sistema
- **Módulo**: Funcionalidad específica de la aplicación (RCP, Nose, Burn Skins)
- **Score**: Puntuación o resultado asociado a un usuario para un módulo específico
- **Registro de Uso**: Log que registra cuando un usuario utiliza un módulo específico

## Requirements

### Requirement 1

**User Story:** Como desarrollador del sistema, quiero configurar un servidor Express con estructura profesional, para que el código sea mantenible y escalable

#### Acceptance Criteria

1. THE Backend API SHALL inicializar un servidor Express en el puerto configurado
2. THE Backend API SHALL organizar el código en carpetas separadas para routes, controllers, services, models y middleware
3. THE Backend API SHALL configurar CORS para permitir peticiones desde el frontend
4. THE Backend API SHALL integrar el Firebase Admin SDK para comunicación con Firebase
5. THE Backend API SHALL incluir middleware de manejo de errores global

### Requirement 2

**User Story:** Como usuario de la aplicación, quiero registrarme e iniciar sesión usando mi correo y contraseña o redes sociales, para que pueda acceder a las funcionalidades del sistema

#### Acceptance Criteria

1. WHEN un usuario envía credenciales válidas de correo y contraseña, THE Backend API SHALL crear una cuenta nueva en Firebase Auth
2. WHEN un usuario envía credenciales de login válidas, THE Backend API SHALL verificar las credenciales con Firebase Auth y retornar un token de autenticación
3. THE Backend API SHALL soportar autenticación mediante proveedores sociales de Firebase (Google, Facebook, etc.)
4. WHEN un usuario se registra exitosamente, THE Backend API SHALL crear un documento de usuario en Firestore con información básica
5. THE Backend API SHALL validar que el token de autenticación sea válido en endpoints protegidos

### Requirement 3

**User Story:** Como usuario autenticado, quiero que el sistema registre cuando uso cada módulo, para que se mantenga un historial de mi actividad

#### Acceptance Criteria

1. WHEN un usuario autenticado envía una petición de uso de módulo, THE Backend API SHALL validar el token de autenticación
2. WHEN la petición es válida, THE Backend API SHALL crear un registro en Firestore con el ID del usuario, módulo usado y timestamp
3. THE Backend API SHALL soportar registro de uso para los módulos RCP, Nose y Burn Skins mediante un endpoint unificado
4. THE Backend API SHALL retornar confirmación exitosa después de registrar el uso
5. IF el usuario no está autenticado, THEN THE Backend API SHALL retornar un error 401 Unauthorized

### Requirement 4

**User Story:** Como usuario autenticado, quiero enviar y almacenar mis scores de cada módulo, para que pueda ver mi progreso y resultados

#### Acceptance Criteria

1. WHEN un usuario autenticado envía un score con valor numérico válido, THE Backend API SHALL validar el token de autenticación
2. WHEN la petición es válida, THE Backend API SHALL almacenar el score en Firestore asociado al usuario y módulo específico
3. THE Backend API SHALL soportar almacenamiento de scores para los módulos RCP, Nose y Burn Skins mediante un endpoint unificado
4. THE Backend API SHALL validar que el score sea un valor numérico dentro del rango permitido (0-100)
5. THE Backend API SHALL retornar el score almacenado como confirmación

### Requirement 5

**User Story:** Como desarrollador del sistema, quiero que la API maneje errores de forma consistente, para que el frontend pueda mostrar mensajes apropiados al usuario

#### Acceptance Criteria

1. WHEN ocurre un error de validación, THE Backend API SHALL retornar un código de estado 400 con mensaje descriptivo
2. WHEN ocurre un error de autenticación, THE Backend API SHALL retornar un código de estado 401 con mensaje descriptivo
3. WHEN ocurre un error de autorización, THE Backend API SHALL retornar un código de estado 403 con mensaje descriptivo
4. WHEN ocurre un error interno del servidor, THE Backend API SHALL retornar un código de estado 500 con mensaje genérico
5. THE Backend API SHALL registrar todos los errores en logs para debugging

### Requirement 6

**User Story:** Como administrador del sistema, quiero que las credenciales de Firebase se configuren mediante variables de entorno, para que sean seguras y no se expongan en el código

#### Acceptance Criteria

1. THE Backend API SHALL leer las credenciales de Firebase desde variables de entorno
2. THE Backend API SHALL validar que todas las variables de entorno requeridas estén presentes al iniciar
3. IF faltan variables de entorno requeridas, THEN THE Backend API SHALL fallar al iniciar con mensaje descriptivo
4. THE Backend API SHALL incluir un archivo .env.example con las variables requeridas documentadas
5. THE Backend API SHALL excluir el archivo .env del control de versiones
