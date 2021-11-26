var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// express는 app변수 -> http -> socket.io연결(채팅구현)
var http = require('http').createServer(app);
app.io = require('socket.io')(http,{cors:{origins:'*:*'}});


// 클라이언트(vue, react, android등)이 접속했을 때
app.io.on('connection', function(socket){
  // 접속한 소켓 정보확인(회원판별)
  console.log(`connection ${socket}`);

  // 클라이언트에서 데이터(문자, 파일)가 전송되었을 때
  socket.on('payment', function(data){
    //전송된 데이터 출력
    console.log(data);

    // 전체 클라이언트로 데이터를 전송
    app.io.emit('sell', {
      sell   : data.data.sell
    })
  })

  // 장바구니 추가
  socket.on('addcart', function(data){
    console.log(data);

    // 장바구니 물품 추가알람
    app.io.emit('cartin', {
      cartin   : data.data.cartin
    })
  })

  // 문의글 작성되면
  socket.on('addQuestion', function(data){
    console.log(data);

    // 관리자페이지에 알람
    app.io.emit('QuestionIn', {
      QuestionIn   : data.data.QuestionIn
    })
  })

  // 문의글에 대한 답글 작성 시
  socket.on('ReplyQuestion', function(data){
    console.log(data);

    // 알람에서 삭제 및 리스트에서 삭제
    app.io.emit('QuestionOut', {
      QuestionOut   : data.data.QuestionOut
    })
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
