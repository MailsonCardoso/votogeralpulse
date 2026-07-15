import { writeFileSync } from 'fs'

const NOMES = [
  'Maria Silva', 'João Souza', 'Ana Lima', 'Carlos Pereira', 'Beatriz Rocha',
  'Pedro Alves', 'Luísa Costa', 'Felipe Dias', 'Juliana Martins', 'Rafael Oliveira',
  'Camila Santos', 'Bruno Carvalho', 'Larissa Ferreira', 'Gustavo Ribeiro',
  'Patrícia Gomes', 'Lucas Barbosa', 'Fernanda Araújo', 'Thiago Nunes',
]
const BAIRROS = ['Centro', 'Maiobão', 'Tambaú', 'Vinhais', 'Calhau', 'Cohab', 'Anil', 'Turú']
const PAPÉIS = ['Coordenador', 'Cab furado', 'Liderança', 'Voluntário', 'Assessor', 'Analista de Dados', 'Social Media', 'Financeiro']
const APOIOS = ['ferrenho', 'provavel', 'indeciso', 'adversario']
const MOTIVOS = ['Apoio presencial', 'Entrega de material', 'Debate de propostas', 'Censo eleitoral', 'Convite para evento']
const pick = (a, i) => a[i % a.length]

const lines = []
const ins = (table, obj) => {
  const cols = Object.keys(obj)
  const vals = cols.map((k) => {
    const v = obj[k]
    if (v === null || v === undefined) return 'NULL'
    if (typeof v === 'number') return String(v)
    return `'${String(v).replace(/'/g, "''")}'`
  })
  lines.push(`INSERT IGNORE INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${vals.join(', ')});`)
}

const liderancas = []
for (let i = 1; i <= 8; i++) {
  const id = `lid-${i}`
  liderancas.push(id)
  ins('liderancas', {
    id, nome: pick(NOMES, i - 1), bairro: pick(BAIRROS, i), telefone: '(98) 9' + (1000000 + i * 12345),
    eleitores: 30 + i * 5, convertidos: 5 + i * 2, meta: 80, engajamento: 0, ativo: 1,
  })
}

const cabos = []
for (let i = 1; i <= 10; i++) {
  const id = `cabo-${i}`
  const lid = liderancas[(i - 1) % liderancas.length]
  cabos.push({ id, lid })
  ins('cabos', {
    id, nome: pick(NOMES, i + 2), lideranca_id: lid, regiao: pick(BAIRROS, i + 1),
    eleitores: 10 + i * 3, visitas: 2 + i, meta: 50, performance: 0,
  })
}

for (let i = 1; i <= 12; i++) {
  ins('funcionarios', {
    id: `func-${i}`, nome: pick(NOMES, i + 4), papel: pick(PAPÉIS, i),
    email: `funcionario${i}@votogeral.com`, telefone: '(98) 9' + (2000000 + i * 1234),
    bairro: pick(BAIRROS, i), ativo: i % 5 === 0 ? 0 : 1,
    entrou_em: new Date(2025, (i - 1) % 12, ((i - 1) % 27) + 1).toISOString(),
  })
}

const eleitores = []
for (let i = 1; i <= 60; i++) {
  const cabo = cabos[(i - 1) % cabos.length]
  const id = `elt-${i}`
  eleitores.push({ id, cabo: cabo.id, lid: cabo.lid })
  ins('eleitores', {
    id, nome: pick(NOMES, i + 6), cpf: '000.000.00' + String(i).padStart(2, '0'),
    idade: 18 + (i % 50), sexo: i % 2 ? 'Feminino' : 'Masculino', cidade: 'São Luís',
    regiao: pick(BAIRROS, i), bairro: pick(BAIRROS, i + 1), tipo_via: 'Rua', numero: String(100 + i),
    endereco: 'Rua Exemplo', zona: (i % 12) + 1, secao: (i % 400) + 1,
    telefone: '(98) 9' + (3000000 + i * 321), email: `eleitor${i}@email.com`,
    escolaridade: pick(['Fundamental', 'Médio', 'Superior'], i),
    apoio: pick(APOIOS, i), lideranca_id: cabo.lid, cabo_id: cabo.id,
    cadastrado_em: new Date(2026, (i - 1) % 6, ((i - 1) % 27) + 1).toISOString(),
    ultima_interacao: new Date().toISOString(),
  })
}

for (let i = 1; i <= 20; i++) {
  const e = eleitores[(i - 1) % eleitores.length]
  ins('visitas', {
    id: `vis-${i}`, eleitor_id: e.id, cabo_id: e.cabo,
    data: new Date(2026, (i - 1) % 6, ((i - 1) % 27) + 1).toISOString().slice(0, 10),
    status: pick(['agendada', 'concluida', 'concluida', 'cancelada'], i),
    motivo: pick(MOTIVOS, i), feedback: i % 3 === 0 ? 'Eleitor receptivo.' : null,
    protocolo: 'VT-' + (1000 + i),
  })
}

writeFileSync(
  new URL('./migrations/002_seed.sql', import.meta.url),
  '-- Migration 002: dados iniciais de demonstração\n-- Execute após a migration 001.\n\n' + lines.join('\n') + '\n',
)
console.log('002_seed.sql gerado com ' + lines.length + ' inserts.')
