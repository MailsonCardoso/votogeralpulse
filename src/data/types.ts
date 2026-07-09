export type Apoio = 'ferrenho' | 'provavel' | 'indeciso' | 'adversario'
export type Sexo = 'Masculino' | 'Feminino'
export type Escolaridade =
  | 'Fundamental'
  | 'Médio'
  | 'Superior'
  | 'Pós-graduação'
export type StatusVisita = 'agendada' | 'concluida' | 'cancelada'
export type StatusEvento = 'planejado' | 'confirmado' | 'realizado' | 'cancelado'
export type CanalMensagem = 'whatsapp' | 'sms' | 'email' | 'ligacao'

export interface Eleitor {
  id: string
  nome: string
  cpf: string
  idade: number
  sexo: Sexo
  bairro: string
  cidade: string
  zona: number
  secao: number
  telefone: string
  email: string
  escolaridade: Escolaridade
  apoio: Apoio
  liderancaId: string
  caboId: string
  cadastradoEm: string
  ultimaInteracao: string
}

export interface Lideranca {
  id: string
  nome: string
  bairro: string
  telefone: string
  eleitores: number
  convertidos: number
  meta: number
  engajamento: number
  ativo: boolean
}

export interface Cabo {
  id: string
  nome: string
  liderancaId: string
  regiao: string
  eleitores: number
  visitas: number
  meta: number
  performance: number
}

export interface MembroEquipe {
  id: string
  nome: string
  papel: string
  email: string
  telefone: string
  bairro: string
  ativo: boolean
  entrouEm: string
}

export interface Visita {
  id: string
  eleitorId: string
  caboId: string
  data: string
  status: StatusVisita
  motivo: string
  feedback?: string
  protocolo: string
}

export interface Pesquisa {
  id: string
  titulo: string
  data: string
  amostra: number
  intencao: { nome: string; valor: number }[]
  perguntas: { pergunta: string; aprovacao: number }[]
}

export interface Evento {
  id: string
  titulo: string
  data: string
  local: string
  bairro: string
  tipo: string
  status: StatusEvento
  confirmados: number
}

export interface Mensagem {
  id: string
  de: 'eleitor' | 'cabo'
  texto: string
  hora: string
}

export interface Conversa {
  id: string
  eleitorId: string
  nome: string
  bairro: string
  tags: string[]
  naoLidas: number
  online: boolean
  mensagens: Mensagem[]
}

export interface Movimentacao {
  id: string
  descricao: string
  categoria: string
  tipo: 'receita' | 'despesa'
  valor: number
  data: string
}

export interface Notificacao {
  id: string
  titulo: string
  corpo: string
  tempo: string
  lida: boolean
  tipo: 'info' | 'success' | 'warning' | 'danger'
}

export interface Atividade {
  id: string
  usuario: string
  acao: string
  alvo: string
  tempo: string
  tipo: string
}

export interface MetricasSemana {
  dia: string
  contatos: number
  conversoes: number
}
