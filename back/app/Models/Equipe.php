<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipe extends Model
{
    use HasFactory;

    protected $table = 'equipes';

    protected $fillable = [
        'nome', 'papel', 'email', 'telefone', 'bairro', 'ativo', 'entrou_em',
    ];

    protected $casts = [
        'ativo' => 'boolean',
        'entrou_em' => 'datetime',
    ];
}
