<?php

namespace App\Models;

use App\Models\Status;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'title',
        'description',
        'status_id',
    ];

    protected $auditInclude = ['title', 'description', 'status_id'];
    protected $auditEvents = ['created', 'updated', 'deleted'];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
