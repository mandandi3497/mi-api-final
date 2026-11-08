const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema que define la estructura de los usuarios.
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Encripta la contraseña antes de guardar un usuario nuevo
// o cuando se modifica su contraseña.
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Comprueba si la contraseña introducida es correcta.
usuarioSchema.methods.compararPassword = async function (passwordIntroducida) {
    return bcrypt.compare(passwordIntroducida, this.password);
};

// Creación y exportación del modelo Usuario.
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;