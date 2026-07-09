<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cabo extends Model
{
    use HasFactory;

    protected $table = 'cabos';

    protected $fillable = [
        'nome', 'lideranca_id', 'regiao', 'eleitores', 'visitas',
        'meta', 'performance',
    ];

    protected $casts = [
        'eleitores' => 'integer',
        'visitas' => 'integer',
        'meta' => 'integer',
        'performance' => 'integer',
    ];

    public function lideranca(): BelongsTo
    {
        return $this->belongsTo(Lideranca::class);
    }

    public function eleitores(): HasMany
    {
        return $this->hasMany(Eleitor::class);
    }
}
