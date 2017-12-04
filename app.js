var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
var debug = require('debug')('chat');
var session = require('express-session');
var sessionMiddleware = session({ secret: "biscuit" });
const PORT = process.env.PORT || 5000;

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
})

app.use(sessionMiddleware);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render(__dirname + '/views/home.ejs');
});

app.get('/chat', (req, res) => {
  res.redirect('/');
});

app.post('/chat', (req, res) => {
  req.session.username = req.body.username;
  res.render(__dirname + '/views/index.ejs');
});

io.on('connection', function (socket) {
  socket.on('user',function(a){
    io.emit('user',{'user' : socket.request.session.username+a});
  })
  socket.on('chat', function (msg) {
    if (msg) {
      io.emit('chat', socket.request.session.username + ':' + msg);
    }
  });
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use(function (req, res, next) {
  next(err);
});

app.use(function (err, req, res, next) {
  res.redirect('/');
});