export const CIDADE_REGIOES_BAIRROS: Record<string, Record<string, string[]>> = {
  'Paço do Lumiar': {
    'Região do Maiobão': [
      'Maiobão', 'Tambaú', 'Residencial Tambaú', 'Paranã I', 'Paranã II', 'Paranã III',
      'Paranã IV', 'Loteamento Paranã', 'Manaíra', 'Upaon-Açu', 'Conjunto Jaguarema',
      'Residencial Carlos Augusto', 'Residencial Orquídea', 'Cidade Verde I',
      'Cidade Verde II', 'Cidade Verde III', 'Cidade Verde IV', 'Habitar',
      'Residencial Abdalla I', 'Residencial Abdalla II', 'Conjunto Roseana Sarney',
      'Parque Horizonte', 'Novo Horizonte', 'Parque do Farol',
      'Vila Sarney Filho I', 'Vila Sarney Filho II',
    ],
    'Região da Vila Cafeteira': [
      'Vila Cafeteira', 'Vila Epitácio Cafeteira', 'Vila Nazaré', 'Vila do Povo',
      'Nova Vida', 'Nova Esperança', 'Nova Jerusalém I', 'Nova Jerusalém II',
      'Armindo Reis', 'Novo Paço', 'Renascer', 'Vila Kiola I', 'Vila Kiola II',
      'Vila São Pedro',
    ],
    'Região da Vila São José': [
      'Vila São José I', 'Vila São José II', 'Vila São José III',
      'Vila Nossa Senhora da Vitória', 'Vila Nossa Senhora da Luz',
      'Vila Joaquim Aroso', 'Nova Canaã', 'Zumbi dos Palmares',
      'Residencial Edinho Lobão',
    ],
    'Região Bob Kennedy': [
      'Parque Bob Kennedy', 'La Belle Park', 'Jardim das Mercês', 'Mercês',
      'Santa Clara', 'Morada Nova', 'Amaral de Matos', 'Lima Verde', 'Safira',
      'Saramanta', 'Alphaville', 'Damha', 'Ville de France',
    ],
    'Região Pirâmide': [
      'Pirâmide', 'Residencial Pirâmide', 'Parque Tiago Aroso', 'Recanto dos Poetas',
      'Todos os Santos', 'Eugênio Pereira', 'Morada do Sol', 'Vila Romualdo',
      'Loteamento Presidente Vargas', 'Residencial Araguaia', 'Residencial Turin',
    ],
    'Região Cumbique': [
      'Cumbique', 'Timbuba', 'Vila do Povo', 'Mojó', 'Vila Camões',
    ],
    'Região Iguaíba': [
      'Iguaíba', 'Sítio Natureza', 'Sítio Grande', 'Caiaré', 'Bacuritua',
      'Bom Negócio', 'Salinas', 'Cotovelo', 'Surucutiua', 'Itapera',
      'Ilha de Tambebeca',
    ],
    'Região Pindoba': [
      'Pindoba', 'Igara', 'Mocajituba', 'Porto do Mocajituba',
    ],
    'Região Sede de Paço do Lumiar': [
      'Centro de Paço do Lumiar', 'Vila Mercês', 'Tendal', 'Tendal Mirim',
      'Montanha Russa', 'Vila Nova', 'Granja Cururuca', 'Vila Gaspar',
    ],
    'Região Pau Deitado': [
      'Pau Deitado', 'Praia de Olho de Boi', 'Porto de Olho de Boi',
    ],
    'Região Pindaí': [
      'Pindaí', 'Luís Fernando', 'Alto do Laranjal', 'Boa Vista', 'Vassoural',
      'Residencial Portal do Paço',
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

export const TIPOS_VIA = ['Avenida', 'Rua', 'Estrada']

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