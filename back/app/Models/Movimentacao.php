<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movimentacao extends Model
{
    use HasFactory;

    protected $table = 'movimentacoes';

    protected $fillable = [
        'descricao', 'categoria', 'tipo', 'valor', 'data',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
        'data' => 'datetime',
    ];
}
