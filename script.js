document.addEventListener('DOMContentLoaded', () => {

    let currentDataKey = 'arrecadacao2024';
    const charts = {};

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value);

    const mockData = {
        arrecadacao2024: {
            kpis: {
                damsEmitidos: 95200, valorEmitido: 98000000,
                damsArrecadados: 81300, valorArrecadado: 78550000,
                damsPagosAtraso: 25400,
                descontos: 1500000, multas: 850000, juros: 1200000,
                tma: 18.5,
            },
            analytics: {
                evolucaoMensal: { 
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    emitido: [16333333, 16333333, 16333333, 16333333, 16333333, 16333335],
                    arrecadado: [13091666, 13091666, 13091666, 13091666, 13091666, 13091670],
                    multas: [141666, 141666, 141666, 141666, 141666, 141670],
                    juros: [200000, 200000, 200000, 200000, 200000, 200000],
                },
                efetividadeFaixaValor: {
                    labels: ['Até R$500', 'R$501 - R$2.000', 'R$2.001 - R$10.000', 'Acima de R$10.000'],
                    valorArrecadado: [15000000, 25000000, 20550000, 18000000],
                    taxaArrecadacao: [95, 88, 75, 62],
                    qtdDams: [55300, 18500, 6200, 1300]
                },
                distribuicaoAtraso: {
                    labels: ['1-15 dias', '16-30 dias', '31-60 dias', '61-90 dias', '90+ dias'],
                    qtdDams: [12000, 7500, 3500, 1500, 900]
                },
                valorVsAtraso: [
                    { x: 5, y: 350 }, { x: 12, y: 450 }, { x: 2, y: 150 }, { x: 8, y: 200 },
                    { x: 35, y: 1500 }, { x: 25, y: 2500 }, { x: 40, y: 1800 }, { x: 22, y: 3200 },
                    { x: 65, y: 15000 }, { x: 80, y: 25000 }, { x: 95, y: 18000 }, { x: 120, y: 50000 },
                ],
                 damsStatusMensal: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    emitidos: [15866, 15866, 15866, 15866, 15866, 15870],
                    pagosDia: [9316, 9316, 9316, 9316, 9316, 9320],
                    pagosAtraso: [4233, 4233, 4233, 4233, 4233, 4235],
                }
            }
        },
    };
    
    const createKpiCard = (kpi) => {
        const colors = { sky: 'sky', red: 'red', blue: 'blue', orange: 'orange', green: 'green', purple: 'purple', teal: 'teal', yellow: 'yellow', pink: 'pink' };
        const color = colors[kpi.color] || 'sky';
        return `<div class="kpi-card small" style="--i: ${kpi.delay}"><div class="kpi-icon-wrapper bg-${color}-100"><i class="fa-solid ${kpi.icon} text-${color}-600"></i></div><div><div class="kpi-label">${kpi.label}</div><div class="kpi-value">${kpi.value}</div></div></div>`;
    };

    const populateAngelistTable = (data) => {
        const tableBody = document.getElementById('faixas-valor-tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        
        const faixasData = data.analytics.efetividadeFaixaValor;
        faixasData.labels.forEach((label, index) => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${label}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(faixasData.valorArrecadado[index])}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(faixasData.qtdDams[index])}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    const updateDashboard = (data) => {
        // **LISTA COMPLETA DE KPIs RESTAURADA E REORDENADA**
        const kpisGerais = [
            // Ordem ajustada conforme solicitado
            { label: 'DAMs Arrecadados', value: `${formatNumber(data.kpis.damsArrecadados)} Qtd.`, icon: 'fa-file-invoice', color: 'green' },
            { label: 'Valor Total Arrecadado', value: formatCurrency(data.kpis.valorArrecadado), icon: 'fa-sack-dollar', color: 'teal' },
            { label: 'DAMs Emitidos', value: `${formatNumber(data.kpis.damsEmitidos)} Qtd.`, icon: 'fa-file-invoice-dollar', color: 'sky' },
            { label: 'Valor Total Emitido', value: formatCurrency(data.kpis.valorEmitido), icon: 'fa-money-bill-wave', color: 'blue' },
            
            // KPIs originais restaurados
            { label: 'Taxa de Arrecadação', value: `${((data.kpis.valorArrecadado / data.kpis.valorEmitido) * 100).toFixed(1)}%`, icon: 'fa-percent', color: 'green' },
            { label: 'Total Multa', value: formatCurrency(data.kpis.multas), icon: 'fa-file-circle-exclamation', color: 'red' },
            { label: 'Total Correção Monetária', value: formatCurrency(data.kpis.juros), icon: 'fa-coins', color: 'teal' },
            { label: 'Total Desconto', value: formatCurrency(data.kpis.descontos), icon: 'fa-tag', color: 'yellow' },
            { label: 'Total Juros', value: formatCurrency(data.kpis.juros), icon: 'fa-hand-holding-dollar', color: 'yellow' },
            { label: 'Arrecadação Atualizada', value: formatCurrency(data.kpis.valorArrecadado + data.kpis.multas + data.kpis.juros), icon: 'fa-sack-xmark', color: 'red' },
            { label: 'DAMs pago com Atraso', value: `${formatNumber(Math.abs(data.kpis.damsEmitidos - data.kpis.damsArrecadados))} Qtd.`, icon: 'fa-clock', color: 'orange' },
            { label: 'Média de atraso', value: `${Math.ceil(data.kpis.tma)} dias`, icon: 'fa-stopwatch', color: 'purple' },
        ];
        document.getElementById('kpi-gerais').innerHTML = kpisGerais.map((kpi, i) => createKpiCard({ ...kpi, delay: i })).join('');
        
        updateCharts(data);
        populateAngelistTable(data);
    };

    const initCharts = () => {
        Chart.defaults.font.family = "'Inter', sans-serif";
        const defaultOptions = (isCurrency = false) => ({
            responsive: true, maintainAspectRatio: false,
            plugins: { 
                legend: { position: 'bottom', labels: { color: '#475569', padding: 20 } },
                tooltip: { 
                    callbacks: { 
                        label: (c) => {
                            const value = c.raw;
                            if (typeof value === 'object' && value !== null) return `${c.dataset.label}: ${formatCurrency(value.y)}`;
                            return `${c.dataset.label || ''}: ${isCurrency ? formatCurrency(value) : formatNumber(value)}`;
                        }
                    } 
                } 
            },
            scales: { 
                y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } }, 
                x: { grid: { display: false }, ticks: { color: '#64748b' } } 
            }
        });

        const chartConfigs = {
            totalValuesChart: { type: 'bar', options: defaultOptions(true) },
            monthlyEvolutionChart: { type: 'line', options: defaultOptions(true) },
            collectionPercentageChart: { type: 'doughnut', options: { ...defaultOptions(), cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } },
            effectivenessByValueRangeChart: { type: 'bar', options: { ...defaultOptions(true), plugins: { ...defaultOptions(true).plugins, legend: { display: false } }, scales: { y: { ...defaultOptions(true).scales.y, title: { display: true, text: 'Valor Arrecadado (R$)' } }, y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Taxa de Arrecadação (%)' }, ticks: { callback: (value) => `${value}%` } } } } },
            damsPaidStatusChart: { type: 'pie', options: defaultOptions() },
            delayDistributionChart: { type: 'bar', options: defaultOptions() },
            revenueCompositionChart: { type: 'doughnut', options: defaultOptions(true) },
            valueVsDelayScatterChart: { type: 'scatter', options: { ...defaultOptions(true), scales: { x: { ...defaultOptions().scales.x, title: { display: true, text: 'Dias em Atraso' } }, y: { ...defaultOptions(true).scales.y, title: { display: true, text: 'Valor do DAM (R$)' } } } } },
            monthlyDamStatusChart: { type: 'bar', options: { ...defaultOptions(), scales: { x: { stacked: true }, y: { stacked: true } } } }
        };
        
        for (const [id, config] of Object.entries(chartConfigs)) {
            const canvas = document.getElementById(id);
if (canvas) charts[id] = new Chart(canvas, { type: config.type, data: {}, options: config.options });
        }
    };
    
    const updateCharts = (data) => {
        const { kpis, analytics } = data;
        const colors = { sky: '#0ea5e9', green: '#10b981', red: '#ef4444', orange: '#f97316', purple: '#8b5cf6', teal: '#14b8a6', yellow: '#eab308' };

        const valorPrincipal = kpis.valorArrecadado - kpis.multas - kpis.juros;
        charts.totalValuesChart.data = {
            labels: ['Valor Emitido', 'Valor Arrecadado', 'Principal', 'Multas', 'Correções', 'Descontos'],
            datasets: [{ label: 'Valor Total (R$)', data: [kpis.valorEmitido, kpis.valorArrecadado, valorPrincipal, kpis.multas, kpis.juros, kpis.descontos], backgroundColor: [colors.sky, colors.green, colors.teal, colors.orange, colors.purple, colors.yellow] }]
        };
        charts.monthlyEvolutionChart.data = {
            labels: analytics.evolucaoMensal.labels,
            datasets: [
                { label: 'Emitido', data: analytics.evolucaoMensal.emitido, borderColor: colors.sky, tension: 0.3, fill: false },
                { label: 'Arrecadado', data: analytics.evolucaoMensal.arrecadado, borderColor: colors.green, tension: 0.3, fill: false },
                { label: 'Multas', data: analytics.evolucaoMensal.multas, borderColor: colors.orange, tension: 0.3, fill: false, hidden: true },
            ]
        };

        const taxaArrecadacao = (kpis.valorArrecadado / kpis.valorEmitido) * 100;
        charts.collectionPercentageChart.data = { datasets: [{ data: [taxaArrecadacao, 100 - taxaArrecadacao], backgroundColor: [colors.green, '#e2e8f0'], borderWidth: 0 }] };
        document.getElementById('gauge-text').innerHTML = `<div class="text-3xl lg:text-4xl font-bold text-slate-800">${taxaArrecadacao.toFixed(1)}%</div><div class="text-sm text-slate-500">do valor emitido</div>`;

        const maxValor = Math.max(...analytics.efetividadeFaixaValor.valorArrecadado);
        const maxIndex = analytics.efetividadeFaixaValor.valorArrecadado.indexOf(maxValor);
        const barColors = analytics.efetividadeFaixaValor.labels.map((_, index) => index === maxIndex ? colors.teal : `${colors.teal}80`);
        charts.effectivenessByValueRangeChart.data = {
            labels: analytics.efetividadeFaixaValor.labels,
            datasets: [
                { type: 'bar', label: 'Valor Arrecadado (R$)', data: analytics.efetividadeFaixaValor.valorArrecadado, backgroundColor: barColors, yAxisID: 'y' },
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
            labels: ['Principal', 'Multas', 'Correções', 'Descontos (abatidos)'],
            datasets: [{ data: [valorPrincipal, kpis.multas, kpis.juros, kpis.descontos], backgroundColor: [colors.teal, colors.orange, colors.purple, colors.yellow] }]
        };
        charts.valueVsDelayScatterChart.data = {
            datasets: [{ label: 'DAM', data: analytics.valorVsAtraso, backgroundColor: `${colors.red}B3` }]
        };
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
    
    document.getElementById('toggle-filtros-avancados').addEventListener('click', () => {
        document.getElementById('filtros-avancados').classList.toggle('hidden');
    });

    initCharts();
    updateDashboard(mockData[currentDataKey]);
});