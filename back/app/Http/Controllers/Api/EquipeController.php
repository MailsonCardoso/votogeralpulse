<?php

namespace App\Http\Controllers\Api;

use App\Models\Equipe;

class EquipeController extends BaseApiController
{
    protected string $model = Equipe::class;

    protected array $rules = [
        'nome' => 'required|string|max:255',
        'papel' => 'nullable|string',
        'email' => 'nullable|email',
        'telefone' => 'nullable|string',
        'bairro' => 'nullable|string',
        'ativo' => 'nullable|boolean',
        'entrou_em' => 'nullable|date',
    ];
}
