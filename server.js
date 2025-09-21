// index.js
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Create a new Map

const dad = 'Elad';  
const mom = 'Dana';

const week1Schedule = new Map();

// Set values: day of the week -> assignee name
week1Schedule.set('Sunday', dad);
week1Schedule.set('Monday', dad);
week1Schedule.set('Tuesday', mom);
week1Schedule.set('Wednesday', mom);
week1Schedule.set('Thursday', dad);
week1Schedule.set('Friday', dad);
week1Schedule.set('Saturday', dad);

const week2Schedule = new Map();

week2Schedule.set('Sunday', mom);
week2Schedule.set('Monday', dad);
week2Schedule.set('Tuesday', mom);
week2Schedule.set('Wednesday', mom);
week2Schedule.set('Thursday', dad);
week2Schedule.set('Friday', mom);
week2Schedule.set('Saturday', mom);

//Holidays

const holidaysSchedule = new Map();

holidaysSchedule.set('Rosh Hashana', mom);
holidaysSchedule.set('Yom Kipur', dad);
holidaysSchedule.set('Sukot1', mom);
holidaysSchedule.set('Sukot2', dad);
holidaysSchedule.set('Purim', dad);
holidaysSchedule.set('Passover1', dad);
holidaysSchedule.set('Passover2', mom);
holidaysSchedule.set('Azmaut', mom);
holidaysSchedule.set('Shavuot', dad);

const startingYear = 2025; //we say year 2025 although Tishrei Holidays and Hanuka are in 2024, but the majority of the holidays are in 2025.

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

function reverseParent(parent) {
    if (parent === dad) {
        return mom;
      } else {
        return dad;
      }
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
          console.log("dad3"); 
        console.log(req.body)
      
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

app.post('/api/weekend', (req, res) => {
    // let dadweekend = new Date(Date.UTC(2025,8,5));
    // let momweekend = new Date(Date.UTC(2025, 8, 12)); 
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

app.post('/api/holiday', (req, res) => {
    console.log(req.body);
    let { holidayName } = req.body;
    let { year } = req.body;
    console.log(holidayName);
    let parent = holidaysSchedule.get(holidayName);
    if ((year - startingYear) % 2 == 1) { 
      parent = reverseParent(parent);
    }
    console.log(parent);
    res.json({ message: parent });
});

app.get("/api/holidayNames", (req, res) => {
  const holidayNames = Array.from(holidaysSchedule.keys());
  res.json(holidayNames);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

