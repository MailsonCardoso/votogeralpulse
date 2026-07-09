<?php

namespace App\Http\Controllers\Api;

use App\Models\Cabo;

class CaboController extends BaseApiController
{
    protected string $model = Cabo::class;
    protected array $with = ['lideranca'];

    protected array $rules = [
        'nome' => 'required|string|max:255',
        'lideranca_id' => 'nullable|exists:liderancas,id',
        'regiao' => 'nullable|string',
        'eleitores' => 'nullable|integer',
        'visitas' => 'nullable|integer',
        'meta' => 'nullable|integer',
        'performance' => 'nullable|integer',
    ];
}
