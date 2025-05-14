// Simulated data – later you can populate with backend values
document.getElementById("todayTime").textContent = "90 mins";
document.getElementById("weekTime").textContent = "450 mins";
document.getElementById("tasksDone").textContent = "12";

// Chart.js - Study Time Chart (bar)
const studyCtx = document.getElementById('studyChart').getContext('2d');
new Chart(studyCtx, {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Minutes Studied',
      data: [60, 90, 45, 30, 120, 60, 45],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  },
  options: {
    responsive: true
  }
});

// Chart.js - Tasks Completed Chart (pie)
const taskCtx = document.getElementById('taskChart').getContext('2d');
new Chart(taskCtx, {
  type: 'pie',
  data: {
    labels: ['Completed', 'Pending'],
    datasets: [{
      label: 'Tasks',
      data: [12, 5],
      backgroundColor: ['#4caf50', '#f44336']
    }]
  },
  options: {
    responsive: true
  }
});
