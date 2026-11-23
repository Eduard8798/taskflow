
'use client';

import {useState, type FormEvent, useEffect} from 'react';
import { X, ListTodo } from 'lucide-react';

import type {
    ITask,
    ICreateTask,
} from '../../features/types/types';

interface TaskFormProps {
    task?: ITask | null;
    isLoading: boolean;
    onSubmit: (data: ICreateTask) => Promise<void>;
    onClose: () => void;
}

export default function TaskForm({
                                     task,
                                     isLoading,
                                     onSubmit,
                                     onClose,
                                 }: TaskFormProps) {
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(
        task?.description ?? '',
    );
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Task title is required.');
            return;
        }

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
            });
        } catch {
            setError('Failed to save task. Please try again.');
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-form-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            >
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                            <ListTodo size={22} className="text-slate-700" />
                        </div>

                        <div>
                            <h2
                                id="task-form-title"
                                className="text-xl font-semibold text-slate-900"
                            >
                                {task ? 'Edit Task' : 'Create New Task'}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {task
                                    ? 'Update your task details.'
                                    : 'Add a new task to your list.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label="Close"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="task-title"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Task Title <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            maxLength={150}
                            required
                            autoFocus
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="task-description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description..."
                            rows={5}
                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                        />
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading
                                ? 'Saving...'
                                : task
                                    ? 'Save Changes'
                                    : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
