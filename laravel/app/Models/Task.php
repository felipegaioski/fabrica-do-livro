<?php

namespace App\Models;

use App\Models\Status;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model implements Auditable
{
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'title',
        'description',
        'status_id',
        'completed_at',
    ];

    protected $dates = ['completed_at'];

    protected $auditInclude = ['title', 'description', 'status_id', 'completed_at'];
    protected $auditEvents = ['created', 'updated', 'deleted'];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
