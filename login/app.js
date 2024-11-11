const express = require('express');
const mysql = require('mysql');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Cambia el usuario según tu configuración
    password: '',  // Cambia la contraseña según tu configuración
    database: 'renovatio_gc'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

// Endpoint de autenticación (login)
app.post('/auth/user', (req, res) => {
    const { email, password } = req.body;

    // Consulta SQL para obtener el usuario por su email
    const query = 'SELECT * FROM user_register WHERE Email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }

        // Si no se encuentra el usuario
        if (results.length === 0) {
            return res.status(401).send('Usuario incorrecto');
        }

        // Verificar si la contraseña proporcionada coincide con la contraseña en la base de datos
        const storedPassword = results[0]?.Password; // Contraseña en texto plano

        if (password !== storedPassword) {
            return res.status(401).send('Contraseña incorrecta');
        }

        // Si la contraseña es válida, crear una sesión
        req.session.userId = results[0].IDSesion;  // Usamos el IDSesion como identificador
        res.send('Inicio de sesión exitoso');
    });
});

app.get('/test', (req, res) => {
    res.send('Ruta de prueba funcionando');
});

app.get('/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('No has iniciado sesión');
    }
    res.send('Bienvenido a tu perfil');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.send('Sesión cerrada');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
