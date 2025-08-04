document.addEventListener('DOMContentLoaded', () => {

    let currentDataKey = 'arrecadacao2024';
    const charts = {};
    let modalChart = null;

    /**
     * Clona um objeto profundamente, incluindo objetos aninhados, arrays e funções.
     * @param {any} obj O objeto a ser clonado.
     * @returns {any} Uma cópia profunda do objeto.
     */
    const deepClone = (obj) => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (Array.isArray(obj)) {
            return obj.map(item => deepClone(item));
        }

        const newObj = {};
        for (const key in obj) {
            // Usando Object.prototype.hasOwnProperty.call para segurança
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = deepClone(obj[key]);
            }
        }
        return newObj;
    };


    // Funções de formatação
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value);

    // Dados fictícios (MOCK DATA) para demonstração.
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
                    { nome: 'CONSTRUTora E', cnpj_cpf: '55.666.777/0001-88', total: 880000 },
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
            contribuinteAnalytics: {
                qtdFisico: 18500,
                valorFisico: 12500000,
                qtdJuridico: 62800,
                valorJuridico: 66050000,
                topAdimplentes: [
                    { nome: 'EMPRESA A LTDA', cnpj_cpf: '11.222.333/0001-44', total: 2500000 },
                    { nome: 'SUPERMERCADO B S.A.', cnpj_cpf: '22.333.444/0001-55', total: 1800000 },
                    { nome: 'INDÚSTRIA C', cnpj_cpf: '33.444.555/0001-66', total: 1265000 },
                    { nome: 'HOSPITAL D', cnpj_cpf: '44.555.666/0001-77', total: 950000 },
                    { nome: 'CONSTRUTora E', cnpj_cpf: '55.666.777/0001-88', total: 880000 },
                    { nome: 'UNIVERSIDADE F', cnpj_cpf: '66.777.888/0001-99', total: 760000 },
                    { nome: 'LOGÍSTICA G', cnpj_cpf: '77.888.999/0001-00', total: 710000 },
                    { nome: 'COMÉRCIO H', cnpj_cpf: '88.999.000/0001-11', total: 665000 },
                    { nome: 'EMPRESA I', cnpj_cpf: '99.000.111/0001-22', total: 620000 },
                    { nome: 'PESSOA FÍSICA ADIMPLENTE', cnpj_cpf: '111.222.333-44', total: 595000 },
                ],
                porte: {
                    labels: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
                    valores: [3500000, 22000000, 28550000, 12000000],
                },
                evolucaoTipo: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    fisico: [2083333, 2083333, 2083333, 2083333, 2083333, 2083335],
                    juridico: [11008333, 11008333, 11008333, 11008333, 11008333, 11008335],
                }
            },
            analytics: {
                evolucaoMensal: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    emitido: [16333333, 16333333, 16333333, 16333333, 16333333, 16333335],
                    arrecadado: [13091666, 13091666, 13091666, 13091666, 13091666, 13091670],
                },
                efetividadeFaixaValor: {
                    labels: ['Até R$100', 'R$101 - R$200', 'R$201 - R$500', 'R$501 - R$1.000', 'Acima de R$1.000'],
                    valorArrecadado: [3000000, 5000000, 7000000, 10000000, 53550000],
                    taxaArrecadacao: [98, 95, 92, 88, 70],
                    qtdDams: [25000, 20000, 18000, 10000, 8300]
                },
                distribuicaoAtraso: { labels: ['1-15 dias', '16-30 dias', '31-60 dias', '61-90 dias', '90+ dias'], qtdDams: [12000, 7500, 3500, 1500, 900] },
                valorVsAtraso: [ { x: 5, y: 350 }, { x: 35, y: 1500 }, { x: 65, y: 15000 } ],
                damsStatusMensal: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], emitidos: [15866, 15866, 15866, 15866, 15866, 15870], pagosDia: [9316, 9316, 9316, 9316, 9316, 9320], pagosAtraso: [4233, 4233, 4233, 4233, 4233, 4235], }
            },
            dadosBancarios: {
                kpis: {
                    valorTarifaTotal: 150000,
                    custoPercentual: (150000 / 78550000) * 100,
                    tempoMedioCompensacao: { 'Banco do Brasil': 1.2, 'Caixa Econômica': 2.1, 'Itaú': 1.8, 'Outros': 3.0 },
                },
                arrecadacaoPorBanco: {
                    labels: ['Banco do Brasil', 'Caixa Econômica', 'Itaú', 'Outros'],
                    valores: [35000000, 28000000, 10000000, 5500000],
                    quantidades: [40000, 30000, 8000, 3300],
                },
                valoresAdicionaisPorBanco: {
                    labels: ['Banco do Brasil', 'Caixa Econômica', 'Itaú', 'Outros'],
                    multas: [400000, 300000, 100000, 50000],
                    juros: [550000, 450000, 150000, 50000],
                    correcoes: [600000, 400000, 150000, 50000],
                }
            },
            dadosGeograficos: {
                kpis: {
                    qtdBairros: 45,
                    qtdDistritos: 8,
                    arrecadacaoRural: 15000000,
                    arrecadacaoUrbana: 63550000,
                },
                arrecadacaoPorBairro: {
                    labels: ['Centro', 'Bairro Novo', 'Industrial', 'Jardim Primavera', 'Setor Leste', 'Vila Real', 'Centro Histórico', 'Água Branca', 'Nova Cidade', 'Santa Clara'],
                    valores: [15000000, 12000000, 9500000, 8200000, 6800000, 5500000, 4100000, 3500000, 2800000, 2500000],
                },
                arrecadacaoPorZona: {
                    labels: ['Urbana', 'Rural'],
                    valores: [63550000, 15000000],
                    quantidades: [68000, 13300]
                },
                damsBairro: {
                    labels: ['Centro', 'Bairro Novo', 'Industrial', 'Jardim Primavera', 'Setor Leste'],
                    emitidos: [18000, 15000, 11000, 9500, 8000],
                    arrecadados: [16500, 13800, 9800, 8800, 7500],
                },
                arrecadacaoPorSetor: {
                    labels: ['Comércio e Serviços', 'Indústria', 'Imobiliário', 'Agropecuária', 'Outros'],
                    valores: [35000000, 25000000, 10000000, 5000000, 3550000],
                },
                arrecadacaoPorDistrito: {
                    labels: ['Distrito Central', 'Distrito Norte', 'Distrito Sul', 'Distrito Leste', 'Distrito Oeste', 'Distrito Rural 1', 'Distrito Rural 2', 'Distrito Rural 3'],
                    valores: [25000000, 18000000, 15000000, 10000000, 5550000, 2500000, 2000000, 5000000],
                },
            },
            extratos: {
                kpis: {
                    extratosEmitidos: 250000,
                    extratosBaixados: 195000,
                    valorEmitido: 155000000,
                    valorArrecadado: 132000000,
                },
                evolucaoMensal: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    emitidos: [40000, 42000, 45000, 35000, 48000, 40000],
                    arrecadados: [32000, 35000, 38000, 28000, 40000, 35000],
                },
                statusValor: {
                    labels: ['Valor Emitido', 'Valor Arrecadado'],
                    valores: [155000000, 132000000],
                }
            },
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
            }
        },
    };

    const createKpiCard = (kpi) => {
        const color = kpi.color || 'sky';
        return `<div class="kpi-card"><div class="kpi-icon-wrapper bg-${color}-100"><i class="fa-solid ${kpi.icon} text-${color}-600"></i></div><div><div class="kpi-label">${kpi.label}</div><div class="kpi-value">${kpi.value}</div></div></div>`;
    };

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

    const populateAngelistTable = (data) => {
        const tableBody = document.getElementById('faixas-valor-tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const faixasData = data.analytics.efetividadeFaixaValor;
        faixasData.labels.forEach((label, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td class="text-sm font-medium text-gray-900 px-6 py-4">${label}</td>
                    <td class="text-sm text-gray-500 px-6 py-4">${formatCurrency(faixasData.valorArrecadado[index])}</td>
                    <td class="text-sm text-gray-500 px-6 py-4">${formatNumber(faixasData.qtdDams[index])}</td>
                </tr>`;
        });
    };

    const updateInfoBar = () => {
        const infoBar = document.getElementById('info-bar');
        const form = document.getElementById('filtro-form');
        const formData = new FormData(form);

        const getSelectedOptions = (id) => {
            const select = document.getElementById(id);
            if (select.multiple) {
                return Array.from(select.selectedOptions).map(opt => opt.text);
            }
            return select.selectedIndex !== -1 ? [select.options[select.selectedIndex].text] : [];
        };

        const filters = [
            { id: 'tributo-conta', label: 'Tributos', icon: 'fa-file-invoice-dollar' },
            { id: 'receita', label: 'Receita', icon: 'fa-barcode' },
            { id: 'tipo-receita', label: 'Tipo', icon: 'fa-tags' },
            { id: 'porte-contribuinte', label: 'Porte', icon: 'fa-building' },
            { id: 'setor-economico', label: 'Setor', icon: 'fa-industry' },
            { id: 'banco', label: 'Banco', icon: 'fa-university' },
            { id: 'bairro', label: 'Bairros', icon: 'fa-map-marker-alt' },
            { id: 'divida-ativa', label: 'Dívida Ativa', icon: 'fa-gavel' },
        ];

        infoBar.innerHTML = '';

        let content = '';

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

    const updateContribuinteKpis = (data) => {
        const kpiContainer = document.getElementById('kpi-contribuinte');
        if (!kpiContainer) return;

        const totalValor = data.valorFisico + data.valorJuridico;
        const percentualFisico = totalValor > 0 ? (data.valorFisico / totalValor) * 100 : 0;
        const percentualJuridico = totalValor > 0 ? (data.valorJuridico / totalValor) * 100 : 0;

        const kpisContribuinte = [
            { label: 'Qtd. Pessoa Física', value: formatNumber(data.qtdFisico), icon: 'fa-user', color: 'blue' },
            { label: 'Valor Pessoa Física', value: formatCurrency(data.valorFisico), icon: 'fa-wallet', color: 'sky' },
            { label: '% Arrecadação P. Física', value: `${percentualFisico.toFixed(1)}%`, icon: 'fa-user-check', color: 'teal' },
            { label: 'Qtd. Pessoa Jurídica', value: formatNumber(data.qtdJuridico), icon: 'fa-building', color: 'indigo' },
            { label: 'Valor Pessoa Jurídica', value: formatCurrency(data.valorJuridico), icon: 'fa-sack-dollar', color: 'purple' },
            { label: '% Arrecadação P. Jurídica', value: `${percentualJuridico.toFixed(1)}%`, icon: 'fa-building-check', color: 'green' },
            { label: 'Quantidade Contribuinte Mobiliário', value: formatNumber(data.qtdJuridico), icon: 'fa-cash-register', color: 'slate' },
            { label: 'Valor R$ Arrecadação Mobiliário', value: formatCurrency(data.valorJuridico), icon: 'fa-industry', color: 'slate' }
        ];
        
        kpiContainer.innerHTML = kpisContribuinte.map((kpi, i) => createKpiCard({ ...kpi, delay: i })).join('');
    };

    const updateKpisBancarios = (data, kpisGerais) => {
        document.getElementById('kpi-tarifa-total').textContent = formatCurrency(data.kpis.valorTarifaTotal);
        document.getElementById('kpi-custo-percentual').textContent = `${data.kpis.custoPercentual.toFixed(2)}%`;
    
        const totalDamsArrecadados = kpisGerais.damsArrecadados;
        const tarifaMedia = totalDamsArrecadados > 0 ? data.kpis.valorTarifaTotal / totalDamsArrecadados : 0;
        document.getElementById('kpi-tarifa-media').textContent = `${formatCurrency(tarifaMedia)} por DAM`;
    
        const eficiencias = data.arrecadacaoPorBanco.labels.map((banco, i) => ({
            nome: banco,
            valor: data.arrecadacaoPorBanco.quantidades[i] > 0 ? data.arrecadacaoPorBanco.valores[i] / data.arrecadacaoPorBanco.quantidades[i] : 0
        }));
        const maisEficiente = eficiencias.reduce((prev, current) => (prev.valor > current.valor) ? prev : current);
        document.getElementById('kpi-eficiencia-bancaria').textContent = `${maisEficiente.nome.split(' ')[0]} – ${formatCurrency(maisEficiente.valor)}/DAM`;
    
        const totalArrecadado = kpisGerais.valorArrecadado;
        const participacoes = data.arrecadacaoPorBanco.labels.map((banco, i) => ({
            nome: banco,
            percentual: totalArrecadado > 0 ? (data.arrecadacaoPorBanco.valores[i] / totalArrecadado) * 100 : 0
        }));
        const maiorParticipacao = participacoes.reduce((prev, current) => (prev.percentual > current.percentual) ? prev : current);
        document.getElementById('kpi-participacao-total').textContent = `${maiorParticipacao.nome.split(' ')[0]}: ${maiorParticipacao.percentual.toFixed(1)}% do total`;
    
        const tempos = Object.entries(data.kpis.tempoMedioCompensacao).map(([banco, dias]) => ({ banco, dias }));
        const menorTempo = tempos.reduce((prev, current) => (prev.dias < current.dias) ? prev : current);
        document.getElementById('kpi-tempo-compensacao').textContent = `Menor: ${menorTempo.banco.split(' ')[0]} (${menorTempo.dias.toFixed(1)} dias)`;
    };

    const updateKpisGeograficos = (data) => {
        document.getElementById('kpi-qtd-zona-urbana').textContent = formatNumber(data.arrecadacaoPorZona.quantidades[0]);
        document.getElementById('kpi-qtd-zona-rural').textContent = formatNumber(data.arrecadacaoPorZona.quantidades[1]);
        document.getElementById('kpi-arrecadacao-rural').textContent = formatCurrency(data.kpis.arrecadacaoRural);
        document.getElementById('kpi-arrecadacao-urbana').textContent = formatCurrency(data.kpis.arrecadacaoUrbana);
    };
    
    const updateKpisExtratos = (data) => {
        document.getElementById('kpi-extratos-emitidos').textContent = formatNumber(data.kpis.extratosEmitidos);
        document.getElementById('kpi-extratos-baixados').textContent = formatNumber(data.kpis.extratosBaixados);
        document.getElementById('kpi-extratos-valor-emitido').textContent = formatCurrency(data.kpis.valorEmitido);
        document.getElementById('kpi-extratos-valor-arrecadado').textContent = formatCurrency(data.kpis.valorArrecadado);
    };

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
        
        updateContribuinteKpis(data.contribuinteAnalytics);
        populateRankingTable('top-10-adimplentes-tbody', data.contribuinteAnalytics.topAdimplentes);
        updateKpisBancarios(data.dadosBancarios, data.kpis);
        updateKpisGeograficos(data.dadosGeograficos);
        updateKpisExtratos(data.extratos);
    };

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
            monthlyDamStatusChart: { type: 'bar', options: { ...defaultOptions(), scales: { x: { stacked: true }, y: { stacked: true } } } },
            pfVsPjChart: { type: 'bar', options: { ...defaultOptions(), indexAxis: 'y' } },
            porteChart: { type: 'doughnut', options: defaultOptions(true) },
            evolucaoTipoContribuinteChart: { type: 'line', options: defaultOptions(true) },
            arrecadacaoPorBancoChart: { type: 'bar', options: { ...defaultOptions(true), scales: { 'y-valor': { type: 'linear', position: 'left', beginAtZero: true, ticks: { callback: (v) => formatCurrency(v) } }, 'y-quantidade': { type: 'linear', position: 'right', beginAtZero: true, grid: { drawOnChartArea: false } } } } },
            valoresAdicionaisPorBancoChart: { type: 'bar', options: defaultOptions(true) },
            arrecadacaoPorBairroChart: { type: 'bar', options: defaultOptions(true) },
            arrecadacaoPorZonaChart: { type: 'doughnut', options: defaultOptions(true) },
            damsBairroChart: { type: 'bar', options: defaultOptions() },
            arrecadacaoPorSetorChart: { type: 'pie', options: defaultOptions(true) },
            arrecadacaoPorDistritoChart: { type: 'bar', options: defaultOptions(true) },
            evolucaoExtratosChart: { type: 'line', options: defaultOptions() },
            extratosStatusValorChart: { type: 'doughnut', options: defaultOptions(true) },
        };

        for (const [id, config] of Object.entries(chartConfigs)) {
            const canvas = document.getElementById(id);
            if (canvas) {
                // **MUDANÇA APLICADA AQUI**
                // Guardamos a configuração original (pura) antes de criar o gráfico.
                charts[id] = new Chart(canvas, {
                    type: config.type,
                    data: {},
                    options: deepClone(config.options) // Usamos uma cópia profunda para a instância do gráfico
                });
                // Armazenamos a configuração pura para ser usada depois pela modal.
                charts[id].pristineConfig = config;
            }
        }
    };

    const updateCharts = (data) => {
        const { kpis, analytics, contribuinteAnalytics, dadosBancarios, dadosGeograficos, extratos } = data;
        const colors = { sky: '#0ea5e9', green: '#10b981', red: '#ef4444', orange: '#f97316', purple: '#8b5cf6', teal: '#14b8a6', yellow: '#eab308', indigo: '#4f46e5', blue: '#3b82f6' };

        if(charts.totalValuesChart) charts.totalValuesChart.data = {
            labels: ['Emitido', 'Arrecadado'],
            datasets: [{ label: 'Valor (R$)', data: [kpis.valorEmitido, kpis.valorArrecadado], backgroundColor: [colors.sky, colors.green] }]
        };
        if(charts.monthlyEvolutionChart) charts.monthlyEvolutionChart.data = {
            labels: analytics.evolucaoMensal.labels,
            datasets: [
                { label: 'Emitido', data: analytics.evolucaoMensal.emitido, borderColor: colors.sky, tension: 0.3 },
                { label: 'Arrecadado', data: analytics.evolucaoMensal.arrecadado, borderColor: colors.green, tension: 0.3 },
            ]
        };

        const taxaArrecadacao = kpis.taxaArrecadacao;
        if(charts.collectionPercentageChart) charts.collectionPercentageChart.data = {
            labels: ['Arrecadado', 'Não Arrecadado'],
            datasets: [{ data: [taxaArrecadacao, 100 - taxaArrecadacao], backgroundColor: [colors.green, '#e2e8f0'], borderWidth: 0 }]
        };
        document.getElementById('gauge-text').innerHTML = `<div class="text-3xl lg:text-4xl font-bold text-slate-800">${taxaArrecadacao.toFixed(1)}%</div><div class="text-sm text-slate-500">do valor emitido</div>`;

        if(charts.effectivenessByValueRangeChart) charts.effectivenessByValueRangeChart.data = {
            labels: analytics.efetividadeFaixaValor.labels,
            datasets: [
                { type: 'bar', label: 'Valor Arrecadado (R$)', data: analytics.efetividadeFaixaValor.valorArrecadado, backgroundColor: `${colors.teal}80`, yAxisID: 'y' },
                { type: 'line', label: 'Taxa de Arrecadação (%)', data: analytics.efetividadeFaixaValor.taxaArrecadacao, borderColor: colors.purple, yAxisID: 'y1', tension: 0.2 }
            ]
        };

        const damsPagosDia = kpis.damsArrecadados - kpis.damsPagosAtraso;
        if(charts.damsPaidStatusChart) charts.damsPaidStatusChart.data = {
            labels: [`Pagos em Dia (${formatNumber(damsPagosDia)})`, `Pagos com Atraso (${formatNumber(kpis.damsPagosAtraso)})`],
            datasets: [{ data: [damsPagosDia, kpis.damsPagosAtraso], backgroundColor: [colors.green, colors.orange] }]
        };
        if(charts.delayDistributionChart) charts.delayDistributionChart.data = {
            labels: analytics.distribuicaoAtraso.labels,
            datasets: [{ label: 'Quantidade de DAMs', data: analytics.distribuicaoAtraso.qtdDams, backgroundColor: colors.orange }]
        };
        if(charts.revenueCompositionChart) charts.revenueCompositionChart.data = {
            labels: ['Principal', 'Multas', 'Juros', 'Correção Monetária'],
            datasets: [{ data: [kpis.valorArrecadado - kpis.multas - kpis.juros, kpis.multas, kpis.juros, kpis.correcaoMonetaria], backgroundColor: [colors.teal, colors.orange, colors.purple, colors.yellow] }]
        };
        if(charts.valueVsDelayScatterChart) charts.valueVsDelayScatterChart.data = { datasets: [{ label: 'DAM', data: analytics.valorVsAtraso, backgroundColor: `${colors.red}B3` }] };

        const damsNaoPagos = analytics.damsStatusMensal.emitidos.map((e, i) => e - (analytics.damsStatusMensal.pagosDia[i] + analytics.damsStatusMensal.pagosAtraso[i]));
        if(charts.monthlyDamStatusChart) charts.monthlyDamStatusChart.data = {
            labels: analytics.damsStatusMensal.labels,
            datasets: [
                { label: 'Pago em Dia', data: analytics.damsStatusMensal.pagosDia, backgroundColor: colors.green },
                { label: 'Pago com Atraso', data: analytics.damsStatusMensal.pagosAtraso, backgroundColor: colors.orange },
                { label: 'Não Pago', data: damsNaoPagos, backgroundColor: colors.red },
            ]
        };

        if (charts.pfVsPjChart) {
            charts.pfVsPjChart.data = {
                labels: ['Pessoa Física', 'Pessoa Jurídica'],
                datasets: [
                    { label: 'Valor Arrecadado (R$)', data: [contribuinteAnalytics.valorFisico, contribuinteAnalytics.valorJuridico], backgroundColor: colors.teal, barPercentage: 0.6 },
                    { label: 'Quantidade de DAMs', data: [contribuinteAnalytics.qtdFisico, contribuinteAnalytics.qtdJuridico], backgroundColor: colors.sky, barPercentage: 0.6 }
                ]
            };
        }
        if (charts.porteChart) {
            charts.porteChart.data = {
                labels: contribuinteAnalytics.porte.labels,
                datasets: [{ data: contribuinteAnalytics.porte.valores, backgroundColor: [colors.indigo, colors.purple, colors.sky, colors.teal] }]
            };
        }
        if (charts.evolucaoTipoContribuinteChart) {
            charts.evolucaoTipoContribuinteChart.data = {
                labels: contribuinteAnalytics.evolucaoTipo.labels,
                datasets: [
                    { label: 'Pessoa Física', data: contribuinteAnalytics.evolucaoTipo.fisico, borderColor: colors.blue, tension: 0.3 },
                    { label: 'Pessoa Jurídica', data: contribuinteAnalytics.evolucaoTipo.juridico, borderColor: colors.indigo, tension: 0.3 },
                ]
            };
        }
        if (charts.arrecadacaoPorBancoChart) {
            charts.arrecadacaoPorBancoChart.data = {
                labels: dadosBancarios.arrecadacaoPorBanco.labels,
                datasets: [
                    { label: 'Valor Arrecadado', data: dadosBancarios.arrecadacaoPorBanco.valores, backgroundColor: colors.blue, yAxisID: 'y-valor' },
                    { label: 'Quantidade de DAMs', data: dadosBancarios.arrecadacaoPorBanco.quantidades, backgroundColor: colors.teal, yAxisID: 'y-quantidade' }
                ]
            };
        }
        if (charts.valoresAdicionaisPorBancoChart) {
             charts.valoresAdicionaisPorBancoChart.data = {
                labels: dadosBancarios.valoresAdicionaisPorBanco.labels,
                datasets: [
                    { label: 'Multa', data: dadosBancarios.valoresAdicionaisPorBanco.multas, backgroundColor: colors.orange },
                    { label: 'Juros', data: dadosBancarios.valoresAdicionaisPorBanco.juros, backgroundColor: colors.red },
                    { label: 'Correção Monetária', data: dadosBancarios.valoresAdicionaisPorBanco.correcoes, backgroundColor: colors.purple },
                ]
            };
        }
        
        if (charts.arrecadacaoPorBairroChart) {
            charts.arrecadacaoPorBairroChart.data = {
                labels: dadosGeograficos.arrecadacaoPorBairro.labels,
                datasets: [{ label: 'Valor Arrecadado (R$)', data: dadosGeograficos.arrecadacaoPorBairro.valores, backgroundColor: colors.blue, barPercentage: 0.6 }]
            };
        }

        if (charts.arrecadacaoPorZonaChart) {
             charts.arrecadacaoPorZonaChart.data = {
                labels: dadosGeograficos.arrecadacaoPorZona.labels,
                datasets: [{ label: 'Valor Arrecadado (R$)', data: dadosGeograficos.arrecadacaoPorZona.valores, backgroundColor: [colors.indigo, colors.teal] }]
            };
        }

        if (charts.damsBairroChart) {
             charts.damsBairroChart.data = {
                labels: dadosGeograficos.damsBairro.labels,
                datasets: [
                    { label: 'DAMs Emitidos', data: dadosGeograficos.damsBairro.emitidos, backgroundColor: colors.sky },
                    { label: 'DAMs Arrecadados', data: dadosGeograficos.damsBairro.arrecadados, backgroundColor: colors.green },
                ]
            };
        }

        if (charts.arrecadacaoPorSetorChart) {
             charts.arrecadacaoPorSetorChart.data = {
                labels: dadosGeograficos.arrecadacaoPorSetor.labels,
                datasets: [{ data: dadosGeograficos.arrecadacaoPorSetor.valores, backgroundColor: [colors.teal, colors.indigo, colors.yellow, colors.green, colors.gray] }]
            };
        }

        if (charts.arrecadacaoPorDistritoChart) {
             charts.arrecadacaoPorDistritoChart.data = {
                labels: dadosGeograficos.arrecadacaoPorDistrito.labels,
                datasets: [{ label: 'Valor Arrecadado (R$)', data: dadosGeograficos.arrecadacaoPorDistrito.valores, backgroundColor: colors.purple, barPercentage: 0.6 }]
            };
        }
        
        if (charts.evolucaoExtratosChart) {
            charts.evolucaoExtratosChart.data = {
                labels: extratos.evolucaoMensal.labels,
                datasets: [
                    { label: 'Extratos Emitidos', data: extratos.evolucaoMensal.emitidos, borderColor: colors.sky, tension: 0.3 },
                    { label: 'Extratos Baixados', data: extratos.evolucaoMensal.arrecadados, borderColor: colors.green, tension: 0.3 },
                ]
            };
        }
        
        if (charts.extratosStatusValorChart) {
            charts.extratosStatusValorChart.data = {
                labels: extratos.statusValor.labels,
                datasets: [{ data: extratos.statusValor.valores, backgroundColor: [colors.sky, colors.green] }]
            };
        }

        Object.values(charts).forEach(chart => {
            if (chart) chart.update();
        });
    };

    const chartModal = document.getElementById('chart-modal');
    const modalContent = document.getElementById('modal-content');
    const chartModalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalTableContainer = document.getElementById('modal-table-container');
    const contribuinteModal = document.getElementById('contribuinte-modal');
    const contribuinteModalCloseBtn = document.getElementById('contribuinte-modal-close-btn');

    const generateModalTable = (originalChart) => {
        const { data, pristineConfig } = originalChart;
        const type = pristineConfig.type;

        let tableHTML = '<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>';
        let headers = [];
        let rowsHTML = '';

        try {
            if (!data || !data.datasets || data.datasets.length === 0) {
                throw new Error("Dados do gráfico ausentes ou inválidos.");
            }

            if (type === 'scatter') {
                headers = ['Dias em Atraso', 'Valor (R$)'];
                headers.forEach(h => tableHTML += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${h}</th>`);
                tableHTML += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
                
                if (data.datasets[0] && data.datasets[0].data) {
                    data.datasets[0].data.forEach(point => {
                        rowsHTML += `<tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">${point.x}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">${formatCurrency(point.y)}</td>
                        </tr>`;
                    });
                }
            } else if (type === 'pie' || type === 'doughnut') {
                headers = ['Categoria', 'Valor'];
                headers.forEach(h => tableHTML += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${h}</th>`);
                tableHTML += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
                
                if (data.labels && data.datasets[0] && data.datasets[0].data) {
                    const isCurrencyData = data.datasets[0].data.some(v => v > 1000) && !pristineConfig.options.plugins?.tooltip?.enabled === false;
                    data.labels.forEach((label, index) => {
                        const value = data.datasets[0].data[index];
                        let formattedValue = isCurrencyData ? formatCurrency(value) : formatNumber(value);
                        
                        if (originalChart.canvas.id === 'collectionPercentageChart') {
                            formattedValue = `${value.toFixed(1)}%`;
                        }
                        
                        rowsHTML += `<tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${label}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">${formattedValue}</td>
                        </tr>`;
                    });
                }
            } else { 
                if (!data.labels) throw new Error("Rótulos (labels) ausentes para este tipo de gráfico.");

                headers = ['Categoria', ...data.datasets.map(d => d.label || '')];
                headers.forEach(h => tableHTML += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${h}</th>`);
                tableHTML += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
                
                data.labels.forEach((label, index) => {
                    let row = `<tr><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${label}</td>`;
                    data.datasets.forEach(dataset => {
                        const value = dataset.data[index];
                        const labelLower = (dataset.label || '').toLowerCase();
                        let formattedValue;

                        if (labelLower.includes('taxa') || labelLower.includes('%')) {
                            formattedValue = `${formatNumber(value)}%`;
                        } else if (labelLower.includes('valor') || labelLower.includes('r$')) {
                            formattedValue = formatCurrency(value);
                        } else {
                            formattedValue = formatNumber(value);
                        }
                        row += `<td class="px-6 py-4 whitespace-nowrap text-sm">${formattedValue}</td>`;
                    });
                    row += '</tr>';
                    rowsHTML += row;
                });
            }
            tableHTML += rowsHTML + '</tbody></table>';
        } catch (e) {
            console.error("Erro ao gerar tabela para o gráfico:", originalChart.canvas.id, e);
            tableHTML = `<div class="p-4 text-center text-red-500">Ocorreu um erro ao gerar a tabela de dados. Verifique o console para mais detalhes.</div>`;
        }

        modalTableContainer.innerHTML = tableHTML;
    };

    const openChartModal = (chartId) => {
        try {
            const originalChart = charts[chartId];
            if (!originalChart || !originalChart.pristineConfig) {
                console.error(`Gráfico ou configuração pura com ID '${chartId}' não encontrado.`);
                return;
            }

            const chartTitleElement = document.querySelector(`[data-chart-id="${chartId}"]`);
            const chartTitleText = chartTitleElement.closest('.chart-article').querySelector('.chart-title span').textContent;
            modalTitle.textContent = chartTitleText;

            const modalCanvas = document.getElementById('modal-chart');
            if (modalChart) modalChart.destroy();
            
            // **MUDANÇA APLICADA AQUI**
            // Usando deepClone na configuração original e pura, não na instância "viva".
            const newOptions = deepClone(originalChart.pristineConfig.options);
            newOptions.maintainAspectRatio = false;

            modalChart = new Chart(modalCanvas, {
                type: originalChart.pristineConfig.type,
                data: deepClone(originalChart.data),
                options: newOptions 
            });
            
            generateModalTable(originalChart);
            
            chartModal.classList.add('visible');
        } catch (error) {
            console.error(`Falha ao abrir a modal para o gráfico '${chartId}':`, error);
            alert(`Ocorreu um erro ao tentar abrir os detalhes do gráfico. Verifique o console (F12) para mais informações.`);
        }
    };

    const closeChartModal = () => {
        chartModal.classList.remove('visible');
        if (modalChart) {
            modalChart.destroy();
            modalChart = null;
        }
    };

    const openContribuinteModal = (cnpjCpf, nome) => {
        const contribuinteInfoSpan = document.getElementById('contribuinte-info');
        contribuinteInfoSpan.textContent = `${cnpjCpf} - ${nome}`;
        const damsTbody = document.getElementById('dams-contribuinte-tbody');
        damsTbody.innerHTML = '';
        const dams = mockData.arrecadacao2024.dams[cnpjCpf] || [];
        if (dams.length === 0) {
            damsTbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-gray-500">Nenhum DAM encontrado para este contribuinte.</td></tr>`;
        } else {
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
        }
        contribuinteModal.classList.add('visible');
    };

    const closeContribuinteModal = () => {
        contribuinteModal.classList.remove('visible');
    };

    document.getElementById('filtro-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateDashboard(mockData[currentDataKey]);
    });

    document.getElementById('toggle-filtros-avancados').addEventListener('click', () => {
        document.getElementById('filtros-avancados').classList.toggle('hidden');
    });

    document.querySelector('main').addEventListener('click', (e) => {
        const detailsButton = e.target.closest('.details-btn');
        if (detailsButton) {
            const chartId = detailsButton.dataset.chartId;
            if (chartId) openChartModal(chartId);
            return;
        }
        const clickableRow = e.target.closest('.table-row-clickable');
        if (clickableRow && clickableRow.dataset.cnpjCpf) {
            openContribuinteModal(clickableRow.dataset.cnpjCpf, clickableRow.dataset.nome);
            return;
        }
    });

    chartModalCloseBtn.addEventListener('click', closeChartModal);
    chartModal.addEventListener('click', (e) => {
        if (e.target === chartModal) closeChartModal();
    });

    contribuinteModalCloseBtn.addEventListener('click', closeContribuinteModal);
    contribuinteModal.addEventListener('click', (e) => {
        if (e.target === contribuinteModal) closeContribuinteModal();
    });

    initCharts();
    updateDashboard(mockData[currentDataKey]);
});