<?php

namespace App\Services;

use OwenIt\Auditing\Models\Audit;
use Carbon\Carbon;

class AuditFormatter
{
    protected static array $modelLabels = [
        'App\Models\User' => 'Usuário',
        'App\Models\Construction' => 'Obra',
        'App\Models\Measurement' => 'Medição',
        'App\Models\Unit' => 'Unidade',
        'App\Models\UnitCategory' => 'Categoria de unidade',
        'App\Models\Status' => 'Status',
        'App\Models\Task' => 'Tarefa'
    ];

    protected static function translateModel(string $class): string
    {
        return self::$modelLabels[$class] ?? class_basename($class);
    }

    public static function toTextArray(Audit $audit)
    {
        $user = $audit->user ? $audit->user->name : 'desconhecido';
        $event = $audit->event;
        $model = self::translateModel($audit->auditable_type);
        $date = Carbon::parse($audit->created_at)->format('d/m/Y H:i');

        switch ($event) {
            case 'created':
                return [
                    'id' => $audit->id,
                    'user' => $user,
                    'event' => "Criou um(a) novo(a) {$model}",
                    'date' => $date
                ];
            case 'updated':
                return [
                    'id' => $audit->id,
                    'user' => $user,
                    'event' => "Atualizou o(a) {$model} # {$audit->auditable_id}",
                    'date' => $date
                ];
            case 'deleted':
                return [
                    'id' => $audit->id,
                    'user' => $user,
                    'event' => "Deletou o(a) {$model} # {$audit->auditable_id}",
                    'date' => $date
                ];
            default:
                return [
                    'id' => $audit->id,
                    'user' => $user,
                    'event' => "Fez uma ação em {$model} # {$audit->auditable_id}",
                    'date' => $date
                ];
        }

        // switch ($event) {
        //     case 'created':
        //         return [
        //             'id' => $audit->id,
        //             'event' => "Usuário {$user} criou um(a) novo(a) {$model} em {$date}"
        //         ];
        //     case 'updated':
        //         return [
        //             'id' => $audit->id,
        //             'event' => "Usuário {$user} atualizou um(a) {$model} em {$date}"
        //         ];
        //     case 'deleted':
        //         return [
        //             'id' => $audit->id,
        //             'event' => "Usuário {$user} deletou um(a) {$model} em {$date}"
        //         ];
        //     default:
        //         return [
        //             'id' => $audit->id,
        //             'event' => "Usuário {$user} fez uma ação em {$model} em {$date}"
        //         ];
        // }
    }
}