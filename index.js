// index.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

function weeksBetweenFridays(startFriday) {
    // Ensure input is a Date object
    const endDate = new Date(startFriday);
    
    // Target Friday
    const startDate = new Date('2025-09-05');

    // Calculate difference in milliseconds
    const diffMs = endDate - startDate;                                                                                                         

    // Convert milliseconds to weeks
    const diffWeeks = diffMs / (1000 * 60 * 60 * 24 * 7);

    return diffWeeks;
}


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Route to serve the HTML file
app.get('/whereis', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'whereis.html'));
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
    let eladweekend = new Date(Date.UTC(2025,8,5));
    let danaweekend = new Date(Date.UTC(2025, 8, 12)); 
    let { fridayDate } = req.body;
    console.log(fridayDate);
    let diffweeks = weeksBetweenFridays(fridayDate);
    if (diffweeks % 2 === 0) {
        console.log("Elad");
        res.json({ message: `Elad` });
    } else {
        console.log("Dana");
        res.json({ message: `Dana` }); 
    }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
