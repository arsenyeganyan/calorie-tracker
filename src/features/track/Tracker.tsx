import { useState,  useMemo, useEffect } from "react";

import calculateCalories from "../../utils/calculateCalories";
import { getFoodInfo } from "../../utils/getFoodInfo";

import { useGetUserDataQuery } from "./dataApiSlice";
import { Meal } from "./dataApiSlice";

import { useAddMeal, useDayData } from "../../utils/dayActions";

function Tracker() {
    const [search, setSearch] = useState<string | null>();
    const [amount, setAmount] = useState<number>(0);
    const [fetchedData, setFetchedData] = useState<Meal[]>([]);

    //custom hooks
    const { addMeal } = useAddMeal();
    const { dayData, isLoading: isDayLoading, isError: isDayError } = useDayData();

    const { data: userData, isLoading, isError } = useGetUserDataQuery();
    const dailyIntake = useMemo(() => {
        if (!userData) return 0;
        return calculateCalories(
            userData.age, userData.weight, userData.height, userData.gender, userData.activityMultiplier, userData.goal
        );
    }, [userData]);

    const [addedData, setAddedData] = useState<Meal[]>([]);
    useEffect(() => {
        console.log("Getting day data...");
        console.log("gotten day data: ", dayData);
        
        setAddedData([...(dayData || [])]);
        console.log(addedData);
    }, [dayData]);

    const [remaining, setRemaining] = useState<number>(() => {
        const stored = localStorage.getItem('remaining');
        return stored ? JSON.parse(stored) : dailyIntake;
    });

    const [errMsg, setErrMsg] = useState<string>('');
    
    useEffect(() => setErrMsg(''), []);

    useEffect(() => {
        let eaten = 0;
        for(let i = 0; i < addedData.length; ++i) {
            eaten += addedData[i].calories;
        }

        setRemaining(dailyIntake - eaten);
    }, [addedData, dailyIntake]);

    //debugging
    // useEffect(() => {
    //   console.log('fetched food: ', fetchedData);
    // }, [fetchedData]);
    
    const handleSearchInput = (e:any) => setSearch(e.target.value);
    const handleAmountInput = (e:any) => setAmount(e.target.value);

    const handleSearchSubmit = async (e: any) => {
        e.preventDefault();
        let queryString = `${amount}lb ${search}`;

        const info = await getFoodInfo(queryString);
        if(info?.length == 0) {
            setErrMsg("Couldn't find the meal you were searching for.");
            return;
        }

        setFetchedData(info);
    }

    const handleFoodAdd = (item: Meal) => {
        if (fetchedData.length === 0) return;

        const newMeal = {
            name: item.name,
            calories: item.calories,
            protein_g: item.protein_g,
            carbohydrates_total_g: item.carbohydrates_total_g,
            fat_total_g: item.fat_total_g,
        };

        const updated = [...addedData, newMeal];
        setAddedData(updated);

        addMeal(newMeal);
    };

  return (
    <div className='mt-30'>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Calorie Tracker</h1>

        <div className="grid grid-cols-2 gap-6 mb-8 text-center">
            <div className="bg-indigo-50 p-4 rounded-lg shadow">
                <h2 className="text-sm text-gray-600">Daily Goal</h2>
                <p className="text-2xl font-semibold text-indigo-700">{dailyIntake}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
                <h2 className="text-sm text-gray-600">Remaining</h2>
                <p className="text-2xl font-semibold text-green-700">{remaining}</p>
            </div>
        </div>

        <form className="space-y-4 mb-8" onSubmit={handleSearchSubmit}>
            <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="amount">Amount</label>
            <input type="number" id="amount" name="amount" placeholder="e.g. 1 (lb)"
                onChange={handleAmountInput}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="mealName">Meal</label>
            <input type="search" id="mealName" name="mealName" placeholder="e.g. chicken and eggs"
                onChange={handleSearchInput}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <button type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Search Meal
            </button>
            <p>{errMsg}</p>
            <div>
                <ul className="space-y-2">
                    {fetchedData.map((d, index) => (
                        <li 
                            className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow cursor-pointer"
                            onClick={() => handleFoodAdd(d)}
                            key={index}
                        >
                            <span>{d?.name} (info in g)</span>
                            <span>{d?.calories} kcal</span>
                            <span>Protein: {d?.protein_g}</span>
                            <span>Carbs: {d?.carbohydrates_total_g}</span>
                            <span>Fat: {d?.fat_total_g}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </form>
        <div>
          {isError && isError}
          {isLoading && isLoading}
        </div>
        <div>
            <h3 className="text-xl font-semibold mb-4">Today's Meals</h3>
            <ul className="space-y-2">
                {(addedData && !isDayLoading && !isDayError) && addedData.map((d, index) => (
                    <li 
                        className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow cursor-pointer"
                        onClick={() => handleFoodAdd(d)}
                        key={index}
                    >
                        <span>{d?.name} (info in g)</span>
                        <span>{d?.calories} kcal</span>
                        <span>Protein: {d?.protein_g}</span>
                        <span>Carbs: {d?.carbohydrates_total_g}</span>
                        <span>Fat: {d?.fat_total_g}</span>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    </div>
  )
}

export default Tracker;