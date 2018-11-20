//
//  2018.11.15
//   Jongwook
//
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
/*
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1111',
	database: 'myDB'
});
*/	
app.use(express.static('../public'));
app.use(bodyParser.urlencoded({ extended : false }));

app.get('/', function(req, res){
    console.log('Accese home');
    res.send('Hello home page :)');
});
app.post('/process/application', function(req, res){
	console.log('Access Process Application');
	var connection = mysql.createConnection({
       		host: 'localhost',
        	user: 'web',
        	password: '1111',
        	database: 'myDB',
	});
	connection.connect();

	var paramName = req.body.name,
		paramPhone = req.body.phone,
		paramSchool = req.body.school,
		paramGrade = req.body.grade,
		paramSWEducation = req.body.sw_edu_exp,
		paramCoding = req.body.coding_exp,
		paramMotivation = req.body.motivation;
	var params = [paramName,paramPhone,paramSchool,paramGrade,paramSWEducation,paramCoding,paramMotivation];
	var sql ="IF (NOT EXISTS ( SELECT * FROM applicant WHERE name = '"+ paramName +"' AND phone = '"+ paramPhone +"' )" 
		+"INSERT INTO applicant (name,phone,school,grade,sw_education_exp, coding_exp, motivation)"
                + " values ('"+paramName+"','"+paramPhone+"','"+paramSchool+"','"+paramGrade+"','"
                +paramSWEducation+"','"+paramCoding+"','"+paramMotivation+"') ";
	
	var sql2 = "INSERT INTO applicant (name,phone,school,grade,sw_education_exp, coding_exp, motivation)"
		+ " values ('"+paramName+"','"+paramPhone+"','"+paramSchool+"','"+paramGrade+"','"
		+paramSWEducation+"','"+paramCoding+"','"+paramMotivation+"') ";
	//+" values (?,?,?,?,?,?,?);";
	
	sql= sql+"AS TEMP WHERE NOT EXISTS ( SELECT * FROM applicant WHERE name = '"+ paramName +"' AND phone = '"+ paramPhone +"' );";
	//var params = ['Jongwook', '01063302476','서울해광동초등학교' ,4,0,1,'열심히할게요' ];
        connection.query(sql, function(err,rows, fields ){
	//connection.query(sql,params, function(err,rows, fields ){
                if(err) { 
			console.log(err);
			}
                else {
			console.log(lows);
			}
        });
        connection.end();

        res.send('교육신청이 완료되었습니다. '+params);

});

app.post('/process/search', function(req, res){
        console.log('Access Process Search');
        var connection = mysql.createConnection({
                host: 'localhost',
                user: 'web',
                password: '1111',
                database: 'myDB',
        });
        connection.connect();
        var paramName = req.body.name,
                paramPhone = req.body.phone;
        //var params = [paramName,paramPhone];
        var sql = "SELECT name FROM applicant WHERE name = '"+  paramName + "' AND phone = '"+ paramPhone+"';";
        
        connection.query(sql, function(err,rows, fields ){
                if(err) { console.log(err) }
                else 	{ 
			console.log(sql); console.log("result:"); console.log(rows.length);
			if (rows.length == 0)  res.send('해당 이름의 신청자는 없습니다.');
			else if (rows.length == 1) res.send('교육신청이 이미 접수 되었습니다.');
			else  res.send('교육신청이 이미 '+ rows.length +'회 접수 되었습니다.');

		}
        });
        connection.end();

    //res.send('Success Application !! ');
});

var router = express.Router();

app.listen(8000, function(){
    console.log('Conneted 8000 port!');
});
