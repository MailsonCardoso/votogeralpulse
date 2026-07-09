<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleitor;
use App\Models\Lideranca;
use App\Models\Visita;
use App\Models\Conversa;
use App\Models\Movimentacao;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $eleitores = Eleitor::query();
        $totalEleitores = $eleitores->count();
        $convertidos = $eleitores
            ->whereIn('apoio', ['ferrenho', 'provavel'])
            ->count();
        $liderancas = Lideranca::count();
        $visitas = Visita::count();

        $intencao = $eleitores
            ->select('apoio', DB::raw('count(*) as total'))
            ->groupBy('apoio')
            ->pluck('total', 'apoio')
            ->toArray();

        $bairros = $eleitores
            ->select('bairro', DB::raw('count(*) as total'))
            ->groupBy('bairro')
            ->orderByDesc('total')
            ->limit(6)
            ->get()
            ->map(fn ($row) => ['bairro' => $row->bairro, 'total' => $row->total]);

        $saldo = Movimentacao::select(
            DB::raw("SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as receitas"),
            DB::raw("SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as despesas"),
        )->first();

        return response()->json([
            'kpis' => [
                'eleitores' => $totalEleitores,
                'convertidos' => $convertidos,
                'liderancas' => $liderancas,
                'visitas' => $visitas,
                'conversas' => Conversa::count(),
                'saldo' => (float) ($saldo->receitas ?? 0) - (float) ($saldo->despesas ?? 0),
            ],
            'intencao' => [
                ['nome' => 'Ferrenho', 'valor' => $intencao['ferrenho'] ?? 0],
                ['nome' => 'Provável', 'valor' => $intencao['provavel'] ?? 0],
                ['nome' => 'Indeciso', 'valor' => $intencao['indeciso'] ?? 0],
                ['nome' => 'Adversário', 'valor' => $intencao['adversario'] ?? 0],
            ],
            'bairros_top' => $bairros,
        ]);
    }
}
