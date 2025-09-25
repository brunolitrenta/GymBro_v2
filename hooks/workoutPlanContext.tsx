import { IWorkoutPlan } from "@/interfaces/IWorkoutPlan";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface WorkoutPlanProps {
    children: ReactNode
}

interface IWorkoutPlanContextData {
    workoutPlans: Array<IWorkoutPlan>,
    setWorkoutPlans: Dispatch<SetStateAction<Array<IWorkoutPlan>>>,
    activeWorkoutPlan: IWorkoutPlan | null,
    setActiveWorkoutPlan: Dispatch<SetStateAction<IWorkoutPlan | null>>
}

const WorkoutPlanContextData = createContext<IWorkoutPlanContextData>({} as IWorkoutPlanContextData)

export function WorkoutPlanContextProvider({ children }: WorkoutPlanProps) {

    const [workoutPlans, setWorkoutPlans] = useState<Array<IWorkoutPlan>>([])
    const [activeWorkoutPlan, setActiveWorkoutPlan] = useState<IWorkoutPlan | null>(null)

    return (
        <WorkoutPlanContextData.Provider value={{
            workoutPlans,
            setWorkoutPlans,
            activeWorkoutPlan,
            setActiveWorkoutPlan
        }}>
            {children}
        </WorkoutPlanContextData.Provider>
    )
}

export function useWorkoutPlan() {
    const context = useContext(WorkoutPlanContextData)
    
    if (!context) {
        throw new Error('useWorkoutPlan must be used within a WorkoutPlanContextProvider');
    }

    return context;
}