document.addEventListener('DOMContentLoaded', () => {

    let currentDataKey = 'arrecadacao2024';
    const charts = {};
    let modalChart = null;

    // Funções de formatação
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value);

    // Dados fictícios (MOCK DATA) para demonstração.
    // **AQUI VOCÊ IRÁ SUBSTITUIR PELA SUA LÓGICA DE BUSCA DE DADOS REAIS**
    const mockData = {
        arrecadacao2024: {
            kpis: {
                damsEmitidos: 95200, valorEmitido: 98000000,
                damsArrecadados: 81300, valorArrecadado: 78550000,
                taxaArrecadacao: 80.2,
                multas: 850000,
                juros: 1200000,
                correcaoMonetaria: 1200000,
                descontos: 1500000,
                damsPagosAtraso: 13900,
                mediaAtraso: 19,
            },
            rankings: {
                topMaiores: [
                    { nome: 'EMPRESA A LTDA', cnpj_cpf: '11.222.333/0001-44', total: 2500000 },
                    { nome: 'SUPERMERCADO B S.A.', cnpj_cpf: '22.333.444/0001-55', total: 1800000 },
                    { nome: 'INDÚSTRIA C', cnpj_cpf: '33.444.555/0001-66', total: 1265000 },
                    { nome: 'HOSPITAL D', cnpj_cpf: '44.555.666/0001-77', total: 950000 },
                    { nome: 'CONSTRUTORA E', cnpj_cpf: '55.666.777/0001-88', total: 880000 },
                    { nome: 'UNIVERSIDADE F', cnpj_cpf: '66.777.888/0001-99', total: 760000 },
                    { nome: 'LOGÍSTICA G', cnpj_cpf: '77.888.999/0001-00', total: 710000 },
                    { nome: 'COMÉRCIO H', cnpj_cpf: '88.999.000/0001-11', total: 665000 },
                    { nome: 'EMPRESA I', cnpj_cpf: '99.000.111/0001-22', total: 620000 },
                    { nome: 'CONSULTORIA J', cnpj_cpf: '10.111.222/0001-33', total: 580000 },
                ],
                 topMenores: [
                    { nome: 'MICROEMPRESA Z', cnpj_cpf: '12.345.678/0001-99', total: 50.50 },
                    { nome: 'AUTÔNOMO Y', cnpj_cpf: '123.456.789-00', total: 75.00 },
                    { nome: 'MEI X', cnpj_cpf: '98.765.432/0001-11', total: 84.40 },
                    { nome: 'PESSOA FÍSICA W', cnpj_cpf: '111.222.333-44', total: 95.00 },
                    { nome: 'EMPRESA V', cnpj_cpf: '21.098.765/0001-23', total: 110.00 },
                    { nome: 'STARTUP U', cnpj_cpf: '32.109.876/0001-34', total: 125.75 },
                    { nome: 'PROFISSIONAL T', cnpj_cpf: '222.333.444-55', total: 137.45 },
                    { nome: 'SERVIÇOS S', cnpj_cpf: '43.210.987/0001-45', total: 142.00 },
                    { nome: 'ESCRITÓRIO R', cnpj_cpf: '54.321.098/0001-56', total: 150.00 },
                    { nome: 'LOJA Q', cnpj_cpf: '333.444.555-66', total: 155.50 },
                ],
            },
            analytics: {
                evolucaoMensal: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    emitido: [16333333, 16333333, 16333333, 16333333, 16333333, 16333335],
                    arrecadado: [13091666, 13091666, 13091666, 13091666, 13091666, 13091670],
                },
                efetividadeFaixaValor: {
                    labels: ['Até R$500', 'R$501 - R$2.000', 'R$2.001 - R$10.000', 'Acima de R$10.000'],
                    valorArrecadado: [15000000, 25000000, 20550000, 18000000],
                    taxaArrecadacao: [95, 88, 75, 62],
                    qtdDams: [55300, 18500, 6200, 1300]
                },
                distribuicaoAtraso: { labels: ['1-15 dias', '16-30 dias', '31-60 dias', '61-90 dias', '90+ dias'], qtdDams: [12000, 7500, 3500, 1500, 900] },
                valorVsAtraso: [ { x: 5, y: 350 }, { x: 35, y: 1500 }, { x: 65, y: 15000 } ],
                damsStatusMensal: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], emitidos: [15866, 15866, 15866, 15866, 15866, 15870], pagosDia: [9316, 9316, 9316, 9316, 9316, 9320], pagosAtraso: [4233, 4233, 4233, 4233, 4233, 4235], }
            },
            // Dados fictícios de DAMs para a modal do contribuinte
            dams: {
                '11.222.333/0001-44': [
                    { dam: '#2825003', tributo: 'ISS', parcela: '1/3', multa: 80000, juros: 9820, correcao: 1000, desconto: 0, total: 890200 },
                    { dam: '#2825004', tributo: 'ISS', parcela: '2/3', multa: 50000, juros: 6000, correcao: 800, desconto: 0, total: 650000 },
                ],
                '123.456.789-00': [
                     { dam: '#8765432', tributo: 'IPTU', parcela: 'única', multa: 5.50, juros: 2.00, correcao: 1.00, desconto: 0, total: 75.00 },
                ],
                '55.666.777/0001-88': [
                    { dam: '#3456789', tributo: 'IPTU', parcela: '1/3', multa: 2000, juros: 1500, correcao: 500, desconto: 0, total: 880000 },
                    { dam: '#3456790', tributo: 'IPTU', parcela: '2/3', multa: 1500, juros: 1000, correcao: 400, desconto: 0, total: 750000 },
                ]
                // Adicione mais dados conforme necessário para os outros contribuintes
            }
        },
    };

    // Cria um card de KPI
    const createKpiCard = (kpi) => {
        const color = kpi.color || 'sky';
        return `<div class="kpi-card"><div class="kpi-icon-wrapper bg-${color}-100"><i class="fa-solid ${kpi.icon} text-${color}-600"></i></div><div><div class="kpi-label">${kpi.label}</div><div class="kpi-value">${kpi.value}</div></div></div>`;
    };

    // Popula a tabela de rankings (maiores e menores)
    const populateRankingTable = (tableId, data) => {
        const tableBody = document.getElementById(tableId);
        if (!tableBody) return;
        tableBody.innerHTML = '';
        data.forEach(item => {
            const isCnpj = item.cnpj_cpf.length > 14;
            const iconClass = isCnpj ? 'fa-building' : 'fa-user';
            const iconColor = isCnpj ? 'text-indigo-500' : 'text-blue-500';

            const row = `
                <tr class="table-row-clickable" data-cnpj-cpf="${item.cnpj_cpf}" data-nome="${item.nome}">
                    <td class="px-4 py-2 text-left text-sm font-medium text-gray-900 flex items-center gap-2">
                        <i class="fas ${iconClass} ${iconColor}"></i>
                        <span>${item.nome}</span>
                    </td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${item.cnpj_cpf}</td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${formatCurrency(item.total)}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Popula a tabela de faixas de valor
    const populateAngelistTable = (data) => {
        const tableBody = document.getElementById('faixas-valor-tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const faixasData = data.analytics.efetividadeFaixaValor;
        faixasData.labels.forEach((label, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td class="text-sm font-medium text-gray-900">${label}</td>
                    <td class="text-sm text-gray-500">${formatCurrency(faixasData.valorArrecadado[index])}</td>
                    <td class="text-sm text-gray-500">${formatNumber(faixasData.qtdDams[index])}</td>
                </tr>`;
        });
    };

    // Atualiza a barra de informações com os filtros aplicados
    const updateInfoBar = () => {
        const infoBar = document.getElementById('info-bar');
        const form = document.getElementById('filtro-form');
        const formData = new FormData(form);

        const getSelectedOptions = (id) => Array.from(document.getElementById(id).selectedOptions).map(opt => opt.text);

        const filters = [
            { id: 'tributo-conta', label: 'Tributos', icon: 'fa-file-invoice-dollar' },
            { id: 'receita', label: 'Receita', icon: 'fa-barcode' },
            { id: 'tipo-receita', label: 'Tipo', icon: 'fa-tags' },
            { id: 'porte-contribuinte', label: 'Porte', icon: 'fa-building' },
            { id: 'setor-economico', label: 'Setor', icon: 'fa-industry' },
            { id: 'banco', label: 'Banco', icon: 'fa-university' },
            { id: 'bairro', label: 'Bairros', icon: 'fa-map-marker-alt' },
        ];

        infoBar.innerHTML = '';

        let content = '';

        // Adiciona as datas
        const dataInicial = formData.get('data-inicial');
        const dataFinal = formData.get('data-final');
        if (dataInicial && dataFinal) {
             content += `
                <div class="info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span class="info-item-label">Período:</span>
                    <span class="info-item-value">${new Date(dataInicial).toLocaleDateString()} a ${new Date(dataFinal).toLocaleDateString()}</span>
                </div>
            `;
        }

        filters.forEach(filter => {
            const selected = getSelectedOptions(filter.id);
            const value = selected.length > 0 ? selected.join(', ') : 'Todos';
            content += `
                <div class="info-item">
                    <i class="fas ${filter.icon}"></i>
                    <span class="info-item-label">${filter.label}:</span>
                    <span class="info-item-value">${value}</span>
                </div>
            `;
        });

        infoBar.innerHTML = content;
    };

    // Função principal para atualizar o painel
    const updateDashboard = (data) => {
        const kpisGerais = [
            { label: 'DAMs Arrecadados', value: formatNumber(data.kpis.damsArrecadados), icon: 'fa-file-invoice', color: 'green' },
            { label: 'Valor Total Arrecadado', value: formatCurrency(data.kpis.valorArrecadado), icon: 'fa-sack-dollar', color: 'teal' },
            { label: 'DAMs Emitidos', value: formatNumber(data.kpis.damsEmitidos), icon: 'fa-file-invoice-dollar', color: 'sky' },
            { label: 'Valor Total Emitido', value: formatCurrency(data.kpis.valorEmitido), icon: 'fa-money-bill-wave', color: 'blue' },
            { label: 'Taxa de Arrecadação', value: `${data.kpis.taxaArrecadacao}%`, icon: 'fa-chart-pie', color: 'sky' },
            { label: 'Total Multa de Mora', value: formatCurrency(data.kpis.multas), icon: 'fa-exclamation-triangle', color: 'orange' },
            { label: 'Total Juros de Mora', value: formatCurrency(data.kpis.juros), icon: 'fa-percent', color: 'red' },
            { label: 'Total Correção Monetária', value: formatCurrency(data.kpis.correcaoMonetaria), icon: 'fa-sync-alt', color: 'purple' },
            { label: 'Total Descontos Concedidos', value: formatCurrency(data.kpis.descontos), icon: 'fa-tag', color: 'yellow' },
            { label: 'Arrecadação Atualizada', value: formatCurrency(data.kpis.valorArrecadado + data.kpis.correcaoMonetaria), icon: 'fa-money-bill-alt', color: 'green' },
            { label: 'DAMs pagos em Atraso', value: formatNumber(data.kpis.damsPagosAtraso), icon: 'fa-clock', color: 'red' },
            { label: 'Média de Atraso', value: `${data.kpis.mediaAtraso} dias`, icon: 'fa-calendar-day', color: 'blue' },
        ];
        document.getElementById('kpi-gerais').innerHTML = kpisGerais.map((kpi, i) => createKpiCard({ ...kpi, delay: i })).join('');

        updateCharts(data);
        populateAngelistTable(data);
        populateRankingTable('top-10-maiores-tbody', data.rankings.topMaiores);
        populateRankingTable('top-10-menores-tbody', data.rankings.topMenores);
        updateInfoBar();
    };

    // Inicializa todos os gráficos
    const initCharts = () => {
        Chart.defaults.font.family = "'Inter', sans-serif";
        const defaultOptions = (isCurrency = false) => ({
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#475569', padding: 20 } },
                tooltip: { callbacks: { label: c => `${c.dataset.label || ''}: ${isCurrency ? formatCurrency(c.raw) : formatNumber(c.raw)}` } }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        });

        const chartConfigs = {
            totalValuesChart: { type: 'bar', options: defaultOptions(true) },
            monthlyEvolutionChart: { type: 'line', options: defaultOptions(true) },
            collectionPercentageChart: { type: 'doughnut', options: { cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } },
            effectivenessByValueRangeChart: { type: 'bar', options: { ...defaultOptions(true), scales: { y: { title: { display: true, text: 'Valor Arrecadado (R$)' } }, y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Taxa (%)' }, ticks: { callback: (v) => `${v}%` } } } } },
            damsPaidStatusChart: { type: 'pie', options: defaultOptions() },
            delayDistributionChart: { type: 'bar', options: defaultOptions() },
            revenueCompositionChart: { type: 'doughnut', options: defaultOptions(true) },
            valueVsDelayScatterChart: { type: 'scatter', options: { ...defaultOptions(true), scales: { x: { title: { display: true, text: 'Dias em Atraso' } }, y: { title: { display: true, text: 'Valor (R$)' } } } } },
            monthlyDamStatusChart: { type: 'bar', options: { ...defaultOptions(), scales: { x: { stacked: true }, y: { stacked: true } } } }
        };

        for (const [id, config] of Object.entries(chartConfigs)) {
            const canvas = document.getElementById(id);
            if (canvas) charts[id] = new Chart(canvas, { type: config.type, data: {}, options: config.options });
        }
    };

    // Atualiza os dados de todos os gráficos
    const updateCharts = (data) => {
        const { kpis, analytics } = data;
        const colors = { sky: '#0ea5e9', green: '#10b981', red: '#ef4444', orange: '#f97316', purple: '#8b5cf6', teal: '#14b8a6', yellow: '#eab308' };

        charts.totalValuesChart.data = {
            labels: ['Emitido', 'Arrecadado', 'Multas', 'Juros', 'Correção Monetária'],
            datasets: [{ label: 'Valor (R$)', data: [kpis.valorEmitido, kpis.valorArrecadado, kpis.multas, kpis.juros, kpis.correcaoMonetaria], backgroundColor: [colors.sky, colors.green, colors.orange, colors.purple, colors.yellow] }]
        };
        charts.monthlyEvolutionChart.data = {
            labels: analytics.evolucaoMensal.labels,
            datasets: [
                { label: 'Emitido', data: analytics.evolucaoMensal.emitido, borderColor: colors.sky, tension: 0.3 },
                { label: 'Arrecadado', data: analytics.evolucaoMensal.arrecadado, borderColor: colors.green, tension: 0.3 },
            ]
        };

        const taxaArrecadacao = kpis.taxaArrecadacao;
        charts.collectionPercentageChart.data = { datasets: [{ data: [taxaArrecadacao, 100 - taxaArrecadacao], backgroundColor: [colors.green, '#e2e8f0'], borderWidth: 0 }] };
        document.getElementById('gauge-text').innerHTML = `<div class="text-3xl lg:text-4xl font-bold text-slate-800">${taxaArrecadacao.toFixed(1)}%</div><div class="text-sm text-slate-500">do valor emitido</div>`;

        charts.effectivenessByValueRangeChart.data = {
            labels: analytics.efetividadeFaixaValor.labels,
            datasets: [
                { type: 'bar', label: 'Valor Arrecadado (R$)', data: analytics.efetividadeFaixaValor.valorArrecadado, backgroundColor: `${colors.teal}80`, yAxisID: 'y' },
                { type: 'line', label: 'Taxa de Arrecadação (%)', data: analytics.efetividadeFaixaValor.taxaArrecadacao, borderColor: colors.purple, yAxisID: 'y1', tension: 0.2 }
            ]
        };

        const damsPagosDia = kpis.damsArrecadados - kpis.damsPagosAtraso;
        charts.damsPaidStatusChart.data = {
            labels: [`Pagos em Dia (${formatNumber(damsPagosDia)})`, `Pagos com Atraso (${formatNumber(kpis.damsPagosAtraso)})`],
            datasets: [{ data: [damsPagosDia, kpis.damsPagosAtraso], backgroundColor: [colors.green, colors.orange] }]
        };
        charts.delayDistributionChart.data = {
            labels: analytics.distribuicaoAtraso.labels,
            datasets: [{ label: 'Quantidade de DAMs', data: analytics.distribuicaoAtraso.qtdDams, backgroundColor: colors.orange }]
        };
        charts.revenueCompositionChart.data = {
            labels: ['Principal', 'Multas', 'Juros', 'Correção Monetária'],
            datasets: [{ data: [kpis.valorArrecadado - kpis.multas - kpis.juros, kpis.multas, kpis.juros, kpis.correcaoMonetaria], backgroundColor: [colors.teal, colors.orange, colors.purple, colors.yellow] }]
        };
        charts.valueVsDelayScatterChart.data = { datasets: [{ label: 'DAM', data: analytics.valorVsAtraso, backgroundColor: `${colors.red}B3` }] };

        const damsNaoPagos = analytics.damsStatusMensal.emitidos.map((e, i) => e - (analytics.damsStatusMensal.pagosDia[i] + analytics.damsStatusMensal.pagosAtraso[i]));
        charts.monthlyDamStatusChart.data = {
            labels: analytics.damsStatusMensal.labels,
            datasets: [
                { label: 'Pago em Dia', data: analytics.damsStatusMensal.pagosDia, backgroundColor: colors.green },
                { label: 'Pago com Atraso', data: analytics.damsStatusMensal.pagosAtraso, backgroundColor: colors.orange },
                { label: 'Não Pago', data: damsNaoPagos, backgroundColor: colors.red },
            ]
        };

        Object.values(charts).forEach(chart => chart.update());
    };

    // -- LÓGICA DAS MODAIS --
    const chartModal = document.getElementById('chart-modal');
    const modalContent = document.getElementById('modal-content');
    const chartModalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalTableContainer = document.getElementById('modal-table-container');

    const contribuinteModal = document.getElementById('contribuinte-modal');
    const contribuinteModalCloseBtn = document.getElementById('contribuinte-modal-close-btn');

    const openChartModal = (chartId) => {
        const originalChart = charts[chartId];
        if (!originalChart) return;

        const chartTitleText = document.querySelector(`[data-chart-id="${chartId}"]`).closest('.chart-article').querySelector('.chart-title span').textContent;
        modalTitle.textContent = chartTitleText;

        const modalCanvas = document.getElementById('modal-chart');
        if (modalChart) modalChart.destroy();

        modalChart = new Chart(modalCanvas, {
            type: originalChart.config.type,
            data: JSON.parse(JSON.stringify(originalChart.data)), // Deep copy
            options: { ...originalChart.options, maintainAspectRatio: false }
        });

        generateModalTable(originalChart.data);
        chartModal.classList.add('visible');
    };

    const closeChartModal = () => {
        chartModal.classList.remove('visible');
        if (modalChart) {
            modalChart.destroy();
            modalChart = null;
        }
    };

    const generateModalTable = (data) => {
        let tableHTML = '<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>';

        let headers = ['Categoria'];
        if (data.labels && data.labels.length > 0) {
             headers = ['Categoria', ...data.datasets.map(d => d.label)];
        } else {
             headers = data.datasets.map(d => d.label || 'Valor');
             headers.unshift('Categoria');
        }

        headers.forEach(h => tableHTML += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${h}</th>`);
        tableHTML += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';

        if (data.labels && data.labels.length > 0) {
            data.labels.forEach((label, index) => {
                tableHTML += `<tr><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${label}</td>`;
                data.datasets.forEach(dataset => {
                    const value = dataset.data[index];
                    const rawValue = typeof value === 'object' && value !== null ? value.y : value;
                    const formattedValue = !isNaN(rawValue) ? formatCurrency(rawValue) : rawValue;
                    tableHTML += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedValue}</td>`;
                });
                tableHTML += '</tr>';
            });
        }

        tableHTML += '</tbody></table>';
        modalTableContainer.innerHTML = tableHTML;
    };

    const openContribuinteModal = (cnpjCpf, nome) => {
        const contribuinteInfoSpan = document.getElementById('contribuinte-info');
        contribuinteInfoSpan.textContent = `${cnpjCpf} - ${nome}`;

        const damsTbody = document.getElementById('dams-contribuinte-tbody');
        damsTbody.innerHTML = '';

        const dams = mockData.arrecadacao2024.dams[cnpjCpf] || [];
        dams.forEach(dam => {
            damsTbody.innerHTML += `
                <tr>
                    <td class="px-4 py-2 text-left text-sm font-medium text-gray-900">${dam.dam}</td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${dam.tributo}</td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${dam.parcela}</td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${formatCurrency(dam.multa)}</td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${formatCurrency(dam.juros)}</td>
                    <td class="px-4 py-2 text-left text-sm text-gray-500">${formatCurrency(dam.correcao)}</td>
                    <td class="px-4 py-2 text-left text-sm text-green-500">${formatCurrency(dam.desconto)}</td>
                    <td class="px-4 py-2 text-left text-sm font-bold text-gray-900">${formatCurrency(dam.total)}</td>
                </tr>
            `;
        });
        contribuinteModal.classList.add('visible');
    };

    const closeContribuinteModal = () => {
        contribuinteModal.classList.remove('visible');
    };


    // -- EVENT LISTENERS --
    document.getElementById('filtro-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // AQUI: Você deve chamar sua função para buscar os dados reais com base nos filtros
        // Exemplo: fetchData(getFilters());
        // Por enquanto, apenas atualizamos a UI com os dados mockados e os filtros
        console.log("Formulário enviado, gerando dashboard...");
        updateDashboard(mockData[currentDataKey]);
    });

    document.getElementById('toggle-filtros-avancados').addEventListener('click', () => {
        document.getElementById('filtros-avancados').classList.toggle('hidden');
    });

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const chartId = e.currentTarget.dataset.chartId;
            openChartModal(chartId);
        });
    });

    chartModalCloseBtn.addEventListener('click', closeChartModal);
    chartModal.addEventListener('click', (e) => {
        if (e.target === chartModal) closeChartModal();
    });

    contribuinteModalCloseBtn.addEventListener('click', closeContribuinteModal);
    contribuinteModal.addEventListener('click', (e) => {
        if (e.target === contribuinteModal) closeContribuinteModal();
    });

    // Adiciona o listener para as linhas das tabelas de ranking
    const rankingTables = ['top-10-maiores-tbody', 'top-10-menores-tbody'];
    rankingTables.forEach(tableId => {
        document.getElementById(tableId).addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (row) {
                const cnpjCpf = row.dataset.cnpjCpf;
                const nome = row.dataset.nome;
                if (cnpjCpf) {
                    openContribuinteModal(cnpjCpf, nome);
                }
            }
        });
    });

    // -- INICIALIZAÇÃO --
    initCharts();
    updateDashboard(mockData[currentDataKey]);
});