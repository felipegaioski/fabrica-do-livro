<?php

namespace App\Http\Controllers\Api;

use App\Models\Status;
use Illuminate\Http\Request;
use App\Traits\ApiQueryBuilder;
use App\Http\Controllers\Controller;

class StatusController extends Controller
{
    use ApiQueryBuilder;
    
    public function get(Request $request)
    {
        $query = Status::query();
        $query = $this->applyIncludes($query, $request);
        $query = $this->applyCustomFilters($query, $request);
        $query = $this->applySorting($query, $request);

        return response()->json([
            'error' => false,
            'statuses' => $query->get(),
        ], 200);
    }
}
