const express = require('express');
const app = express();
const port = 3000;

const ids = {};

app.all('/insert/:id', (req, res) => {
  ids[req.params.id] = true;
  res.send('okay\n');
});

app.all('/includes/:id', (req, res) => {
  if (ids[req.params.id]) {
    res.send('true\n');
  } else {
    res.send('false\n');
  }
});

app.all('/getall', (_req, res) => {
  const sorted_ids = Object.keys(ids)
    .map(Number)
    .sort((a, b) => a - b);

  let msg = ''; 
  let startRange;
  let prevId;

  sorted_ids.forEach((id, idx) => {
    if (idx === 0) {
      startRange = id;
      prevId = id;
    } else if (prevId + 1 === id) {
      prevId = id;
    } else if (startRange !== prevId) {
      msg += `${startRange}-${prevId}, `;
      startRange = id;
      prevId = id;
    } else {
      msg += `${prevId}, `;
      startRange = id;
      prevId = id;
    }

    if (idx === sorted_ids.length - 1) {
      if (startRange === prevId) {
        msg += `${prevId}`;
      } else {
        msg += `${startRange}-${prevId}`;
      }
    }
  });

  res.send(msg + '\n');
});

app.all('/delete/:id', (req, res) => {
  delete ids[req.params.id];
  res.send('okay\n');
});

app.all('*', (req, res) => {
  res.send('sorry\n');
});

app.listen(port, () => {
  console.log(`Send requests to http://localhost:${port}`);
});
