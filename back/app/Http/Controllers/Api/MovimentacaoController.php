<?php

namespace App\Http\Controllers\Api;

use App\Models\Movimentacao;

class MovimentacaoController extends BaseApiController
{
    protected string $model = Movimentacao::class;

    protected array $rules = [
        'descricao' => 'required|string|max:255',
        'categoria' => 'nullable|string',
        'tipo' => 'nullable|string',
        'valor' => 'nullable|numeric',
        'data' => 'nullable|date',
    ];
}
