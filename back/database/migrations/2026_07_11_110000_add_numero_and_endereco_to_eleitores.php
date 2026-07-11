<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('eleitores', function (Blueprint $table) {
            $table->string('numero')->after('tipo_via');
            $table->string('endereco')->after('numero');
        });
    }

    public function down(): void
    {
        Schema::table('eleitores', function (Blueprint $table) {
            $table->dropColumn(['numero', 'endereco']);
        });
    }
};
