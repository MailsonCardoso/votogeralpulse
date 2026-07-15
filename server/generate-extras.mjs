import { writeFileSync } from 'fs'

const esc = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
const j = (v) => esc(JSON.stringify(v))
const snakize = (s) => s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())

const NOMES = ['Maria Silva', 'Joo Souza', 'Ana Lima', 'Carlos Pereira', 'Beatriz Rocha', 'Pedro Alves', 'Luisa Costa', 'Felipe Dias', 'Juliana Martins', 'Rafael Oliveira', 'Camila Santos', 'Bruno Carvalho']
const BAIRROS = ['Centro', 'Maiobao', 'Tambau', 'Vinhais', 'Calhau', 'Cohab', 'Anil', 'Turu']
const pick = (a, i) => a[((i % a.length) + a.length) % a.length]

const lines = []
const ins = (table, obj) => {
  const cols = Object.keys(obj).map(snakize)
  const vals = Object.values(obj).map((v) => {
    if (v === null || v === undefined) return 'NULL'
    if (typeof v === 'number') return String(v)
    if (typeof v === 'object') return j(v)
    return esc(v)
  })
  lines.push(`INSERT IGNORE INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${vals.join(', ')});`)
}

// pesquisas
const pesquisas = [
  { titulo: 'Intenção de voto — 1º turno', amostra: 1840, intencao: [{ nome: 'Candidato A (nosso)', valor: 38 }, { nome: 'Candidato B', valor: 29 }, { nome: 'Candidato C', valor: 14 }, { nome: 'Branco/Nulo', valor: 9 }, { nome: 'Indeciso', valor: 10 }], perguntas: [{ pergunta: 'Aprova avaliação do prefeito atual?', aprovacao: 41 }, { pergunta: 'Segurança é prioridade?', aprovacao: 88 }, { pergunta: 'Saúde é prioridade?', aprovacao: 81 }, { pergunta: 'Conhece propostas do candidato A?', aprovacao: 54 }] },
  { titulo: 'Rejeição por faixa etária', amostra: 920, intencao: [{ nome: '16-24', valor: 33 }, { nome: '25-39', valor: 42 }, { nome: '40-59', valor: 37 }, { nome: '60+', valor: 28 }], perguntas: [{ pergunta: 'Usa redes sociais para política?', aprovacao: 63 }, { pergunta: 'Confia em WhatsApp como fonte?', aprovacao: 47 }] },
]
pesquisas.forEach((p, i) => ins('pesquisas', { id: `pesq-${i + 1}`, titulo: p.titulo, data: new Date(2026, 4, 20).toISOString(), amostra: p.amostra, intencao: p.intencao, perguntas: p.perguntas }))

// eventos
const TITULOS = ['Comício na Praça Central', 'Caminhada no bairro', 'Roda de conversa', 'Lançamento de candidatura', 'Carreata', 'Café com lideranças', 'Mutirão de limpeza', 'Audiência pública', 'Reunião de cabos']
const LOCAIS = ['Praça da Sé', 'Ginásio Municipal', 'Centro Comunitário', 'Clube dos Bancários', 'Teatro Municipal', 'Quadra da Escola']
const TIPOS = ['Comício', 'Caminhada', 'Debate', 'Social', 'Institucional']
const STATUS = ['planejado', 'confirmado', 'confirmado', 'realizado', 'cancelado']
for (let i = 1; i <= 15; i++) {
  ins('eventos', {
    id: `evt-${i}`, titulo: pick(TITULOS, i), data: new Date(2026, i % 9, (i % 27) + 1).toISOString(),
    local: pick(LOCAIS, i), bairro: pick(BAIRROS, i), tipo: pick(TIPOS, i), status: pick(STATUS, i), confirmados: 20 + (i * 17) % 460,
  })
}

// conversas
const MSG = ['Bom dia! Vi a campanha no bairro, curti as propostas.', 'Quando tem o próximo evento?', 'Pode me mandar o material?', 'Não vou poder na visita de amanhã.', 'Apoio sim, conte comigo!', 'Qual o número da seção pra votar?', 'Obrigado pelas informações.', 'Minha vizinha também quer participar.']
for (let i = 1; i <= 40; i++) {
  const n = 3 + (i % 6)
  const mensagens = Array.from({ length: n }, (_, jj) => ({
    id: `m${(i * 10 + jj)}`, de: jj % 2 === 0 ? 'eleitor' : 'cabo',
    texto: pick(MSG, i + jj), hora: `${8 + (jj % 12)}:${(jj * 7 % 60).toString().padStart(2, '0')}`,
  }))
  ins('conversas', {
    id: `conv-${i}`, eleitorId: `elt-${(i % 60) + 1}`, nome: pick(NOMES, i), bairro: pick(BAIRROS, i),
    tags: [pick(['ferrenho', 'provavel', 'indeciso', 'adversario'], i), pick(['whatsapp', 'receptivo', 'prioridade'], i)],
    naoLidas: i % 3 === 0 ? (i % 4) + 1 : 0, online: i % 2 === 0, mensagens,
  })
}

// movimentacoes (financeiro)
const FIN_REC = ['Doação de campanha — Pessoa Física', 'Verba partidária', 'Financiamento coletivo', 'Evento beneficente']
const FIN_DESP = ['Impressão de material gráfico', 'Aluguel de palco', 'Combustível da carreata', 'Tráfego pago Instagram', 'Café da manhã com lideranças', 'Transporte de voluntários']
const CATS = ['Marketing', 'Eventos', 'Logística', 'Pessoal', 'Doações']
for (let i = 1; i <= 24; i++) {
  const tipo = i % 2 === 0 ? 'receita' : 'despesa'
  ins('movimentacoes', {
    id: `fin-${i}`, descricao: tipo === 'receita' ? pick(FIN_REC, i) : pick(FIN_DESP, i),
    categoria: pick(CATS, i), tipo, valor: 350 + ((i * 733) % 17650), data: new Date(2026, i % 6, (i % 27) + 1).toISOString(),
  })
}

// notificacoes
const notifs = [
  { titulo: 'Nova liderança cadastrada', corpo: 'Carla Mendes entrou na equipe de Santana.', tempo: '2026-06-08T10:00:00', lida: false, tipo: 'success' },
  { titulo: 'Meta de bairro em risco', corpo: 'Itaquera está 18% abaixo da meta semanal.', tempo: '2026-06-07T18:30:00', lida: false, tipo: 'warning' },
  { titulo: 'Visita cancelada', corpo: 'Eleitor José Souza cancelou a visita de amanhã.', tempo: '2026-06-07T14:10:00', lida: true, tipo: 'danger' },
  { titulo: 'Pesquisa concluída', corpo: 'Intenção de voto 1º turno apurada com 1.840 entrevistas.', tempo: '2026-06-06T09:00:00', lida: true, tipo: 'info' },
]
notifs.forEach((n, i) => ins('notificacoes', { id: `n${i + 1}`, ...n }))

// atividades
const ACOES = ['cadastrou', 'atualizou', 'converteu', 'agendou visita para', 'enviou mensagem para', 'marcou como apoio', 'reabriu']
const ALVOS = ['12 eleitores', 'um cabo', 'a pesquisa 1º turno', 'o evento de sábado', 'a liderança de Mooca', 'um eleitor indeciso']
const TIPOS_A = ['create', 'update', 'message', 'visit', 'event']
for (let i = 1; i <= 10; i++) {
  ins('atividades', {
    id: `atv-${i}`, usuario: pick(NOMES, i), acao: pick(ACOES, i), alvo: pick(ALVOS, i),
    tempo: new Date(2026, 5, (i % 8) + 1, 8 + (i % 12), (i * 7) % 60).toISOString(), tipo: pick(TIPOS_A, i),
  })
}

const creates = `
CREATE TABLE IF NOT EXISTS \`pesquisas\` (
  \`id\` VARCHAR(40) PRIMARY KEY,
  \`titulo\` VARCHAR(200),
  \`data\` VARCHAR(40),
  \`amostra\` INT DEFAULT 0,
  \`intencao\` JSON,
  \`perguntas\` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`eventos\` (
  \`id\` VARCHAR(40) PRIMARY KEY,
  \`titulo\` VARCHAR(200),
  \`data\` VARCHAR(40),
  \`local\` VARCHAR(200),
  \`bairro\` VARCHAR(120),
  \`tipo\` VARCHAR(60),
  \`status\` VARCHAR(40),
  \`confirmados\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`conversas\` (
  \`id\` VARCHAR(40) PRIMARY KEY,
  \`eleitor_id\` VARCHAR(40),
  \`nome\` VARCHAR(120),
  \`bairro\` VARCHAR(120),
  \`tags\` JSON,
  \`nao_lidas\` INT DEFAULT 0,
  \`online\` TINYINT(1) DEFAULT 0,
  \`mensagens\` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`movimentacoes\` (
  \`id\` VARCHAR(40) PRIMARY KEY,
  \`descricao\` VARCHAR(200),
  \`categoria\` VARCHAR(60),
  \`tipo\` VARCHAR(20),
  \`valor\` INT DEFAULT 0,
  \`data\` VARCHAR(40)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`notificacoes\` (
  \`id\` VARCHAR(40) PRIMARY KEY,
  \`titulo\` VARCHAR(200),
  \`corpo\` TEXT,
  \`tempo\` VARCHAR(40),
  \`lida\` TINYINT(1) DEFAULT 0,
  \`tipo\` VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`atividades\` (
  \`id\` VARCHAR(40) PRIMARY KEY,
  \`usuario\` VARCHAR(120),
  \`acao\` VARCHAR(120),
  \`alvo\` VARCHAR(120),
  \`tempo\` VARCHAR(40),
  \`tipo\` VARCHAR(40)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

writeFileSync(
  new URL('./migrations/004_extras.sql', import.meta.url),
  '-- Migration 004: tabelas extras (pesquisas, eventos, conversas, movimentacoes, notificacoes, atividades)\n-- Execute apos a 003. CREATE IF NOT EXISTS + seed idempotente.\n\n' + creates + '\n' + lines.join('\n') + '\n',
)
console.log('004_extras.sql gerado com ' + lines.length + ' inserts.')
