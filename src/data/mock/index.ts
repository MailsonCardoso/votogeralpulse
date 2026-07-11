import type {
  Apoio,
  Atividade,
  Cabo,
  Conversa,
  Eleitor,
  Escolaridade,
  Evento,
  Lideranca,
  MembroEquipe,
  Mensagem,
  MetricasSemana,
  Movimentacao,
  Notificacao,
  Pesquisa,
  Sexo,
  Visita,
} from '~/data/types'

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20260609)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const between = (a: number, b: number) => Math.floor(rand() * (b - a + 1)) + a

export const NOMES = [
  'Maria', 'José', 'Ana', 'João', 'Francisca', 'Antônio', 'Adriana', 'Carlos',
  'Juliana', 'Paulo', 'Márcia', 'Lucas', 'Fernanda', 'Luiz', 'Patrícia',
  'Marcelo', 'Aline', 'Rafael', 'Sandra', 'Bruno', 'Camila', 'Eduardo',
  'Larissa', 'Rodrigo', 'Tatiane', 'Felipe', 'Renata', 'Gustavo', 'Daniela',
  'Anderson', 'Priscila', 'Wesley', 'Kleber', 'Vanessa', 'Thiago', 'Jéssica',
  'Cleyson', 'Adrielly', 'Matheus', 'Beatriz', 'Gabriel', 'Laura', 'Pedro',
  'Mariana', 'Vitor', 'Isabela', 'Leonardo', 'Carla', 'Diego', 'Joice',
]
export const SOBRENOMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa',
  'Almeida', 'Ferreira', 'Rodrigues', 'Gomes', 'Martins', 'Araújo', 'Barbosa',
  'Ribeiro', 'Carvalho', 'Teixeira', 'Cardoso', 'Moreira', 'Nascimento',
  'Correia', 'Pinto', 'Cavalcanti', 'Azevedo', 'Monteiro', 'Cunha',
  'Mendes', 'Rocha', 'Dias', 'Andrade',
]
export const BAIRROS = [
  'Jardim Paulista', 'Vila Mariana', 'Mooca', 'Lapa', 'Santana', 'Tatuapé',
  'Pinheiros', 'Ipiranga', 'Campo Limpo', 'Itaquera', 'Penha', 'Vila Prudente',
  'Butantã', 'Freguesia do Ó', 'Cidade Tiradentes', 'Guaianases', 'Cidade Ademar',
  'Vila Nova Conceição', 'Bela Vista', 'Consolação', 'Bom Retiro', 'Pari',
]
export const CIDADES = [
  'São Paulo', 'Campinas', 'Guarulhos', 'Osasco', 'Santo André', 'São Bernardo',
  'Sorocaba', 'Jundiaí', 'São José dos Campos', 'Ribeirão Preto',
]

const APOIOS: Apoio[] = ['ferrenho', 'provavel', 'indeciso', 'adversario']
const SEXOS: Sexo[] = ['Masculino', 'Feminino']
const ESCOLARIDADES: Escolaridade[] = [
  'Fundamental', 'Médio', 'Superior', 'Pós-graduação',
]

function nomeCompleto() {
  return `${pick(NOMES)} ${pick(SOBRENOMES)} ${pick(SOBRENOMES)}`
}
function cpf() {
  const d = () => between(100, 999)
  return `${d()}.${d()}.${d()}-${between(10, 99)}`
}
function telefone() {
  return `(11) 9${between(1000, 9999)}-${between(1000, 9999)}`
}
function email(nome: string) {
  return (
    nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '.')
      .split('.')
      .slice(0, 3)
      .join('.') + '@email.com'
  )
}

export const LIDERANCAS: Lideranca[] = Array.from({ length: 12 }).map((_, i) => {
  const nome = nomeCompleto()
  const eleitores = between(40, 220)
  const convertidos = Math.floor(eleitores * (0.3 + rand() * 0.5))
  return {
    id: `lid-${i + 1}`,
    nome,
    bairro: pick(BAIRROS),
    telefone: telefone(),
    eleitores,
    convertidos,
    meta: Math.floor(eleitores * 1.2),
    engajamento: between(45, 98),
    ativo: rand() > 0.15,
  }
})

export const CABOS: Cabo[] = Array.from({ length: 20 }).map((_, i) => {
  const eleitores = between(15, 90)
  return {
    id: `cabo-${i + 1}`,
    nome: nomeCompleto(),
    liderancaId: pick(LIDERANCAS).id,
    regiao: pick(BAIRROS),
    eleitores,
    visitas: between(10, eleitores),
    meta: Math.floor(eleitores * 1.3),
    performance: between(40, 99),
  }
})

export const ELEITORES: Eleitor[] = []

export const EQUIPE: MembroEquipe[] = Array.from({ length: 14 }).map((_, i) => {
  const nome = nomeCompleto()
  return {
    id: `eq-${i + 1}`,
    nome,
    papel: pick([
      'Coordenador', 'Cab furado', 'Liderança', 'Voluntário',
      'Assessor', 'Analista de Dados', 'Social Media', 'Financeiro',
    ]),
    email: email(nome),
    telefone: telefone(),
    bairro: pick(BAIRROS),
    ativo: rand() > 0.1,
    entrouEm: new Date(2025, between(0, 11), between(1, 28)).toISOString(),
  }
})

export const VISITAS: Visita[] = Array.from({ length: 30 }).map((_, i) => {
  const status = pick(['agendada', 'concluida', 'concluida', 'cancelada'] as const)
  return {
    id: `vis-${i + 1}`,
    eleitorId: `elt-${between(1, 120)}`,
    caboId: pick(CABOS).id,
    data: new Date(2026, between(0, 6), between(1, 28)).toISOString(),
    status,
    motivo: pick([
      'Apoio presencial', 'Entrega de material', 'Debate de propostas',
      'Censo eleitoral', 'Convite para evento', 'Resolução de dúvidas',
    ]),
    feedback:
      status === 'concluida'
        ? pick([
            'Eleitor receptivo, confirmou apoio.',
            'Pediu mais informações sobre segurança.',
            'Indicou dois vizinhos interessados.',
            'Reclamou de buracos na rua, sensível à pauta.',
          ])
        : undefined,
    protocolo: `VT-${between(1000, 9999)}`,
  }
})

export const PESQUISAS: Pesquisa[] = [
  {
    id: 'pesq-1',
    titulo: 'Intenção de voto — 1º turno',
    data: new Date(2026, 4, 20).toISOString(),
    amostra: 1840,
    intencao: [
      { nome: 'Candidato A (nosso)', valor: 38 },
      { nome: 'Candidato B', valor: 29 },
      { nome: 'Candidato C', valor: 14 },
      { nome: 'Branco/Nulo', valor: 9 },
      { nome: 'Indeciso', valor: 10 },
    ],
    perguntas: [
      { pergunta: 'Aprova avaliação do prefeito atual?', aprovacao: 41 },
      { pergunta: 'Segurança é prioridade?', aprovacao: 88 },
      { pergunta: 'Saúde é prioridade?', aprovacao: 81 },
      { pergunta: 'Conhece propostas do candidato A?', aprovacao: 54 },
    ],
  },
  {
    id: 'pesq-2',
    titulo: 'Rejeição por faixa etária',
    data: new Date(2026, 5, 2).toISOString(),
    amostra: 920,
    intencao: [
      { nome: '16-24', valor: 33 },
      { nome: '25-39', valor: 42 },
      { nome: '40-59', valor: 37 },
      { nome: '60+', valor: 28 },
    ],
    perguntas: [
      { pergunta: 'Usa redes sociais para política?', aprovacao: 63 },
      { pergunta: 'Confia em WhatsApp como fonte?', aprovacao: 47 },
    ],
  },
]

export const EVENTOS: Evento[] = Array.from({ length: 15 }).map((_, i) => {
  return {
    id: `evt-${i + 1}`,
    titulo: pick([
      'Comício na Praça Central', 'Caminhada no bairro', 'Roda de conversa',
      'Lançamento de candidatura', 'Carreata', 'Café com lideranças',
      'Mutirão de limpeza', 'Audiência pública', 'Reunião de cabos',
    ]),
    data: new Date(2026, between(0, 8), between(1, 28)).toISOString(),
    local: pick([
      'Praça da Sé', 'Ginásio Municipal', 'Centro Comunitário',
      'Clube dos Bancários', 'Teatro Municipal', 'Quadra da Escola',
    ]),
    bairro: pick(BAIRROS),
    tipo: pick(['Comício', 'Caminhada', 'Debate', 'Social', 'Institucional']),
    status: pick(['planejado', 'confirmado', 'confirmado', 'realizado', 'cancelado'] as const),
    confirmados: between(20, 480),
  }
})

function msg(texto: string, de: Mensagem['de'], hora: string): Mensagem {
  return { id: Math.random().toString(36).slice(2), de, texto, hora }
}

export const CONVERSAS: Conversa[] = Array.from({ length: 40 }).map((_, i) => {
  const nome = nomeCompleto()
  const n = between(3, 8)
  const mensagens: Mensagem[] = Array.from({ length: n }).map((_, j) =>
    msg(
      pick([
        'Bom dia! Vi a campanha no bairro, curti as propostas.',
        'Quando tem o próximo evento?', 'Pode me mandar o material?',
        'Não vou poder na visita de amanhã.', 'Apoio sim, conte comigo!',
        'Qual o número da seção pra votar?', 'Obrigado pelas informações.',
        'Minha vizinha também quer participar.',
      ]),
      j % 2 === 0 ? 'eleitor' : 'cabo',
      `${between(8, 20)}:${between(10, 59).toString().padStart(2, '0')}`,
    ),
  )
  return {
    id: `conv-${i + 1}`,
    eleitorId: `elt-${between(1, 120)}`,
    nome,
    bairro: pick(BAIRROS),
    tags: [pick(APOIOS), pick(['whatsapp', 'receptivo', 'prioridade'])],
    naoLidas: rand() > 0.6 ? between(1, 4) : 0,
    online: rand() > 0.5,
    mensagens,
  }
})

export const FINANCEIRO: Movimentacao[] = Array.from({ length: 24 }).map(
  (_, i) => {
    const tipo = rand() > 0.45 ? 'receita' : 'despesa'
    return {
      id: `fin-${i + 1}`,
      descricao: pick(
        tipo === 'receita'
          ? [
              'Doação de campanha — Pessoa Física', 'Verba partidária',
              'Financiamento coletivo', 'Evento beneficente',
            ]
          : [
              'Impressão de material gráfico', 'Aluguel de palco',
              'Combustível da carreata', 'Tráfego pago Instagram',
              'Café da manhã com lideranças', 'Transporte de voluntários',
            ],
      ),
      categoria: pick([
        'Marketing', 'Eventos', 'Logística', 'Pessoal', 'Doações',
      ]),
      tipo,
      valor: between(350, 18000),
      data: new Date(2026, between(0, 5), between(1, 28)).toISOString(),
    }
  },
)

export const NOTIFICACOES: Notificacao[] = [
  {
    id: 'n1', titulo: 'Nova liderança cadastrada',
    corpo: 'Carla Mendes entrou na equipe de Santana.', tempo: '2026-06-08T10:00:00',
    lida: false, tipo: 'success',
  },
  {
    id: 'n2', titulo: 'Meta de bairro em risco',
    corpo: 'Itaquera está 18% abaixo da meta semanal.', tempo: '2026-06-07T18:30:00',
    lida: false, tipo: 'warning',
  },
  {
    id: 'n3', titulo: 'Visita cancelada',
    corpo: 'Eleitor José Souza cancelou a visita de amanhã.', tempo: '2026-06-07T14:10:00',
    lida: true, tipo: 'danger',
  },
  {
    id: 'n4', titulo: 'Pesquisa concluída',
    corpo: 'Intenção de voto 1º turno apurada com 1.840 entrevistas.', tempo: '2026-06-06T09:00:00',
    lida: true, tipo: 'info',
  },
]

export const ATIVIDADES: Atividade[] = Array.from({ length: 10 }).map((_, i) => {
  const u = pick(EQUIPE)
  return {
    id: `atv-${i + 1}`,
    usuario: u.nome,
    acao: pick([
      'cadastrou', 'atualizou', 'converteu', 'agendou visita para',
      'enviou mensagem para', 'marcou como apoio', 'reopenou',
    ]),
    alvo: pick([
      '12 eleitores', 'um cabo', 'a pesquisa 1º turno', 'o evento de sábado',
      'a liderança de Mooca', 'um eleitor indeciso',
    ]),
    tempo: new Date(2026, 5, between(1, 8), between(8, 20), between(0, 59)).toISOString(),
    tipo: pick(['create', 'update', 'message', 'visit', 'event']),
  }
})

export const METRICAS_SEMANA: MetricasSemana[] = [
  { dia: 'Seg', contatos: 320, conversoes: 84 },
  { dia: 'Ter', contatos: 410, conversoes: 110 },
  { dia: 'Qua', contatos: 380, conversoes: 96 },
  { dia: 'Qui', contatos: 520, conversoes: 142 },
  { dia: 'Sex', contatos: 610, conversoes: 175 },
  { dia: 'Sáb', contatos: 470, conversoes: 158 },
  { dia: 'Dom', contatos: 290, conversoes: 90 },
]

export const DEMOGRAFIA_IDADE = [
  { faixa: '16-24', eleitores: 214 },
  { faixa: '25-39', eleitores: 332 },
  { faixa: '40-59', eleitores: 281 },
  { faixa: '60+', eleitores: 173 },
]

export const DENSIDADE_BAIRRO = BAIRROS.map((b) => ({
  bairro: b,
  densidade: between(20, 100),
  convertidos: between(10, 80),
}))

export const TEMPLATES_WHATSAPP = [
  {
    id: 't1',
    nome: 'Boas-vindas',
    texto:
      'Olá {{nome}}! Sou da campanha do candidato A. Queremos ouvir você. Podemos contar com seu apoio? 🙌',
  },
  {
    id: 't2',
    nome: 'Lembrete de evento',
    texto:
      'Oi {{nome}}, lembra do nosso evento sábado às 16h na Praça da Sé. Sua presença é muito importante!',
  },
  {
    id: 't3',
    nome: 'Agradecimento',
    texto: 'Muito obrigado pelo apoio, {{nome}}! Conte conosco para uma cidade melhor.',
  },
]
