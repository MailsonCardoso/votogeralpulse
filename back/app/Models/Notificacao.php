<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacao extends Model
{
    use HasFactory;

    protected $table = 'notificacoes';

    protected $fillable = [
        'titulo', 'corpo', 'tempo', 'lida', 'tipo',
    ];

    protected $casts = [
        'tempo' => 'datetime',
        'lida' => 'boolean',
    ];
}
