const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/employees', (req, res) => {
    res.json({ message: "CORS habilitado" });
});

app.listen(8000, () => {
    console.log('Servidor corriendo en el puerto 8000');
});
