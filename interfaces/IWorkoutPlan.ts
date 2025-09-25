import { ISaveWorkout } from "./ISaveWorkout";

export interface IWorkoutPlan {
    id: string;
    name: string;
    description?: string;
    workouts: Array<ISaveWorkout>;
    createdAt: Date;
    isActive: boolean;
}