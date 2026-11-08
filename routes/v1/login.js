const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/usuario');
const conectarDB = require('../../config/database');

const router = express.Router();

/**
 * Endpoint para autenticar usuarios y generar un token JWT.
 *
 * @param {import('express').Request} req Solicitud HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Comprueba que se hayan proporcionado las credenciales.
        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'El correo electrónico y la contraseña son obligatorios.'
            });
        }

        // Comprueba que exista la clave secreta para generar el token.
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                mensaje: 'Error de configuración del servidor.'
            });
        }

        // Establece la conexión con MongoDB.
        await conectarDB();

        // Busca al usuario y recupera también su contraseña cifrada.
        const usuario = await Usuario.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        // Comprueba que el usuario exista y que la contraseña sea correcta.
        if (!usuario || !(await usuario.compararPassword(password))) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas.'
            });
        }

        // Genera un token JWT con los datos del usuario.
        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        // Devuelve el token sin exponer la contraseña.
        return res.status(200).json({
            mensaje: 'Autenticación correcta.',
            token: token
        });

    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor.'
        });
    }
});

module.exports = router;