<?php

namespace App\Http\Controllers\Api;

use App\Models\Atividade;

class AtividadeController extends BaseApiController
{
    protected string $model = Atividade::class;

    protected array $rules = [
        'usuario' => 'required|string|max:255',
        'acao' => 'nullable|string',
        'alvo' => 'nullable|string',
        'tempo' => 'nullable|date',
        'tipo' => 'nullable|string',
    ];
}
