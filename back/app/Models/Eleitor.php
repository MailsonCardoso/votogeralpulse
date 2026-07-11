<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Eleitor extends Model
{
    use HasFactory;

    protected $table = 'eleitores';

    protected $fillable = [
        'nome', 'cpf', 'idade', 'sexo', 'bairro', 'cidade', 'regiao', 'tipo_via', 'zona', 'secao',
        'telefone', 'email', 'escolaridade', 'apoio', 'lideranca_id', 'cabo_id',
        'cadastrado_em', 'ultima_interacao',
    ];

    protected $casts = [
        'idade' => 'integer',
        'zona' => 'integer',
        'secao' => 'integer',
        'cadastrado_em' => 'datetime',
        'ultima_interacao' => 'datetime',
    ];

    public function lideranca(): BelongsTo
    {
        return $this->belongsTo(Lideranca::class);
    }

    public function cabo(): BelongsTo
    {
        return $this->belongsTo(Cabo::class);
    }

    public function visitas(): HasMany
    {
        return $this->hasMany(Visita::class);
    }

    public function conversas(): HasMany
    {
        return $this->hasMany(Conversa::class);
    }
}
