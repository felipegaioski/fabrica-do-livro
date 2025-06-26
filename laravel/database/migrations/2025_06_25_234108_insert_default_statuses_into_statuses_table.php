<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::table('statuses')->insert([
            ['name' => 'Pendente', 'color' => '#ffc107'],
            ['name' => 'Concluída', 'color' => '#28a745'],
        ]);
    }

    public function down(): void
    {
        DB::table('statuses')->whereIn('name', ['Pendente', 'Concluída'])->delete();
    }
};
