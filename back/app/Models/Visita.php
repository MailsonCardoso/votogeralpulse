<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visita extends Model
{
    use HasFactory;

    protected $table = 'visitas';

    protected $fillable = [
        'eleitor_id', 'cabo_id', 'data', 'status', 'motivo', 'feedback', 'protocolo',
    ];

    protected $casts = [
        'data' => 'datetime',
    ];

    public function eleitor(): BelongsTo
    {
        return $this->belongsTo(Eleitor::class);
    }

    public function cabo(): BelongsTo
    {
        return $this->belongsTo(Cabo::class);
    }
}
