<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $table = 'eventos';

    protected $fillable = [
        'titulo', 'data', 'local', 'bairro', 'tipo', 'status', 'confirmados',
    ];

    protected $casts = [
        'data' => 'datetime',
        'confirmados' => 'integer',
    ];
}
