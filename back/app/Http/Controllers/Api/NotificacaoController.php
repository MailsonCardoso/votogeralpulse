<?php

namespace App\Http\Controllers\Api;

use App\Models\Notificacao;

class NotificacaoController extends BaseApiController
{
    protected string $model = Notificacao::class;

    protected array $rules = [
        'titulo' => 'required|string|max:255',
        'corpo' => 'nullable|string',
        'tempo' => 'nullable|date',
        'lida' => 'nullable|boolean',
        'tipo' => 'nullable|string',
    ];
}
