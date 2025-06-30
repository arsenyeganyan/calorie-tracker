//data api slice imports
import { useCallback } from "react";
import { 
    useAddToDayMutation,
    useGetDayDataQuery,
    Meal,
    useGetAllUserDaysQuery,
} from "../features/track/dataApiSlice";

export function useAddMeal() {
    const [addToDay, { isLoading }] = useAddToDayMutation();

    const addMeal = useCallback(async (meal: Meal) => {
        try {
            const data = await addToDay({ meal }).unwrap();
            console.log(data.msg);
        } catch (err) {
            console.log(err);
        }
    }, [addToDay]);

    return { addMeal, isLoading };
}

export function useDayData() {
    const { data: dayData, isLoading, isError } = useGetDayDataQuery();
    return { dayData, isLoading, isError };
}

export function useUserDays() {
    const { data: userDays, isLoading, isError } = useGetAllUserDaysQuery();
    return { userDays, isLoading, isError };
}