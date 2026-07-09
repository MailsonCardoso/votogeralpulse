<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversa;

class ConversaController extends BaseApiController
{
    protected string $model = Conversa::class;
    protected array $with = ['eleitor'];

    protected array $rules = [
        'eleitor_id' => 'nullable|exists:eleitores,id',
        'nome' => 'required|string|max:255',
        'bairro' => 'nullable|string',
        'tags' => 'nullable|array',
        'nao_lidas' => 'nullable|integer',
        'online' => 'nullable|boolean',
        'mensagens' => 'nullable|array',
    ];
}
