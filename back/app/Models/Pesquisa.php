<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesquisa extends Model
{
    use HasFactory;

    protected $table = 'pesquisas';

    protected $fillable = [
        'titulo', 'data', 'amostra', 'intencao', 'perguntas',
    ];

    protected $casts = [
        'data' => 'datetime',
        'amostra' => 'integer',
        'intencao' => 'json',
        'perguntas' => 'json',
    ];
}
