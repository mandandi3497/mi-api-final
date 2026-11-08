const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica la autenticación mediante JWT.
 *
 * Comprueba que la solicitud contiene un token válido
 * antes de permitir el acceso a las rutas protegidas.
 *
 * @param {import('express').Request} req Solicitud HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Siguiente middleware.
 */
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Comprueba que exista la clave secreta del servidor.
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            mensaje: 'Error de configuración del servidor.'
        });
    }

    // Comprueba que existe el encabezado Authorization.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'Acceso denegado. Se requiere un token de autenticación.'
        });
    }

    // Extrae el token del encabezado.
    const token = authHeader.split(' ')[1];

    try {
        // Verifica la validez del token.
        const datosUsuario = jwt.verify(token, process.env.JWT_SECRET);

        // Guarda los datos del usuario para utilizarlos en la ruta protegida.
        req.usuario = datosUsuario;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o caducado.'
        });
    }
};

module.exports = verificarToken;