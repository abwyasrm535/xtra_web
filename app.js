// روابط API الافتراضية (يمكن تغييرها حسب السيرفر)
const API_URL = 'https://your-api-server.com/api';

async function loadClients() {
    const group = document.getElementById('groupInput').value;
    
    try {
        const response = await fetch(`${API_URL}/clients?group=${encodeURIComponent(group)}`);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        showMessage('حدث خطأ في الاتصال بالسيرفر', 'error');
    }
}

function renderTable(clients) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.fullName}</td>
            <td>${formatPhone(client.mobile)}</td>
            <td>${formatCurrency(client.balance)} ر.س</td>
            <td>
                <button class="send-btn" 
                    onclick="sendSMS('${client.mobile}', ${client.balance})"
                    ${!client.mobile ? 'disabled' : ''}>
                    📨 إرسال
                </button>
            </td>
        </tr>
    `).join('');
}

async function sendSMS(mobile, balance) {
    if (!confirm(`هل تريد إرسال إشعار الرصيد إلى ${mobile}؟`)) return;
    
    try {
        const response = await fetch(`${API_URL}/sms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, balance })
        });
        
        if (response.ok) {
            showMessage('تم الإرسال بنجاح ✅', 'success');
        } else {
            throw new Error('فشل في الإرسال');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// خدمات مساعدة
function formatPhone(num) {
    return num?.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3') || 'غير متوفر';
}

function formatCurrency(amount) {
    return Number(amount).toLocaleString('ar-SA');
}

function showMessage(msg, type) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background: ${type === 'error' ? '#db2828' : '#21ba45'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// التحميل التلقائي عند فتح الصفحة
window.onload = () => document.getElementById('groupInput').focus();
