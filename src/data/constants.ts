export const CIDADE_BAIRROS: Record<string, string[]> = {
  'São Luís': [
    'Centro', 'João Paulo', 'Cohab', 'São Francisco', 'Calhau',
    'Ponta d\'Areia', 'Renascença', 'Jaracati', 'Angelim', 'Vinhais',
    'Cohama', 'Monte Castelo', 'Alemanha', 'Liberdade', 'Anil',
    'Tirirical', 'Sacavém', 'Coroadinho', 'Vila Embratel', 'São Cristóvão',
    'Cidade Operária', 'Itaqui', 'Cohatrac', 'Turu', 'Maracanã',
    'Pedrinhas', 'Vila Esperança', 'Vila Luizão', 'Sá Viana', 'Cruzeiro do Anil',
    'Aurora', 'Fátima', 'Santo Antônio', 'Madre Deus', 'Apicum',
    'Goiabal', 'São Pantaleão', 'Desterro', 'Diamante', 'Camboa',
    'Recanto dos Vinhais', 'Alto do Calhau', 'Ponta do Farol',
  ],
  'Paço do Lumiar': [
    'Maiobão', 'Mocajituba', 'Pau Deitado', 'Pindoba', 'Iguaíba',
    'Trizidela', 'Vila São José', 'Boqueirão', 'Cinturão Verde',
    'Parque Bom Futuro', 'São Sebastião', 'São Bernardo', 'São Mateus',
    'São Raimundo', 'São Joaquim',
  ],
}

export const CIDADES = Object.keys(CIDADE_BAIRROS)

export const BAIRROS = Object.values(CIDADE_BAIRROS).flat()

export const ZONAS = Array.from({ length: 12 }, (_, i) => i + 1)
