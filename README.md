# MiTiendita
### Iniciar el backend
`npm run backend` - Para ver las instrucciones detalladas haga click [aquí](./server/README.md)
### Iniciar el frontend
`npm run frontend`

Para ver las actividades realizadas por cada alumno vealo [aquí](./trabajo-progra-web/README.md)

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