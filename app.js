var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
//var JSAlert = require('js-alert');

var index = require('./routes/index');
var contact = require('./routes/contact');
var register = require('./routes/register');
var login = require('./routes/login');
var register1 = require('./routes/register1')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/contact', contact);
app.use('/register', register);
app.use('/login', login);
app.use('/register1',register1)

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'Mandar',
    port : '3306'
});

connection.connect();

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/register.ejs'));


});


app.post('/data',function(req,res){
    var today = new Date();
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var password = req.body.upass;
    var cpassword = req.body.cpass;
    var email = req.body.uemail;
    var address = req.body.uadd;
    var gender = req.body.ugen;
    var dob = req.body.udob;
    var mobile = req.body.umob;
    var date = today;


    connection.query("select email from register1 where email = ?" ,[email], function (err,result) {
        if (err)
            throw err;

        var q = result.length;
        if (q >= 1){
            console.log('redirected');
            res.redirect('back');
        }else {

            //console.log('success');
            //if(query.length === 0){
            connection.query("insert into register1 (fname,lname,pass,cpass,email,address,gender,dob,Mobile,Reg_date) VALUES (?,?,?,?,?,?,?,?,?,?)", [firstname.toString(), lastname, password, cpassword, email, address, gender, dob, mobile, date], function (err, resl) {
                if (err) throw err;
                //connection.query("select pass from register1 where cpass = ?" ,[cpassword], function (err,rows,fields){
                       // if(rows[0].pass === cpassword){
                           // res.send("please enter password")
                        //}
                       // else{
                            console.log('registration successful');
                            res.send('<h1>Registration Successful</h1>' + '<h1>please proceed to <a href="/login">login</a> page </h1>');
                       // }
                    //});

                //console.log('registration successful');
                //res.send('<h1>Registration Successful</h1>' + '<h1>please proceed to <a href="/login">login</a> page </h1>');
            });
        }
        //res.send('<h1>Registration Successful</h1>');
    });
});

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/login.html'));


});


app.post('/log',function(req,res){

    var email = req.body.email;
    var pass = req.body.upass;


    connection.query("select pass from register1 where email = '" + email + "'",
        function (err, rows, fields) {
            if (err)
                throw err
            if(rows[0].pass === pass){
                console.log('user authetication complete');
                res.send('<h1>Welcome to our application</h1>'+'<p><a href="/">Logout</a></p>');
            }
            else{
                app.get('/', function(req,res) {
                    res.sendFile(path.join(__dirname + '/login.html'));
                });

                // res.send('<h1>Incorrect Password</h1>'+'<p><a href="/login">Return to login</a></a></p>');
            }
        });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
