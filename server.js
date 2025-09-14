// index.js
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Create a new Map
const week1Schedule = new Map();

// Set values: day of the week -> assignee name
week1Schedule.set('Sunday', 'Dana');
week1Schedule.set('Monday', 'Elad');
week1Schedule.set('Tuesday', 'Dana');
week1Schedule.set('Wednesday', 'Dana');
week1Schedule.set('Thursday', 'Elad');
week1Schedule.set('Friday', 'Elad');
week1Schedule.set('Saturday', 'Elad');

const week2Schedule = new Map();

week2Schedule.set('Sunday', 'Elad');
week2Schedule.set('Monday', 'Elad');
week2Schedule.set('Tuesday', 'Dana');
week2Schedule.set('Wednesday', 'Dana');
week2Schedule.set('Thursday', 'Elad');
week2Schedule.set('Friday', 'Dana');
week2Schedule.set('Saturday', 'Dana');

app.use(express.static(path.join(__dirname, 'public'))); // Serve CSS, JS, images

app.use(express.json());

function weeksToSelectedDay(selectedDate) {
    // Ensure input is a Date object
    const endDate = new Date(selectedDate);
    
    // Target Sunday that implies schedule #1
    const startDate = new Date('2025-08-31');

    // Calculate difference in milliseconds
    const diffMs = endDate - startDate;                                                                                                         

    // Convert milliseconds to weeks
    const diffWeeks = diffMs / (1000 * 60 * 60 * 24 * 7);

    return diffWeeks;
}

function getWeekStartingSunday(dateInput) {
  const date = new Date(dateInput);        // parse input date
  const day = date.getUTCDay();             // 0=Sunday ... 6=Saturday

  // Calculate how many days to subtract to get to Sunday
  const diff = day; 

  // Create a new date at UTC midnight of the Sunday
  const sunday = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - diff,
    0, 0, 0, 0
  ));

  return sunday;
}




app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Route to serve the HTML file
app.get('/where', (req, res) => {
  res.sendFile(path.join(__dirname, 'whereis.html'));
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.post('/api/data', (req, res) => {
          console.log("elad3"); 
        console.log(req.body)
      
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

app.post('/api/weekend', (req, res) => {
    // let eladweekend = new Date(Date.UTC(2025,8,5));
    // let danaweekend = new Date(Date.UTC(2025, 8, 12)); 
    console.log(req.body);
    let { requestedDate } = req.body;
    requestedDate = new Date(requestedDate);
    console.log(requestedDate);
    let startingSunday = getWeekStartingSunday(requestedDate);
    let diffweeks = weeksToSelectedDay(startingSunday);
    console.log(diffweeks);
    let parent;
    console.log('get day'+requestedDate.getDay());
    if (diffweeks % 2 === 0) { //schedule #1
       parent = week1Schedule.get(dayNames[requestedDate.getDay()])
    } else { //schedule #2
        parent = week2Schedule.get(dayNames[requestedDate.getDay()])
    }
    console.log(parent);
    res.json({ message: parent });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

