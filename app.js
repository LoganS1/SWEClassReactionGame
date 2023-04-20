const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const JSONdb = require('simple-json-db');
const { v4: uuidv4 } = require('uuid');


const db = new JSONdb('./db.json');
//Example schema
// {
//   users: [
//     {
//       username: "test",
//       password: "asdf"
//     }
//   ],
//   sessions: [
//     {
//       key: "asdfa",
//       username: "asdfa"
//     }
//   ],
//   scores: [
//     {
//       username: "test",
//       score: 100,
//       room: aaa
//     }
//   ]
// }

// set the view engine to ejs
app.set('view engine', 'ejs');

// set up public folder
app.use(express.static('public'));

//How to decode post request
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// ROUTES
// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// sign-up page
app.get('/signup', function(req, res){
  res.render('pages/signup');
})

// game page
app.get('/game', function(req, res) {
  res.render('pages/game');
});

app.get('/highScores', function(req, res){
  res.render('pages/highScores');
})

app.post('/doesUserExist', function(req, res){
  let username = req.body.username;
  //return json result
  res.json({exists: checkUsername(username)});
});

app.post('/createUser', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  if(!checkUsername(username)){
    addUser(username, password);
    let sessionKey = uuidv4();
    addSession(username, sessionKey);
    res.json({success: true, sessionKey})
  }else{
    res.json({success: false, sessionKey: false})
  }
})

app.post('/getHighScores', function(req, res){
  let scores = db.get("scores");
  let highScores = [];
  let room = req.body.room;

  //Sort the scores
  if(!scores){
    scores = [];
  }

  if(!room){
    room = -1;
  }

  scores.sort((a, b)=>{
    return b.score - a.score;
  })

  //Add highest scores to highScores arr
  for(let i = 0; i < scores.length && i < 10; i++){
    if(room != -1){
      if(scores[i].room == room){
        highScores.push(scores[i]);
      }
    }else{
      highScores.push(scores[i]);
    }
  }

  //return highScores arr
  res.json({highScores})
})


app.post('/validateLogin', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  if(validateLogin(username, password)){
    let sessionKey = uuidv4();
    addSession(username, sessionKey);
    res.json({
      validated: true,
      sessionKey
    })
  }else{
    res.json({
      validated: false,
      sessionKey: false
    })
  }
})

app.post('/saveScore', function(req, res){
  let sessionKey = req.body.sessionKey;
  let score = req.body.score;
  let room = req.body.room;
  if(!room){
    room = -1;
  }
  let username = getUsernameFromSessionKey(sessionKey);
  if(!username){
    res.json({success: false});
  }else{
    saveScore(score, username, room);
    res.json({success: true})
  }
})

//HELPER METHODS

function addSession(username, sessionKey){
  let sessions = db.get('sessions');
  //if no sessions
  if(!sessions){
    sessions = [];
  }

  var newKey = sessionKey;
  var exists = 0;
  //if usernames already exist update session key
  for(var i=0; i<sessions.length; i++){
    if(sessions[i].username==username){
      sessions[i].sessionKey = newKey;
      exists = 1;
      break;
    }
  }
  //if username doesn't exist create new json entry
  if(!exists){
    sessions.push({
      username,
      sessionKey
    })
  }
  db.set('sessions', sessions);
}

function validateLogin(username, password){
  let users = db.get('users');
  //check that some users exist
  let foundValidUser = false
  if(users){
    users.forEach((user)=>{
      if(user.username == username && user.password == password){
        foundValidUser = true;
      }
    });
  }
  return foundValidUser;
}

function addUser(username, password){
  //get users
  let users = db.get('users');
  //if no users
  if(!users){
    users = [];
  }
  //add user
  users.push({
    username,
    password
  })
  //update db
  db.set('users', users);
}

function saveScore(score, username, room){
  let scores = db.get('scores');
  //if no scores
  if(!scores){
    scores = [];
  }
  scores.push({
    username,
    score,
    room
  })
  db.set('scores', scores);
}

function checkUsername(username){
  let users = db.get("users");
  let foundUsername = false;
  //prevent falsy values - 0, false, null, etc
  if(!username){
    foundUsername = true;
  }
  //check that users arr is non-empty
  if(users){
    users.forEach((user)=>{
      if(user.username == username){
        foundUsername = true;
      }
    })
  }
  return foundUsername;
}

function getUsernameFromSessionKey(sessionKey){
  let sessions = db.get('sessions');
  let username = false;
  if(sessions){
    sessions.forEach((session)=>{
      if(session.sessionKey == sessionKey){
        username = session.username;
      }
    })
  }
  return username;
}


let PORT = 8010;
app.listen(PORT);
console.log('Server is listening on port ', PORT);