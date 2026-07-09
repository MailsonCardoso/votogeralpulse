<?php

namespace App\Http\Controllers\Api;

use App\Models\Pesquisa;

class PesquisaController extends BaseApiController
{
    protected string $model = Pesquisa::class;

    protected array $rules = [
        'titulo' => 'required|string|max:255',
        'data' => 'nullable|date',
        'amostra' => 'nullable|integer',
        'intencao' => 'nullable|array',
        'perguntas' => 'nullable|array',
    ];
}
