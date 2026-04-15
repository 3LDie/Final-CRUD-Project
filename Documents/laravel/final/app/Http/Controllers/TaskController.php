<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index()
    {
        return Inertia::render('Tasks/Index', [
            'tasks' => auth()->user()->tasks()->latest()->get()
        ]);
    }

    /**
     * Store a newly created task in database. (CREATE)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $request->user()->tasks()->create($validated);

        return redirect()->route('tasks.index');
    }

    /**
     * Update the specified task in database. (UPDATE)
     */
    public function update(Request $request, Task $task)
    {
        // Security check: only the owner can update
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index');
    }

    /**
     * Remove the specified task from database. (DELETE)
     */
    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            abort(403);
        }

        $task->delete();

        return redirect()->route('tasks.index');
    }
}