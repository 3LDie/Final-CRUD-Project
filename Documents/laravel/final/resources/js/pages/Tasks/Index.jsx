import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react'; // Added useState

export default function Index({ auth, tasks }) {
    // 1. State to track if we are editing a task
    const [editingTask, setEditingTask] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        description: '',
    });

    // 2. Function to fill the form for editing
    const startEdit = (task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description,
        });
    };

    // 3. Updated submit to handle both Create and Update
    const submit = (e) => {
        e.preventDefault();
        if (editingTask) {
            // UPDATING existing task
            put(`/tasks/${editingTask.id}`, {
                onSuccess: () => {
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            // CREATING new task
            post('/tasks', { onSuccess: () => reset() });
        }
    };

    const cancelEdit = () => {
        setEditingTask(null);
        reset();
    };

    return (
        <AppSidebarLayout user={auth.user}>
            <Head title="My Tasks" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* CREATE/EDIT FORM */}
                <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    
                    <input
                        value={data.title}
                        placeholder="Task Title"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
                        onChange={e => setData('title', e.target.value)}
                    />
                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}

                    <textarea
                        value={data.description}
                        placeholder="Task Description (Optional)"
                        className="block w-full mt-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        onChange={e => setData('description', e.target.value)}
                    ></textarea>

                    <div className="flex gap-2">
                        <button 
                            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-25 transition"
                            disabled={processing}
                        >
                            {editingTask ? 'Update' : 'Create'}
                        </button>

                        {editingTask && (
                            <button 
                                type="button"
                                onClick={cancelEdit}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold text-xs uppercase"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* READ LIST */}
                <div className="mt-8 space-y-4">
                    <h2 className="text-lg font-medium text-gray-400">Your Tasks</h2>
                    {tasks.length === 0 && <p className="text-gray-500 italic">No tasks yet.</p>}
                    
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-700">{task.title}</h3>
                                <p className="text-gray-600 mt-1">{task.description || "No description provided."}</p>
                                <span className="text-xs text-gray-400">Created: {new Date(task.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2">
                                {/* EDIT BUTTON */}
<button
    onClick={() => startEdit(task)}
    className="px-4 py-2 bg-amber-500 text-white rounded-md font-bold text-xs uppercase transition-all duration-200 hover:bg-amber-600 hover:shadow-lg active:scale-95"
>
    Edit
</button>

{/* DELETE BUTTON */}
<button
    onClick={(e) => {
        e.preventDefault();
        if (confirm('Are you sure?')) {
            router.delete(`/tasks/${task.id}`);
        }
    }}
    className="px-4 py-2 bg-red-600 text-white rounded-md font-bold text-xs uppercase transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-95"
>
    Delete
</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppSidebarLayout>
    );
}