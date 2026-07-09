<?php

namespace App\Http\Controllers\Api;

use App\Models\Lideranca;

class LiderancaController extends BaseApiController
{
    protected string $model = Lideranca::class;

    protected array $rules = [
        'nome' => 'required|string|max:255',
        'bairro' => 'nullable|string',
        'telefone' => 'nullable|string',
        'eleitores' => 'nullable|integer',
        'convertidos' => 'nullable|integer',
        'meta' => 'nullable|integer',
        'engajamento' => 'nullable|integer',
        'ativo' => 'nullable|boolean',
    ];
}
