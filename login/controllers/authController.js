const db = require('../config/db');

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM user_register WHERE Email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }

        if (results.length === 0) {
            return res.status(401).send('Usuario incorrecto');
        }

        const storedPassword = results[0]?.Password;

        if (password !== storedPassword) {
            return res.status(401).send('Contraseña incorrecta');
        }

        req.session.userId = results[0].IDSesion;
        res.send('Inicio de sesión exitoso');
    });
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.send('Sesión cerrada');
    });
};

module.exports = {
    loginUser,
    logoutUser
};
