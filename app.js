async function load() {
    const group = document.getElementById('group').value;
    try {
        const res = await fetch(`/api/clients?group=${group}`);
        const clients = await res.json();
        show(clients);
    } catch(e) {
        alert('خطأ في الاتصال');
    }
}

function show(clients) {
    const html = clients.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>${c.mobile || '---'}</td>
            <td>${c.balance} ر.س</td>
            <td><button onclick="send(${c.mobile})">إرسال</button></td>
        </tr>
    `).join('');
    document.getElementById('clients').innerHTML = html;
}
