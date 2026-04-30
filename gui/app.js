const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('adminlogin');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

async function loginMaster() {
    try {
        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                bic: 'Admin', 
                secret_key: 'nicolasisdegoat' 
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            localStorage.setItem('adminlogin', result.token);
            console.log("Admin Token succesvol vernieuwd voor Admin.");
            updateDashboard();
        } else {
            console.error("Admin login mislukt:", result.message);
        }
    } catch (e) {
        console.error("Admin login error:", e);
    }
}

const pageTitle = document.querySelector('.js-page-title');
const navButtons = document.querySelectorAll('.js-nav-btn');
const pages = document.querySelectorAll('.js-page');
const transactionTable = document.querySelector('.js-table-body');
const totalCounter = document.querySelector('.js-total-count');
const bankList = document.querySelector('.js-bank-list');
const logsContent = document.querySelector('.js-logs-content');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetPageId = btn.dataset.page;
        pages.forEach(p => p.classList.add('hidden'));
        document.querySelector(`#${targetPageId}`).classList.remove('hidden');
        pageTitle.textContent = btn.dataset.title;
        navButtons.forEach(b => b.classList.remove('bg-blue-600', 'active'));
        btn.classList.add('bg-blue-600', 'active');

        if (targetPageId === 'dashboardPage') updateDashboard();
        if (targetPageId === 'bankNodesPage') updateBankNodes();
        if (targetPageId === 'trafficLogsPage') updateLogs();
    });
});

async function updateDashboard() {
    try {
        const response = await fetch(`${API_URL}/po_out`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();
        if (result.ok) {
            renderTable(result.data, transactionTable);
            totalCounter.textContent = result.data.length;
        }
    } catch (e) { console.error('Dashboard fout:', e); }
}

async function updateBankNodes() {
    bankList.innerHTML = '<p class="text-slate-500">Banken laden...</p>';
    try {
        const response = await fetch(`${API_URL}/banks`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();
        if (result.ok || result.status === 200) {
            bankList.innerHTML = result.data.map(bank => `
                <div class="bg-[#1e293b] p-6 rounded-xl border border-slate-700 text-center shadow-lg">
                    <p class="text-2xl font-bold text-white">${bank.id}</p>
                    <p class="text-slate-400 text-sm uppercase tracking-widest">${bank.name || 'Bank Node'}</p>
                </div>
            `).join('');
        }
    } catch (e) { console.error('Banks fout:', e); }
}

async function updateLogs() {
    logsContent.textContent = 'Logs ophalen uit database...';
    try {
        const response = await fetch(`${API_URL}/logs`, {
            headers: getAuthHeaders()
        });
        const result = await response.json(); 
        
        if (result.ok) {
            const formattedLogs = result.data.map(log => {
                const tijd = new Date(log.datetime).toLocaleTimeString();
                return `[${tijd}] ${log.type.padEnd(15)} | PO: ${log.po_id || 'N/A'} | ${log.message}`;
            }).join('\n');

            logsContent.textContent = formattedLogs || 'Geen logs gevonden.';
            logsContent.scrollTop = logsContent.scrollHeight;
        }
    } catch (e) { 
        logsContent.textContent = 'Fout: Geen toegang tot logs (Token ongeldig?).'; 
    }
}

function renderTable(data, container) {
    if (!data || data.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">Geen actieve transacties.</td></tr>';
        return;
    }
    container.innerHTML = data.map(item => `
        <tr class="border-t border-slate-700 hover:bg-slate-800 transition">
            <td class="p-4 font-mono text-blue-400 text-xs">${item.po_id}</td>
            <td class="p-4 font-bold text-white">€${item.po_amount}</td>
            <td class="p-4">${item.ob_id}</td>
            <td class="p-4">${item.bb_id}</td>
            <td class="p-4 text-right">
                <span class="px-2 py-1 rounded text-[10px] font-bold ${item.cb_code == 2000 ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-red-900/50 text-red-400 border border-red-700'}">
                    ${item.cb_code == 2000 ? 'PENDING' : 'FAILED (' + item.cb_code + ')'}
                </span>
            </td>
        </tr>
    `).join('');
}

loginMaster();
