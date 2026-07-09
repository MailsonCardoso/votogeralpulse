<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversa extends Model
{
    use HasFactory;

    protected $table = 'conversas';

    protected $fillable = [
        'eleitor_id', 'nome', 'bairro', 'tags', 'nao_lidas', 'online', 'mensagens',
    ];

    protected $casts = [
        'tags' => 'json',
        'mensagens' => 'json',
        'nao_lidas' => 'integer',
        'online' => 'boolean',
    ];

    public function eleitor(): BelongsTo
    {
        return $this->belongsTo(Eleitor::class);
    }
}
