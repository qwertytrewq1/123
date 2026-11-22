import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [clients, setClients] = useState([]);
    const [requests, setRequests] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [clientId, setClientId] = useState('');
    const [description, setDescription] = useState('');

    function loadData() {
        fetch('http://localhost:3000/clients')
            .then(response => response.json())
            .then(data => setClients(data));

        fetch('http://localhost:3000/requests')
            .then(response => response.json())
            .then(data => setRequests(data));

        fetch('http://localhost:3000/statuses')
            .then(response => response.json())
            .then(data => setStatuses(data));
    }

    useEffect(() => {
        loadData();
    }, []);

    function addClient(event) {
        event.preventDefault();

        fetch('http://localhost:3000/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone })
        })
            .then(response => response.json())
            .then(() => {
                setName('');
                setPhone('');
                loadData();
            });
    }

    function addRequest(event) {
        event.preventDefault();

        fetch('http://localhost:3000/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: Number(clientId),
                description
            })
        })
            .then(response => response.json())
            .then(() => {
                setClientId('');
                setDescription('');
                loadData();
            });
    }
function changeStatus(requestId, statusId) {
    fetch(`http://localhost:3000/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status_id: statusId })
    })
        .then(() => loadData());
}
    return (
        <div className="container">
            <h1>Ремонтная служба</h1>
            <p className="subtitle">Учёт клиентов и заявок на ремонт</p>

            <div className="forms">
                <section className="card">
                    <h2>Добавить клиента</h2>

                    <form onSubmit={addClient}>
                        <input
                            type="text"
                            placeholder="Имя клиента"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            required
                        />

                        <input
                            type="tel"
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={event => setPhone(event.target.value)}
                            required
                        />

                        <button type="submit">Добавить клиента</button>
                    </form>
                </section>

                <section className="card">
                    <h2>Создать заявку</h2>

                    <form onSubmit={addRequest}>
                        <select
                            value={clientId}
                            onChange={event => setClientId(event.target.value)}
                            required
                        >
                            <option value="">Выберите клиента</option>

                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Описание неисправности"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            required
                        />

                        <button type="submit">Создать заявку</button>
                    </form>


</section>
            </div>

            <section className="card">
                <h2>Список клиентов</h2>

                {clients.map(client => (
                    <div className="item" key={client.id}>
                        <strong>{client.name}</strong>
                        <span>{client.phone}</span>
                    </div>
                ))}
            </section>

            <section className="card">
                <h2>Заявки на ремонт</h2>

               {requests.map(request => (
    <div className="item" key={request.id}>
        <strong>{request.name}</strong>
        <span>{request.description}</span>

        <select
            value={statuses.find(status => status.name === request.status)?.id || ''}
            onChange={event => changeStatus(request.id, Number(event.target.value))}
        >
            {statuses.map(status => (
                <option key={status.id} value={status.id}>
                    {status.name}
                </option>
            ))}
        </select>
    </div>
))}
            </section>
        </div>
    );
}

export default App;





