const express = require('express');

const router = express.Router();

// Endpoint que recibe un nombre y devuelve un saludo personalizado.
router.get('/saludo/:nombre', (req, res) => {
    const { nombre } = req.params;

    res.status(200).json({
        mensaje: `Hola, ${nombre}!`
    });
});

module.exports = router;