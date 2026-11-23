
'use client';

import {useEffect, useMemo, useState} from 'react';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2,
    Circle,
    Clock3,
    Plus,
    Pencil,
    Trash2,
    LogOut,
    ListTodo,
} from 'lucide-react';

import TaskForm from '@/components/tasks/TaskForm';

import {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} from '@/store/endpoints/tasksApi';

import { authApi } from '@/store/endpoints/authApi';
import { logout } from '@/store/slice/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type {
    ITask,
    ICreateTask,
    TaskStatus,
} from '../../features/types/types';

type StatusFilter = TaskStatus | 'ALL';

const statusOptions: {
    value: TaskStatus;
    label: string;
}[] = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
];

export default function DashboardPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();


    const {
        data: tasks = [],
        isLoading,
        isError,
        refetch,
    } = useGetTasksQuery();




    const [createTask, { isLoading: isCreating }] =
        useCreateTaskMutation();

    const [updateTask, { isLoading: isUpdating }] =
        useUpdateTaskMutation();

    const [deleteTask] = useDeleteTaskMutation();

    const [filter, setFilter] = useState<StatusFilter>('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ITask | null>(
        null,
    );
    const [error, setError] = useState('');
    const [busyTaskId, setBusyTaskId] = useState<string | null>(
        null,
    );

    const filteredTasks = useMemo(() => {
        if (filter === 'ALL') return tasks;

        return tasks.filter((task) => task.status === filter);
    }, [tasks, filter]);

    const stats = useMemo(
        () => ({
            total: tasks.length,
            todo: tasks.filter((t) => t.status === 'TODO').length,
            inProgress: tasks.filter(
                (t) => t.status === 'IN_PROGRESS',
            ).length,
            done: tasks.filter((t) => t.status === 'DONE').length,
        }),
        [tasks],
    );

    const openCreateForm = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const openEditForm = (task: ITask) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    const handleSave = async (data: ICreateTask) => {
        if (editingTask) {
            await updateTask({
                id: editingTask.id,
                body: data,
            }).unwrap();
        } else {
            await createTask(data).unwrap();
        }

        closeForm();
    };

    const handleStatusChange = async (
        task: ITask,
        status: TaskStatus,
    ) => {
        setError('');
        setBusyTaskId(task.id);

        try {
            await updateTask({
                id: task.id,
                body: { status },
            }).unwrap();
        } catch {
            setError('Failed to update task status.');
        } finally {
            setBusyTaskId(null);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this task?',
        );

        if (!confirmed) return;

        setError('');
        setBusyTaskId(id);

        try {
            await deleteTask(id).unwrap();
        } catch {
            setError('Failed to delete task.');
        } finally {
            setBusyTaskId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        dispatch(logout());
        dispatch(authApi.util.resetApiState());

        router.replace('/login');
    };
    useEffect(() => {
        console.log(localStorage.getItem('accessToken'))
        console.log(localStorage.getItem('refreshToken'))
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <header className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <CheckCircle2 size={24} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold">TaskFlow</h1>
                            <p className="text-xs text-slate-500">
                                Task Management
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </header>

                <section className="mb-8">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        My Tasks
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Organize, track, and complete your tasks.
                    </p>
                </section>

                <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        {
                            label: 'Total Tasks',
                            value: stats.total,
                            icon: ListTodo,
                        },
                        {
                            label: 'To Do',
                            value: stats.todo,
                            icon: Circle,
                        },
                        {
                            label: 'In Progress',
                            value: stats.inProgress,
                            icon: Clock3,
                        },
                        {
                            label: 'Completed',
                            value: stats.done,
                            icon: CheckCircle2,
                        },
                    ].map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {item.label}
                  </span>
                                    <Icon size={18} className="text-slate-400" />
                                </div>

                                <p className="text-3xl font-semibold">
                                    {item.value}
                                </p>
                            </div>
                        );
                    })}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Task List
                            </h3>
                            <p className="text-sm text-slate-500">
                                {filteredTasks.length} tasks
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                aria-label="Filter by status"
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value as StatusFilter)
                                }
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                            >
                                <option value="ALL">All Statuses</option>
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={openCreateForm}
                                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                <Plus size={17} />
                                New Task
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mx-5 mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="p-12 text-center text-slate-500">
                            Loading tasks...
                        </div>
                    ) : isError ? (
                        <div className="p-12 text-center">
                            <p className="mb-4 text-slate-500">
                                Failed to load tasks.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="text-sm font-medium underline"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center px-4 py-16 text-center">
                            <ListTodo
                                size={40}
                                className="mb-4 text-slate-300"
                            />
                            <p className="font-medium">
                                No tasks found
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                {filter === 'ALL'
                                    ? 'Create your first task to get started.'
                                    : 'No tasks match this status.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-slate-900">
                                            {task.title}
                                        </h4>

                                        {task.description && (
                                            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-500">
                                                {task.description}
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-slate-400">
                                            {new Date(
                                                task.createdAt,
                                            ).toLocaleDateString('en-US')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <select
                                            aria-label={`Status for ${task.title}`}
                                            value={task.status}
                                            disabled={busyTaskId === task.id}
                                            onChange={(e) =>
                                                void handleStatusChange(
                                                    task,
                                                    e.target.value as TaskStatus,
                                                )
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:opacity-50"
                                        >
                                            {statusOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            aria-label={`Edit ${task.title}`}
                                            onClick={() => openEditForm(task)}
                                            disabled={busyTaskId === task.id}
                                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            aria-label={`Delete ${task.title}`}
                                            onClick={() => void handleDelete(task.id)}
                                            disabled={busyTaskId === task.id}
                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {isFormOpen && (
                <TaskForm
                    key={editingTask?.id ?? 'new'}
                    task={editingTask}
                    isLoading={isCreating || isUpdating}
                    onSubmit={handleSave}
                    onClose={closeForm}
                />
            )}
        </main>
    );
}
