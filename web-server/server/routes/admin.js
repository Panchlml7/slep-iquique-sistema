const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user'); // Asegúrate de que el modelo de usuario esté definido
const authMiddleware = require('../middleware/auth');

// Ruta para obtener todos los usuarios
router.get('/usuarios', authMiddleware, async (req, res) => {
    try {
        const users = await User.find(); // Obtener todos los usuarios
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// Ruta para crear un nuevo usuario
router.post('/usuarios', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('El email no es válido'),
    check('rol').notEmpty().withMessage('El rol es obligatorio')
], authMiddleware, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, rol } = req.body;

    try {
        const newUser = new User({ nombre, email, rol });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

// Otras rutas administrativas pueden ser añadidas aquí

module.exports = router;