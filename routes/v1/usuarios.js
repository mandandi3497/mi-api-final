const express = require('express');
const Usuario = require('../../models/usuario');
const verificarToken = require('../../middleware/auth');
const conectarDB = require('../../config/database');

const router = express.Router();

/**
 * Obtiene la lista de usuarios registrados.
 * El acceso está protegido mediante autenticación JWT.
 *
 * @param {import('express').Request} req Solicitud HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
router.get('/usuarios', verificarToken, async (req, res) => {
    try {
        // Establece la conexión con MongoDB.
        await conectarDB();

        // Recupera los usuarios sin incluir sus contraseñas.
        const usuarios = await Usuario.find()
            .select('-password')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            mensaje: 'Lista de usuarios obtenida correctamente.',
            total: usuarios.length,
            usuarios: usuarios
        });

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);

        return res.status(500).json({
            mensaje: 'Error al consultar los usuarios.'
        });
    }
});

module.exports = router;