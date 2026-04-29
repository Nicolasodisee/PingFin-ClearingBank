const API_URL = 'http://localhost:8080/api';

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
        pageTitle.textContent = btn.dataset.title;

        const targetPage = document.querySelector(`#${targetPageId}`);
        targetPage.classList.remove('hidden');

        navButtons.forEach(b => b.classList.remove('bg-blue-600', 'active'));
        btn.classList.add('bg-blue-600', 'active');

        if (targetPageId === 'dashboardPage') updateDashboard();
        if (targetPageId === 'bankNodesPage') updateBankNodes();
        if (targetPageId === 'trafficLogsPage') updateLogs();
    });
});

async function updateDashboard() {
    try {
        const response = await fetch(`${API_URL}/po_out`);
        const result = await response.json();
        if (result.ok) {
            renderTable(result.data, transactionTable);
            totalCounter.textContent = result.data.length;
        }
    } catch (e) { console.error('Dashboard fout:', e); }
}

async function updateBankNodes() {
    bankList.innerHTML = 'Laden...';
    try {
        const response = await fetch(`${API_URL}/banks`);
        const result = await response.json();
        if (result.ok) {
            bankList.innerHTML = result.data.map(bank => `
                <div class="bg-[#1e293b] p-4 rounded-lg border border-slate-700 text-center">
                    <p class="text-xl font-bold">${bank.bic}</p>
                    <p class="text-slate-400 text-sm">${bank.name}</p>
                </div>
            `).join('');
        }
    } catch (e) { console.error('Banks fout:', e); }
}

async function updateLogs() {
    logsContent.textContent = 'Logs ophalen...';
    try {
        const response = await fetch(`${API_URL}/logs`); 
        const text = await response.text();
        logsContent.textContent = text || 'Geen logs gevonden.';
    } catch (e) { logsContent.textContent = 'Fout bij laden van logs.'; }
}

function renderTable(data, container) {
    if (!data || data.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">Geen transacties.</td></tr>';
        return;
    }
    container.innerHTML = data.map(item => `
        <tr class="border-t border-slate-700 hover:bg-slate-800">
            <td class="p-4 font-mono text-blue-400">${item.po_id}</td>
            <td class="p-4">€${item.po_amount}</td>
            <td class="p-4">${item.ob_id}</td>
            <td class="p-4">${item.bb_id}</td>
            <td class="p-4 text-right">
                <span class="px-2 py-1 rounded text-xs ${item.cb_code === 2000 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}">
                    ${item.cb_code}
                </span>
            </td>
        </tr>
    `).join('');
}

updateDashboard();