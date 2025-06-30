const User = require('../models/User');
const Day = require('../models/Day');
const mongoose = require('mongoose');

// res.status(500).json({ error: 'Error while logging in!' });

function normalize(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

//to calc daily calorie intake
exports.getUserData = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
    
        if (!user) {
            console.log('User not found (data)!');
            return res.status(404).json({ message: 'User not found' });
        }
    
        const dataObj = {
            age: user.age,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            activityMultiplier: user.activity_level,
            goal: user.goal,
        };
    
        console.log(dataObj);
        return res.status(200).json({ ...dataObj  });
    } catch(err) {
        console.error(err);
        
        res.status(500).json({ error: 'Error while logging in!' });
    }
}

exports.addToDay = async (req, res, next) => {
    try {
        const { meal } = req.body;
        const userId = req.session.userId;
        const user = await User.findById(userId);
    
        if (!user) {
            console.log('User not found (data)!');
            return res.status(404).json({ message: 'User not found' });
        }

        const lastDayId = user.days.at(-1);
        const day = await Day.findById(lastDayId);

        const normalized1 = normalize(Date.now());
        const normalized2 = normalize(day?.date);

        if (normalized1.getTime() === normalized2.getTime()) {
            console.log('Dates are equal (addToDay controller)');
    
            day.calories += meal.calories;
            await day.save();

            day.meals.push(meal);
            await day.save();

            return res.status(200).json({ msg: "Meal added to existing day" });
        } else {
            console.log('Dates are not equal, creating new one (addToDay controller)');

            const newDay = new Day({ user: user._id, calories: meal.calories });

            newDay.meals.push(meal);
            await newDay.save();

            user.days.push(newDay._id);
            if(user.days.length > 7) {
                user.days.shift();
            }
            await user.save();

            return res.status(200).json({ msg: "New day created with meal" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error while adding meal to day!' });
    }
};

exports.getDayData = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
    
        if (!user) {
            console.log('User not found (data)!');
            return res.status(404).json({ message: 'User not found' });
        }

        const lastDayId = user.days.at(-1);
        const day = await Day.findById(lastDayId);

        const normalized1 = normalize(Date.now());
        const normalized2 = normalize(day?.date);

        if (normalized1.getTime() === normalized2.getTime()) {
            console.log('Dates are equal (getDay controller)');
            return res.status(200).json(day.meals);
        } else {
            console.log('Dates are not equal, creating new one (addToDay controller)');
            
            const newDay = new Day({ user: user._id });
            await newDay.save();

            user.days.push(newDay._id);
            await user.save();

            return res.status(200).json(newDay.meals);
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error while getting day data!' });
    }
}

//dashboard logic
exports.getAllUserDays = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
    
        if (!user) {
            console.log('User not found (data)!');
            return res.status(404).json({ message: 'User not found' });
        }
    
        let daysCollection = [];
        for(let i = 0; i < user.days.length; ++i) {
            const userDay = await Day.findById(user.days[i]);
            if (userDay) {
                daysCollection.push({
                    date: userDay.date.toISOString().split('T')[0],
                    calories: userDay.calories
                });
            }
        }
        
        console.log(daysCollection);
        
        return res.status(200).json(daysCollection);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error while getting day data!' });
    }
}