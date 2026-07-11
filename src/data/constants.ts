export const CIDADE_REGIOES_BAIRROS: Record<string, Record<string, string[]>> = {
  'Paço do Lumiar': {
    'Região do Maiobão': [
      'Maiobão', 'Tambaú', 'Paranã I', 'Paranã II', 'Paranã III', 'Paranã IV',
      'Manaíra', 'Upaon-Açu', 'Conjunto Jaguarema', 'Residencial Carlos Augusto',
      'Residencial Orquídea', 'Cidade Verde I', 'Cidade Verde II', 'Habitar',
      'Residencial Abdalla I', 'Residencial Abdalla II', 'Conjunto Roseana Sarney',
      'Parque Horizonte', 'Novo Horizonte',
    ],
    'Região da Vila Cafeteira': [
      'Vila Cafeteira', 'Vila Nazaré', 'Vila Epitácio Cafeteira', 'Vila do Povo',
      'Nova Vida', 'Nova Esperança', 'Nova Jerusalém I', 'Nova Jerusalém II',
      'Armindo Reis', 'Novo Paço', 'Renascer',
    ],
    'Região da Vila São José': [
      'Vila São José I', 'Vila São José II', 'Vila Nossa Senhora da Vitória',
      'Vila Nossa Senhora da Luz', 'Vila Joaquim Aroso',
    ],
    'Região Bob Kennedy': [
      'Parque Bob Kennedy', 'La Belle Park', 'Jardim das Mercês', 'Mercês',
      'Santa Clara', 'Morada Nova', 'Amaral de Matos', 'Lima Verde', 'Safira', 'Saramanta',
    ],
    'Região Pirâmide': [
      'Pirâmide', 'Residencial Pirâmide', 'Parque Tiago Aroso',
      'Recanto dos Poetas', 'Todos os Santos',
    ],
    'Região Cumbique': [
      'Cumbique', 'Timbuba',
    ],
    'Região Iguaíba': [
      'Iguaíba', 'Sítio Natureza', 'Sítio Grande', 'Caiaré', 'Bacuritua', 'Bom Negócio',
    ],
    'Região Pindoba': [
      'Pindoba',
    ],
    'Região Sede de Paço do Lumiar': [
      'Centro de Paço do Lumiar', 'Vila Mercês',
    ],
    'Região Pau Deitado': [
      'Pau Deitado',
    ],
    'Região Pindaí': [
      'Pindaí',
    ],
  },
  'São Luís': {
    'Região Centro': [
      'Centro', 'Madre Deus', 'Apicum', 'Goiabal', 'Desterro', 'Diamante', 'Camboa', 'São Pantaleão',
    ],
    'Região Ponta d\'Areia/Calhau': [
      'Ponta d\'Areia', 'Calhau', 'Alto do Calhau', 'Ponta do Farol', 'São Francisco', 'Renascença',
    ],
    'Região Jaracati/Angelim': [
      'Jaracati', 'Angelim', 'Recanto dos Vinhais',
    ],
    'Região Vinhais/Cohama': [
      'Vinhais', 'Cohama', 'Monte Castelo',
    ],
    'Região João Paulo/Liberdade': [
      'João Paulo', 'Liberdade', 'Alemanha',
    ],
    'Região Anil/Tirirical': [
      'Anil', 'Tirirical', 'Cruzeiro do Anil', 'Aurora',
    ],
    'Região Cohab/Cohatrac': [
      'Cohab', 'Cohatrac', 'Cidade Operária', 'Itaqui',
    ],
    'Região Sacavém/Coroadinho': [
      'Sacavém', 'Coroadinho', 'Vila Embratel', 'São Cristóvão',
    ],
    'Região Turu/Maracanã': [
      'Turu', 'Maracanã', 'Pedrinhas', 'Vila Esperança', 'Vila Luizão', 'Sá Viana',
    ],
  },
}

export const CIDADES = Object.keys(CIDADE_REGIOES_BAIRROS)

export const TIPOS_VIA = ['Avenida', 'Rua']

export function regioesDaCidade(cidade: string): string[] {
  return Object.keys(CIDADE_REGIOES_BAIRROS[cidade] ?? {})
}

export function bairrosDaRegiao(cidade: string, regiao: string): string[] {
  return CIDADE_REGIOES_BAIRROS[cidade]?.[regiao] ?? []
}

export const BAIRROS = Object.values(CIDADE_REGIOES_BAIRROS).flatMap((regioes) =>
  Object.values(regioes).flat(),
)

export const ZONAS = Array.from({ length: 12 }, (_, i) => i + 1)