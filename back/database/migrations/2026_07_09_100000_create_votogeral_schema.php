<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('liderancas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('bairro')->nullable();
            $table->string('telefone')->nullable();
            $table->unsignedInteger('eleitores')->default(0);
            $table->unsignedInteger('convertidos')->default(0);
            $table->unsignedInteger('meta')->default(0);
            $table->unsignedTinyInteger('engajamento')->default(0);
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });

        Schema::create('cabos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->foreignId('lideranca_id')->nullable()->constrained('liderancas')->nullOnDelete();
            $table->string('regiao')->nullable();
            $table->unsignedInteger('eleitores')->default(0);
            $table->unsignedInteger('visitas')->default(0);
            $table->unsignedInteger('meta')->default(0);
            $table->unsignedTinyInteger('performance')->default(0);
            $table->timestamps();
        });

        Schema::create('eleitores', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('cpf')->nullable();
            $table->unsignedTinyInteger('idade')->nullable();
            $table->string('sexo')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->unsignedInteger('zona')->nullable();
            $table->unsignedInteger('secao')->nullable();
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->string('escolaridade')->nullable();
            $table->string('apoio')->nullable();
            $table->foreignId('lideranca_id')->nullable()->constrained('liderancas')->nullOnDelete();
            $table->foreignId('cabo_id')->nullable()->constrained('cabos')->nullOnDelete();
            $table->timestamp('cadastrado_em')->nullable();
            $table->timestamp('ultima_interacao')->nullable();
            $table->timestamps();
        });

        Schema::create('equipes', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('papel')->nullable();
            $table->string('email')->nullable();
            $table->string('telefone')->nullable();
            $table->string('bairro')->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamp('entrou_em')->nullable();
            $table->timestamps();
        });

        Schema::create('visitas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleitor_id')->constrained('eleitores')->cascadeOnDelete();
            $table->foreignId('cabo_id')->nullable()->constrained('cabos')->nullOnDelete();
            $table->timestamp('data')->nullable();
            $table->string('status')->default('agendada');
            $table->string('motivo')->nullable();
            $table->text('feedback')->nullable();
            $table->string('protocolo')->nullable();
            $table->timestamps();
        });

        Schema::create('pesquisas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->timestamp('data')->nullable();
            $table->unsignedInteger('amostra')->default(0);
            $table->json('intencao')->nullable();
            $table->json('perguntas')->nullable();
            $table->timestamps();
        });

        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->timestamp('data')->nullable();
            $table->string('local')->nullable();
            $table->string('bairro')->nullable();
            $table->string('tipo')->nullable();
            $table->string('status')->default('planejado');
            $table->unsignedInteger('confirmados')->default(0);
            $table->timestamps();
        });

        Schema::create('conversas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleitor_id')->nullable()->constrained('eleitores')->nullOnDelete();
            $table->string('nome');
            $table->string('bairro')->nullable();
            $table->json('tags')->nullable();
            $table->unsignedInteger('nao_lidas')->default(0);
            $table->boolean('online')->default(false);
            $table->json('mensagens')->nullable();
            $table->timestamps();
        });

        Schema::create('movimentacoes', function (Blueprint $table) {
            $table->id();
            $table->string('descricao');
            $table->string('categoria')->nullable();
            $table->string('tipo')->default('receita');
            $table->decimal('valor', 12, 2)->default(0);
            $table->timestamp('data')->nullable();
            $table->timestamps();
        });

        Schema::create('notificacoes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('corpo')->nullable();
            $table->timestamp('tempo')->nullable();
            $table->boolean('lida')->default(false);
            $table->string('tipo')->default('info');
            $table->timestamps();
        });

        Schema::create('atividades', function (Blueprint $table) {
            $table->id();
            $table->string('usuario');
            $table->string('acao')->nullable();
            $table->string('alvo')->nullable();
            $table->timestamp('tempo')->nullable();
            $table->string('tipo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atividades');
        Schema::dropIfExists('notificacoes');
        Schema::dropIfExists('movimentacoes');
        Schema::dropIfExists('conversas');
        Schema::dropIfExists('eventos');
        Schema::dropIfExists('pesquisas');
        Schema::dropIfExists('visitas');
        Schema::dropIfExists('equipes');
        Schema::dropIfExists('eleitores');
        Schema::dropIfExists('cabos');
        Schema::dropIfExists('liderancas');
    }
};
