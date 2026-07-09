<?php

namespace App\Http\Controllers\Api;

use App\Models\Evento;

class EventoController extends BaseApiController
{
    protected string $model = Evento::class;

    protected array $rules = [
        'titulo' => 'required|string|max:255',
        'data' => 'nullable|date',
        'local' => 'nullable|string',
        'bairro' => 'nullable|string',
        'tipo' => 'nullable|string',
        'status' => 'nullable|string',
        'confirmados' => 'nullable|integer',
    ];
}
