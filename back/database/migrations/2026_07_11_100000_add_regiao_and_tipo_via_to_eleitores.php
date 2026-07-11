<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('eleitores', function (Blueprint $table) {
            $table->string('regiao')->nullable()->after('cidade');
            $table->string('tipo_via')->nullable()->after('bairro');
        });
    }

    public function down(): void
    {
        Schema::table('eleitores', function (Blueprint $table) {
            $table->dropColumn(['regiao', 'tipo_via']);
        });
    }
};
