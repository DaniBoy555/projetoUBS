
// scripts/extract_pec.ts

// Simulação de dependências (em um ambiente real, usaríamos 'pg' e 'dotenv')
// Para rodar este script: npx ts-node scripts/extract_pec.ts

// Configuração da URL da Edge Function (Ajustar se necessario para produção)
const INGEST_API_URL = process.env.INGEST_API_URL || 'http://127.0.0.1:54321/functions/v1/ingest-data';
// Chave anon local obtida via `npx supabase status -o json` (JWT Válido)
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Interfaces para tipagem dos dados mockados do PEC
interface AtendimentoPec {
    id_atendimento: string;
    data_atendimento: string;
    cns_profissional: string;
    cbo_profissional: string;
    cns_paciente: string;
    sexo_paciente: string;
    data_nascimento_paciente: string;
    diagnosticos: string[]; // CIDs
    procedimentos: string[]; // Códigos SIGTAP
    tipo_atendimento: 'CONSULTA' | 'VISITA' | 'PROCEDIMENTO';
}

// 1. Simulação da Conexão e Query ao Banco do PEC (PostgreSQL externo)
async function fetchNewDataFromPec(): Promise<AtendimentoPec[]> {
    console.log('🔌 Conectando ao banco PEC simulado...');

    // Mock de delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🔍 Buscando novos atendimentos na tabela tb_fat_atendimento_individual...');

    // Gerando dados aleatórios para simular extração real
    const mockData: AtendimentoPec[] = [
        {
            id_atendimento: crypto.randomUUID(),
            data_atendimento: new Date().toISOString(),
            cns_profissional: '700000000000001',
            cbo_profissional: '225103', // Médico da Estratégia de Saúde da Família
            cns_paciente: '898001147563148',
            sexo_paciente: 'F',
            data_nascimento_paciente: '1985-10-20',
            diagnosticos: ['J00', 'I10'], // Resfriado, Hipertensão
            procedimentos: ['0301010072'], // Consulta médica em atenção básica
            tipo_atendimento: 'CONSULTA'
        },
        {
            id_atendimento: crypto.randomUUID(),
            data_atendimento: new Date().toISOString(),
            cns_profissional: '700000000000002',
            cbo_profissional: '322205', // Técnico de Enfermagem
            cns_paciente: '123456789012345',
            sexo_paciente: 'M',
            data_nascimento_paciente: '1950-05-12',
            diagnosticos: ['E11'], // Diabetes tipo 2
            procedimentos: ['0301100039'], // Aferição de PA
            tipo_atendimento: 'PROCEDIMENTO'
        }
    ];

    console.log(`✅ Encontrados ${mockData.length} novos registros.`);
    return mockData;
}

// 2. Envio dos dados para a API de Ingestão do Nexx (Data Warehouse)
async function sendToIngestApi(data: AtendimentoPec[]) {
    console.log(`🚀 Enviando lote para ${INGEST_API_URL}...`);

    try {
        const payload = {
            tipo_dado: 'PEC',
            origem: {
                sistema: 'e-SUS AB',
                versao: '5.2.18',
                timestamp_extracao: new Date().toISOString()
            },
            conteudo: data
        };

        const response = await fetch(INGEST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText} - ${await response.text()}`);
        }

        const result = await response.json();
        console.log('✅ Dados ingeridos com sucesso!', result);

    } catch (error) {
        console.error('❌ Falha na ingestão:', error);
        if (error instanceof Error && error.message.includes('401')) {
            console.error('DICA: Verifique se a chave SUPABASE_ANON_KEY no script é uma chave JWT válida (começa com eyJ...).');
        }
    }
}

// Função Principal
async function main() {
    console.log('### INICIANDO SCRIPT DE EXTRAÇÃO PEC (NEXX CORE) ###');

    try {
        const data = await fetchNewDataFromPec();
        if (data.length > 0) {
            await sendToIngestApi(data);
        } else {
            console.log('Nenhum dado novo para processar.');
        }
    } catch (err) {
        console.error('Erro fatal no script:', err);
    }

    console.log('### FIM DA EXECUÇÃO ###');
}

main();
