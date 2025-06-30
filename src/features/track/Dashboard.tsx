import { useEffect, useState } from 'react'
import { useUserDays } from '../../utils/dayActions'
import { UserDay } from './dataApiSlice';

function calcAvgCalories(days: UserDay[]) {
  let cal = 0;
  for(let i = 0; i < days.length; ++i)  {
      cal+=days[i].calories;
  }

  return cal / days.length;
}

function Dashboard() {
  const { userDays, isLoading, isError } = useUserDays() as {
    userDays: UserDay[];
    isLoading: boolean;
    isError: boolean;
  };

  const [avgCals, setAvgCals] = useState<number>(0);

  useEffect(() => {
        console.log(userDays);
        
        if (userDays && Array.isArray(userDays)) {
            setAvgCals(calcAvgCalories(userDays));
        }
    }, [userDays]);

  return (
    <div className="mt-30">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold mb-10 text-left text-indigo-600">
            Weekly Nutrition Summary
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-lg shadow flex flex-col items-center">
                <h2 className="text-sm text-gray-600">Avg Calories</h2>
                <p className="text-2xl font-semibold text-indigo-700">{avgCals} kcal</p>
            </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">Last 7 Days</h2>
            <ul className="space-y-2">
            {(!isLoading && !isError) &&
                userDays.map((day, i) => (
                <li
                    className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow"
                    key={i}
                    >
                    <span className="font-medium text-gray-800">{day.date}</span>
                    <div className="text-sm text-gray-600">
                        Calories: <strong>{day.calories}</strong>
                    </div>
                </li>

                ))}
            </ul>
        </div>
        </div>
  )
}

export default Dashboard