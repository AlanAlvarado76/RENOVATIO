const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia el usuario según tu configuración
    password: '', // Cambia la contraseña según tu configuración
    database: 'renovatio_gc'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
    console.log('Conectado a la base de datos');
});

module.exports = db;
