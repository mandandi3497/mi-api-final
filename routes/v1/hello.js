const express = require('express');

const router = express.Router();

/**
 * Endpoint que devuelve el mensaje de bienvenida.
 *
 * @param {import('express').Request} req Solicitud HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
router.get('/hello', (req, res) => {
    res.status(200).json({
        mensaje: '¡Hola Mundo desde mi API final desplegada en Vercel!'
    });
});

module.exports = router;