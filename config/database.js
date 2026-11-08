const mongoose = require('mongoose');

// Guarda la conexión en curso para reutilizarla.
let conexionEnCurso = null;

/**
 * Conecta la aplicación con MongoDB Atlas.
 *
 * Prioriza NUEVA_MONGODB_URI y utiliza MONGODB_URI
 * como alternativa si la primera no está configurada.
 *
 * Reutiliza la conexión existente para evitar
 * abrir conexiones innecesarias.
 *
 * @returns {Promise<typeof mongoose>} Instancia de Mongoose conectada.
 * @throws {Error} Si falta la configuración o falla la conexión.
 */
async function conectarDB() {
    // Si ya existe una conexión activa, la reutiliza.
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    // Evita iniciar varias conexiones simultáneas.
    if (!conexionEnCurso) {
        const uri =
            process.env.NUEVA_MONGODB_URI ||
            process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                'No se ha configurado NUEVA_MONGODB_URI ni MONGODB_URI.'
            );
        }

        conexionEnCurso = mongoose.connect(uri).catch((error) => {
            conexionEnCurso = null;
            throw error;
        });
    }

    await conexionEnCurso;

    return mongoose;
}

module.exports = conectarDB;