//daily goal calc??
function calculateCalories(
    age: number, 
    weightKg: number, 
    heightCm: number, 
    gender: string, 
    activityMultiplier: number,
    goal: string
) {
    let bmr;
  
    if (gender === 'Male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  
    const tdee = bmr * activityMultiplier;
  
    switch (goal) {
      case 'Lose':
        return tdee - 500;
      case 'Gain':
        return tdee + 500;
      default:
        return tdee;
    }
}

export default calculateCalories;