<?php

namespace Database\Seeders;

use App\Models\Atividade;
use App\Models\Cabo;
use App\Models\Conversa;
use App\Models\Eleitor;
use App\Models\Equipe;
use App\Models\Evento;
use App\Models\Lideranca;
use App\Models\Movimentacao;
use App\Models\Notificacao;
use App\Models\Pesquisa;
use App\Models\Visita;
use Faker\Factory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Factory::create('pt_BR');

        $bairros = [
            'Jardim Paulista', 'Vila Mariana', 'Mooca', 'Lapa', 'Santana', 'Tatuapé',
            'Pinheiros', 'Ipiranga', 'Campo Limpo', 'Itaquera', 'Penha', 'Vila Prudente',
            'Butantã', 'Freguesia do Ó', 'Cidade Tiradentes', 'Guaianases', 'Cidade Ademar',
            'Vila Nova Conceição', 'Bela Vista', 'Consolação', 'Bom Retiro', 'Pari',
        ];
        $cidades = [
            'São Paulo', 'Campinas', 'Guarulhos', 'Osasco', 'Santo André',
            'São Bernardo', 'Sorocaba', 'Jundiaí', 'São José dos Campos', 'Ribeirão Preto',
        ];
        $apoios = ['ferrenho', 'provavel', 'indeciso', 'adversario'];
        $sexos = ['Masculino', 'Feminino'];
        $escolaridades = ['Fundamental', 'Médio', 'Superior', 'Pós-graduação'];
        $papeis = [
            'Coordenador', 'Cab furado', 'Liderança', 'Voluntário', 'Assessor',
            'Analista de Dados', 'Social Media', 'Financeiro',
        ];

        $liderancas = [];
        for ($i = 0; $i < 12; $i++) {
            $eleitores = $faker->numberBetween(40, 220);
            $liderancas[] = Lideranca::create([
                'nome' => $faker->name(),
                'bairro' => $faker->randomElement($bairros),
                'telefone' => $faker->cellphoneNumber(),
                'eleitores' => $eleitores,
                'convertidos' => (int) ($eleitores * $faker->randomFloat(2, 0.3, 0.8)),
                'meta' => (int) ($eleitores * 1.2),
                'engajamento' => $faker->numberBetween(45, 98),
                'ativo' => $faker->boolean(85),
            ]);
        }

        $cabos = [];
        for ($i = 0; $i < 20; $i++) {
            $eleitores = $faker->numberBetween(15, 90);
            $cabos[] = Cabo::create([
                'nome' => $faker->name(),
                'lideranca_id' => $faker->randomElement($liderancas)->id,
                'regiao' => $faker->randomElement($bairros),
                'eleitores' => $eleitores,
                'visitas' => $faker->numberBetween(10, $eleitores),
                'meta' => (int) ($eleitores * 1.3),
                'performance' => $faker->numberBetween(40, 99),
            ]);
        }

        $eleitores = [];
        for ($i = 0; $i < 120; $i++) {
            $eleitores[] = Eleitor::create([
                'nome' => $faker->name(),
                'cpf' => $faker->cpf(false),
                'idade' => $faker->numberBetween(16, 89),
                'sexo' => $faker->randomElement($sexos),
                'bairro' => $faker->randomElement($bairros),
                'cidade' => $faker->randomElement($cidades),
                'zona' => $faker->numberBetween(1, 380),
                'secao' => $faker->numberBetween(1, 450),
                'telefone' => $faker->cellphoneNumber(),
                'email' => $faker->safeEmail(),
                'escolaridade' => $faker->randomElement($escolaridades),
                'apoio' => $faker->randomElement($apoios),
                'lideranca_id' => $faker->randomElement($liderancas)->id,
                'cabo_id' => $faker->randomElement($cabos)->id,
                'cadastrado_em' => $faker->dateTimeBetween('-1 year', 'now'),
                'ultima_interacao' => $faker->dateTimeBetween('-6 months', 'now'),
            ]);
        }

        for ($i = 0; $i < 14; $i++) {
            Equipe::create([
                'nome' => $faker->name(),
                'papel' => $faker->randomElement($papeis),
                'email' => $faker->safeEmail(),
                'telefone' => $faker->cellphoneNumber(),
                'bairro' => $faker->randomElement($bairros),
                'ativo' => $faker->boolean(90),
                'entrou_em' => $faker->dateTimeBetween('-1 year', 'now'),
            ]);
        }

        $statusVisita = ['agendada', 'concluida', 'concluida', 'cancelada'];
        for ($i = 0; $i < 30; $i++) {
            $status = $faker->randomElement($statusVisita);
            Visita::create([
                'eleitor_id' => $faker->randomElement($eleitores)->id,
                'cabo_id' => $faker->randomElement($cabos)->id,
                'data' => $faker->dateTimeBetween('-6 months', '+1 month'),
                'status' => $status,
                'motivo' => $faker->randomElement([
                    'Apoio presencial', 'Entrega de material', 'Debate de propostas',
                    'Censo eleitoral', 'Convite para evento', 'Resolução de dúvidas',
                ]),
                'feedback' => $status === 'concluida' ? $faker->sentence() : null,
                'protocolo' => 'VT-' . $faker->numberBetween(1000, 9999),
            ]);
        }

        Pesquisa::create([
            'titulo' => 'Intenção de voto — 1º turno',
            'data' => $faker->dateTimeBetween('-2 months', 'now'),
            'amostra' => 1840,
            'intencao' => [
                ['nome' => 'Candidato A (nosso)', 'valor' => 38],
                ['nome' => 'Candidato B', 'valor' => 29],
                ['nome' => 'Candidato C', 'valor' => 14],
                ['nome' => 'Branco/Nulo', 'valor' => 9],
                ['nome' => 'Indeciso', 'valor' => 10],
            ],
            'perguntas' => [
                ['pergunta' => 'Aprova avaliação do prefeito atual?', 'aprovacao' => 41],
                ['pergunta' => 'Segurança é prioridade?', 'aprovacao' => 88],
                ['pergunta' => 'Saúde é prioridade?', 'aprovacao' => 81],
            ],
        ]);

        $tiposEvento = ['Comício', 'Caminhada', 'Debate', 'Social', 'Institucional'];
        $statusEvento = ['planejado', 'confirmado', 'confirmado', 'realizado', 'cancelado'];
        for ($i = 0; $i < 15; $i++) {
            Evento::create([
                'titulo' => $faker->randomElement([
                    'Comício na Praça Central', 'Caminhada no bairro', 'Roda de conversa',
                    'Lançamento de candidatura', 'Carreata', 'Café com lideranças',
                    'Mutirão de limpeza', 'Audiência pública', 'Reunião de cabos',
                ]),
                'data' => $faker->dateTimeBetween('now', '+8 months'),
                'local' => $faker->randomElement([
                    'Praça da Sé', 'Ginásio Municipal', 'Centro Comunitário',
                    'Clube dos Bancários', 'Teatro Municipal', 'Quadra da Escola',
                ]),
                'bairro' => $faker->randomElement($bairros),
                'tipo' => $faker->randomElement($tiposEvento),
                'status' => $faker->randomElement($statusEvento),
                'confirmados' => $faker->numberBetween(20, 480),
            ]);
        }

        for ($i = 0; $i < 40; $i++) {
            $eleitor = $faker->randomElement($eleitores);
            $mensagens = [];
            $n = $faker->numberBetween(3, 8);
            for ($j = 0; $j < $n; $j++) {
                $mensagens[] = [
                    'id' => (string) $faker->unique()->randomNumber(6),
                    'de' => $j % 2 === 0 ? 'eleitor' : 'cabo',
                    'texto' => $faker->sentence(),
                    'hora' => $faker->numberBetween(8, 20) . ':' . str_pad($faker->numberBetween(0, 59), 2, '0'),
                ];
            }
            Conversa::create([
                'eleitor_id' => $eleitor->id,
                'nome' => $eleitor->nome,
                'bairro' => $eleitor->bairro,
                'tags' => [$eleitor->apoio, $faker->randomElement(['whatsapp', 'receptivo', 'prioridade'])],
                'nao_lidas' => $faker->boolean(40) ? $faker->numberBetween(1, 4) : 0,
                'online' => $faker->boolean(50),
                'mensagens' => $mensagens,
            ]);
        }

        for ($i = 0; $i < 24; $i++) {
            $tipo = $faker->boolean(55) ? 'receita' : 'despesa';
            Movimentacao::create([
                'descricao' => $tipo === 'receita'
                    ? $faker->randomElement([
                        'Doação de campanha — Pessoa Física', 'Verba partidária',
                        'Financiamento coletivo', 'Evento beneficente',
                    ])
                    : $faker->randomElement([
                        'Impressão de material gráfico', 'Aluguel de palco',
                        'Combustível da carreata', 'Tráfego pago Instagram',
                        'Café da manhã com lideranças', 'Transporte de voluntários',
                    ]),
                'categoria' => $faker->randomElement(['Marketing', 'Eventos', 'Logística', 'Pessoal', 'Doações']),
                'tipo' => $tipo,
                'valor' => $faker->randomFloat(2, 350, 18000),
                'data' => $faker->dateTimeBetween('-6 months', 'now'),
            ]);
        }

        Notificacao::create([
            'titulo' => 'Nova liderança cadastrada',
            'corpo' => 'Uma nova liderança entrou na equipe.',
            'tempo' => now()->subHours(2),
            'lida' => false,
            'tipo' => 'success',
        ]);
        Notificacao::create([
            'titulo' => 'Meta de bairro em risco',
            'corpo' => 'Um bairro está abaixo da meta semanal.',
            'tempo' => now()->subDay(),
            'lida' => false,
            'tipo' => 'warning',
        ]);

        for ($i = 0; $i < 10; $i++) {
            Atividade::create([
                'usuario' => $faker->name(),
                'acao' => $faker->randomElement(['cadastrou', 'atualizou', 'converteu', 'agendou visita para', 'enviou mensagem para']),
                'alvo' => $faker->randomElement(['12 eleitores', 'um cabo', 'a pesquisa 1º turno', 'o evento de sábado']),
                'tempo' => $faker->dateTimeBetween('-7 days', 'now'),
                'tipo' => $faker->randomElement(['create', 'update', 'message', 'visit', 'event']),
            ]);
        }
    }
}
