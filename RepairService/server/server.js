const express = require('express');
const cors = require('cors');

const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

app.get('/clients', (req, res) => {
    const clients = db.prepare('SELECT * FROM clients').all();
    res.json(clients);
});
app.post('/clients', (req, res) => {
    const { name, phone } = req.body;

    const result = db.prepare(
        'INSERT INTO clients (name, phone) VALUES (?, ?)'
    ).run(name, phone);

    res.json({
        message: 'Клиент добавлен!',
        id: result.lastInsertRowid
    });
});
app.get('/statuses', (req, res) => {
    const statuses = db.prepare('SELECT * FROM statuses').all();
    res.json(statuses);
});

app.get('/requests', (req, res) => {
    const requests = db.prepare(`
        SELECT
            requests.id,
            clients.name,
            requests.description,
            statuses.name AS status
        FROM requests
        JOIN clients ON requests.client_id = clients.id
        JOIN statuses ON requests.status_id = statuses.id
    `).all();

    res.json(requests);
});

app.post('/requests', (req, res) => {
    const { client_id, description } = req.body;

    const result = db.prepare(`
        INSERT INTO requests (client_id, description)
        VALUES (?, ?)
    `).run(client_id, description);

    res.json({
        message: 'Заявка добавлена!',
        id: result.lastInsertRowid
    });
});
app.patch('/requests/:id/status', (req, res) => {
    const { status_id } = req.body;
    const requestId = req.params.id;

    db.prepare(`
        UPDATE requests
        SET status_id = ?
        WHERE id = ?
    `).run(status_id, requestId);

    res.json({ message: 'Статус изменён!' });
});
app.listen(3000, () => {
    console.log('Сервер запущен: http://localhost:3000');
});