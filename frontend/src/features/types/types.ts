export type LoginRequest = {
    phone: string;
    password: string;
}

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};
export type UserResponse = {
    phone: string;
    password: string;
}

export interface IUser {
    id: string;
    phone: string;
}
export interface UserProfilesResponse {
    id: string;
    phone: string;
}

export interface AuthState {
    isAuth: boolean;
    isAuthChecking: boolean;
    user: UserProfilesResponse | null;
}


export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ITask {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateTask {
    title: string;
    description?: string;
    status?: TaskStatus;
}

export interface IUpdateTask {
    id: string;
    body: Partial<ICreateTask>;
}

