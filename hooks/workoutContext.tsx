import { ISaveWorkout } from "@/interfaces/ISaveWorkout";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface WorkoutProps {
    children: ReactNode
}

interface IWorkoutContextData {
    saveWorkout: Array<ISaveWorkout>,
    setSaveWorkout: Dispatch<SetStateAction<Array<ISaveWorkout>>>
}

const WorkoutContextData = createContext<IWorkoutContextData>({} as IWorkoutContextData)

export function WorkoutContextProvider({ children }: WorkoutProps) {

    const [saveWorkout, setSaveWorkout] = useState<Array<ISaveWorkout>>([])

    return (
        <WorkoutContextData.Provider value={{
            saveWorkout,
            setSaveWorkout
        }}>
            {children}
        </WorkoutContextData.Provider>
    )
}

export function useWorkout() {
    const context = useContext(WorkoutContextData)

    return context;
}