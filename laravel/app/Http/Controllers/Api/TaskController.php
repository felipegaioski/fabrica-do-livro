<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Traits\ApiQueryBuilder;
use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    use ApiQueryBuilder;
    
    protected function getCustomFilters()
    {
        return [
            'id' => function ($query, $key, $input) {
                return $query->where('id', $input);
            },
            'title' => function ($query, $key, $input) {
                return $query->where('title', 'like', '%' . $input . '%');
            },
            'status' => function ($query, $key, $input) {
                return $query->where('status_id', $input);
            }
        ];
    }

    protected function getCustomSorts()
    {
        return [
            
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return TaskResource::collection(Task::query()->orderBy('id', 'desc')->paginate(10));
    }

    public function get(Request $request)
    {
        $query = Task::query();
        $query = $this->applyIncludes($query, $request);
        $query = $this->applyCustomFilters($query, $request);
        $query = $this->applySorting($query, $request);
        $tasks = $query->paginate(10);

        return response()->json([
            'error' => false,
            'tasks' => $tasks,
        ], 200);
    }

    public function find($id)
    {
        $task = Task::find($id);

        return response()->json([
            'error' => false,
            'task' => $task,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();

            $task = Task::create($data);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack(); 
        }
        
        return response(new TaskResource($task), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $model = Task::find($task->id);
        return $model;
        // return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();

            $task->update($data);
            
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
        }

        return response($task, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        try {
            DB::beginTransaction();

            $task->measurements()->delete();
            $task->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
        }

        return response('', 204);
    }
}
