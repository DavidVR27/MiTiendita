# Implementación de una Base de Datos

Este documento describe los pasos necesarios para implementar y poner en marcha una base de datos PostgreSQL, así como la ejecución del servidor backend asociado.

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente instalado y configurado en tu sistema:

- [PostgreSQL](https://www.postgresql.org/download/)
- [Node.js y npm](https://nodejs.org/)
- El proyecto backend clonado localmente
- Variables de entorno (si aplica) correctamente configuradas

---

## ⚙️ Pasos para implementar la base de datos

1. **Abrir terminal en la ruta de PostgreSQL**  
   Dirígete a la carpeta donde está instalado PostgreSQL. Por ejemplo:  
   ```bash
   cd C:/pgsql/bin
2. **Iniciar el motor de la base de datos** 
    ```bash
      pg_ctl -D "C:/BD/DATA" -l logfile start
3. **Ejecutar el servidor backend** 
En una nueva terminal, ubícate en el directorio raíz del proyecto y ejecuta:
```bash
npm run backend
```
4. **Acceder a PostgreSQL con el usuario `postgres`**
    ```bash 
    psql -U postgres
    ```
5. **Conectarse a la base de datos `server`**
   ```bash
   \c server
   ```
*Nota para persona 1 

Proceso
login:
curl -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d "{\"email\": \"rodrigo.lopez@mitiendita.com\", \"password\": \"123456\"}"

forgot-password: (requiere del email)
curl -X POST http://localhost:3000/api/users/forgot-password -H "Content-Type: application/json" -d "{\"email\": \"rodrigo.lopez@mitiendita.com\"}"


////para los dos change-password
curl -X PUT http://localhost:3000/api/users/:id/change-password -H "Authorization: Bearer TU_TOKEN_JWT" -H "Content-Type: application/json" -d "{\"oldPassword\": \"contraseña_anterior\", \"newPassword\": \"nueva_contraseña\"}"
////
curl -X PUT http://localhost:3000/api/users/change-password -H "Content-Type: application/json" -d "{\"token\": \"TOKEN_DE_RECUPERACION\", \"nuevaContrasenia\": \"nueva123\"}"
