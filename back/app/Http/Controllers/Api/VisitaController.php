<?php

namespace App\Http\Controllers\Api;

use App\Models\Visita;

class VisitaController extends BaseApiController
{
    protected string $model = Visita::class;
    protected array $with = ['eleitor', 'cabo'];

    protected array $rules = [
        'eleitor_id' => 'required|exists:eleitores,id',
        'cabo_id' => 'nullable|exists:cabos,id',
        'data' => 'nullable|date',
        'status' => 'nullable|string',
        'motivo' => 'nullable|string',
        'feedback' => 'nullable|string',
        'protocolo' => 'nullable|string',
    ];
}
