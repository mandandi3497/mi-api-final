const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar solicitudes JSON.
app.use(express.json());

// Importación de las rutas de la API.
const helloRoutes = require('./routes/v1/hello');
const saludoRoutes = require('./routes/v1/saludo');
const usuariosRoutes = require('./routes/v1/usuarios');
const loginRoutes = require('./routes/v1/login');

// Registro de las rutas.
app.use('/api/v1', helloRoutes);
app.use('/api/v1', saludoRoutes);
app.use('/api/v1', usuariosRoutes);
app.use('/api/v1', loginRoutes);

// Carga de la documentación Swagger.
const swaggerDocument = yaml.load(
    path.join(__dirname, 'swagger.yaml')
);

// Configuración de la documentación interactiva.
app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// Ruta principal.
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: '¡Bienvenido a mi API final!'
    });
});

// Inicio del servidor.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}

module.exports = app;