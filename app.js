async function loadClients() {
    const group = document.getElementById('group').value;
    try {
        const res = await fetch(`http://your-server/api/clients?group=${encodeURIComponent(group)}`);
        const clients = await res.json();
        render(clients);
    } catch(e) {
        alert('خطأ في الاتصال بالسيرفر');
    }
}

function render(clients) {
    const tbody = document.querySelector('#clients tbody');
    tbody.innerHTML = clients.map(c => `
        <tr>
            <td>${c.FirstName} ${c.LastName}</td>
            <td>${c.Mobile || '---'}</td>
            <td>${c.Balance.toLocaleString()} ر.س</td>
            <td>
                <button ${!c.Mobile ? 'disabled' : ''} 
                    onclick="sendSMS('${c.Mobile}', ${c.Balance})">
                    إرسال
                </button>
            </td>
        </tr>
    `).join('');
}

async function sendSMS(mobile, balance) {
    if (!confirm(`إرسال إشعار الرصيد إلى ${mobile}؟`)) return;
    
    try {
        const res = await fetch('http://your-server/api/sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, balance })
        });
        alert(res.ok ? '✓ تم الإرسال' : '✗ فشل الإرسال');
    } catch(e) {
        alert('خطأ في الاتصال');
    }
}
