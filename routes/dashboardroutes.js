const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const PomodoroSession = require('../models/pomodoro');
const moment = require('moment');

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;

  const today = moment().startOf('day');
  const weekStart = moment().startOf('isoWeek');

  try {
    // Pomodoro durations
    const todaySessions = await PomodoroSession.find({
      userId,
      date: { $gte: today.toDate() }
    });

    const weekSessions = await PomodoroSession.find({
      userId,
      date: { $gte: weekStart.toDate() }
    });

    const todayTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const weekTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    // All and completed tasks
    const allTasks = await Task.find({ userId }).lean();
    const completedTasks = allTasks.filter(t => t.completed);

    // Prepare task count per day (last 7 days)
    const tasksPerDay = {};
    for (let i = 6; i >= 0; i--) {
      const day = moment().subtract(i, 'days').format('YYYY-MM-DD');
      tasksPerDay[day] = 0;
    }

    completedTasks.forEach(task => {
      if (task.updatedAt) {
        const day = moment(task.updatedAt).format('YYYY-MM-DD');
        if (tasksPerDay[day] !== undefined) {
          tasksPerDay[day]++;
        }
      }
    });

    res.render('dashboard', {
      currentUser: req.session.user,
      todayTime,
      weekTime,
      tasksDone: completedTasks.length,
      allTasks,
      tasksPerDay: JSON.stringify(tasksPerDay) // safe to inject as JS object
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
