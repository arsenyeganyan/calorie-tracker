const Day = require('../models/Day');
const User = require('../models/User');

async function cleanLargeChunkOfDays() {
  const allDays = await Day.find();

  if (allDays.length <= 80) return;

  const users = await User.find({}, 'days');
  const usedDayIds = new Set(users.flatMap(user => user.days.map(d => d.toString())));

  const unusedDays = allDays.filter(day => !usedDayIds.has(day._id.toString()));

  unusedDays.sort((a, b) => new Date(a.date) - new Date(b.date));

  const toDelete = unusedDays.slice(0, 10);
  const deleteIds = toDelete.map(day => day._id);

  if (deleteIds.length) {
    await Day.deleteMany({ _id: { $in: deleteIds } });
    console.log(`Deleted ${deleteIds.length} unused day(s).`);
  } else {
    console.log('No unused days to clean.');
  }
}

module.exports = { cleanLargeChunkOfDays };