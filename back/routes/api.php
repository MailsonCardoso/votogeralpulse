<?php

use App\Http\Controllers\Api\AtividadeController;
use App\Http\Controllers\Api\CaboController;
use App\Http\Controllers\Api\ConversaController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EleitorController;
use App\Http\Controllers\Api\EquipeController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\LiderancaController;
use App\Http\Controllers\Api\MovimentacaoController;
use App\Http\Controllers\Api\NotificacaoController;
use App\Http\Controllers\Api\PesquisaController;
use App\Http\Controllers\Api\VisitaController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('eleitores', EleitorController::class);
    Route::apiResource('liderancas', LiderancaController::class);
    Route::apiResource('cabos', CaboController::class);
    Route::apiResource('equipes', EquipeController::class);
    Route::apiResource('visitas', VisitaController::class);
    Route::apiResource('pesquisas', PesquisaController::class);
    Route::apiResource('eventos', EventoController::class);
    Route::apiResource('conversas', ConversaController::class);
    Route::apiResource('movimentacoes', MovimentacaoController::class);
    Route::apiResource('notificacoes', NotificacaoController::class);
    Route::apiResource('atividades', AtividadeController::class);
});
