# frontend

## Correr comando
```
npm install
```

### Correr comando
```
npm run serve
```

### Crear .env ejemplo variable de entorno
```
VUE_APP_API_BASE_URL=http://127.0.0.1:3000
```


# Sistema de Asignación de Horarios

Este proyecto es una aplicación web desarrollada con Vue.js para el frontend y Ruby on Rails para el backend. La aplicación permite la asignación automática de horarios a los usuarios y tiene dos vistas principales: una vista para seleccionar los días y asignar horarios automáticamente, y otra vista para visualizar las asignaciones por usuario.

## Componentes del Sistema

### Frontend (Vue.js)
- **Vista de Selección de Días**: Una tabla con checkboxes que permite seleccionar los días para la asignación de horarios. Después de seleccionar los días, se debe hacer clic en el botón "Actualizar" para asignar los horarios a los usuarios automáticamente. Esta vista es persistente para permitir futuras modificaciones de los horarios.
- **Vista de Asignaciones por Usuario**: Una tabla que muestra las asignaciones de horarios por usuario.

## Interacción entre Componentes

1. **Vista de Selección de Días**:
   - Los usuarios seleccionan los días en la tabla y hacen clic en el botón "Actualizar".
   - Se envía una solicitud a la API REST para asignar los horarios a los usuarios automáticamente.
   - La API procesa la solicitud y actualiza las asignaciones en la base de datos.
   - La vista se actualiza para reflejar los cambios.

2. **Vista de Asignaciones por Usuario**:
   - La vista obtiene las asignaciones actuales de la API y muestra una tabla con los datos.


