<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lideranca extends Model
{
    use HasFactory;

    protected $table = 'liderancas';

    protected $fillable = [
        'nome', 'bairro', 'telefone', 'eleitores', 'convertidos',
        'meta', 'engajamento', 'ativo',
    ];

    protected $casts = [
        'eleitores' => 'integer',
        'convertidos' => 'integer',
        'meta' => 'integer',
        'engajamento' => 'integer',
        'ativo' => 'boolean',
    ];

    public function cabos(): HasMany
    {
        return $this->hasMany(Cabo::class);
    }

    public function eleitores(): HasMany
    {
        return $this->hasMany(Eleitor::class);
    }
}
