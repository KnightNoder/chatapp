var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
var debug = require('debug')('chat');

// var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render(__dirname + '/views/home.ejs');
});

app.get('/chat',(req,res)=>{
  res.redirect('/');
});

app.post('/chat',(req,res)=>{
  console.log(req.body.username,'username');
  req.client['username']= req.body.username;
  res.render(__dirname + '/views/index.ejs');
});

io.on('connection', function (socket) {
  debug(socket.conn.remoteAddress);
  socket[socket.conn.remoteAddress] = socket.request.client['username'];
  debug(socket[socket.conn.remoteAddress],'names ');
  socket.on('chat', function (msg) {
    if(msg){
    io.emit('chat',socket[socket.conn.remoteAddress]+':'+msg);
    }
  });
});


http.listen(3000, function () {
  console.log('listening on *:3000');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  //can set locals to error message and pass it to error view
  res.redirect('/');
});