import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Added useEffect

export default function Index({ auth, tasks }) {
    const [editingTask, setEditingTask] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        description: '',
    });

    // EFFECT: This ensures the form updates whenever editingTask is set
    useEffect(() => {
        if (editingTask) {
            setData({
                title: editingTask.title,
                description: editingTask.description,
            });
        }
    }, [editingTask]);

    const submit = (e) => {
        e.preventDefault();
        if (editingTask) {
            // Logic for Update (PUT)
            put(`/tasks/${editingTask.id}`, {
                onSuccess: () => {
                    setEditingTask(null);
                    reset();
                },
            });
        } else {
            // Logic for Create (POST)
            post('/tasks', { 
                onSuccess: () => reset() 
            });
        }
    };

    const handleCancel = () => {
        setEditingTask(null);
        reset();
    };

    return (
        <AppSidebarLayout user={auth.user}>
            <Head title="My Tasks" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
                <div className="max-w-3xl mx-auto">
                    
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Task Manager Pro
                        </h1>
                        <p className="text-gray-500 mt-2">Manage your daily workflow with ease</p>
                    </div>

                    {/* FORM SECTION */}
                    <form onSubmit={submit} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white mb-10 transition-all">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                            {editingTask ? 'Editing Mode' : 'New Task'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <input
                                    value={data.title}
                                    placeholder="What needs to be done?"
                                    className="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 p-3 transition-all"
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <textarea
                                value={data.description}
                                placeholder="Add some details..."
                                className="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 p-3 min-h-[100px]"
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                                disabled={processing}
                            >
                                {editingTask ? 'Update Task' : 'Save Task'}
                            </button>

                            {editingTask && (
                                <button 
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold uppercase hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* LIST SECTION */}
                    <div className="space-y-4">
                        <div className="flex justify-between px-2">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Your Tasks ({tasks.length})</h3>
                        </div>

                        {tasks.map(task => (
                            <div key={task.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                                    <p className="text-gray-500 mt-1 text-sm">{task.description || "No details provided."}</p>
                                </div>

                                <div className="flex gap-4 ml-4">
                                    <button
                                        onClick={() => {
                                            setEditingTask(task);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-amber-500 font-bold text-xs uppercase hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirm('Delete this task?') && router.delete(`/tasks/${task.id}`)}
                                        className="text-red-500 font-bold text-xs uppercase hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}