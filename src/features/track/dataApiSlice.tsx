import { apiSlice } from '../../app/api/apiSlice';

interface DataResponse {
    age: number,
    weight: number,
    height: number,
    gender: string,
    activityMultiplier: number,
    goal: string,
}

export interface Meal {
    name: string,
    calories: number,
    protein_g: number,
    carbohydrates_total_g: number,
    fat_total_g: number,
}

export interface UserDay {
    date: string,
    calories: number,
}

export const dataApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserData: builder.query<DataResponse, void>({
            query: () => 'data/getUserData',
        }),
        addToDay: builder.mutation({
            query: credentials => ({
                url: 'data/addToDay',
                method: 'POST',
                body: { ...credentials },
            })  
        }),
        getDayData: builder.query<Meal[], void>({
            query: () => 'data/getDayData',
        }),
        getAllUserDays: builder.query<UserDay[], void>({
            query: () => 'data/getAllUserDays',
        }),
    })
})

export const {
    useGetUserDataQuery,
    useAddToDayMutation,
    useGetDayDataQuery,
    useGetAllUserDaysQuery,
} = dataApiSlice;