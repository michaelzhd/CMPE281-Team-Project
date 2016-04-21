var entries = [
     { _id: '571563e67a80e30b58e1697e',
        image: '/abc.jpg',
        price: 25,
        year: 2016,
        director: 'Spilberg',
        title: 'Hung Over',
        __v: 0,
        meta:
        { updateTime: '2016-04-19T22:06:49.045Z',
            createTime: '2016-04-18T22:47:02.289Z' } },
        { _id: '571574cd3ff146df587b47fa',
            image: '/transformer.jpg',
            price: 20,
            year: 2011,
            director: 'Michael Bay',
            title: 'Transformers 1',
            __v: 0,
            meta:
            { updateTime: '2016-04-18T23:59:09.665Z',
                createTime: '2016-04-18T23:59:09.665Z' } },
        { _id: '5715767aa5158a4a594b2de6',
            image: '/spiderman.jpg',
            price: 30,
            year: 2008,
            director: 'Sam Raimi',
            title: 'Spider Man',
            __v: 0,
            meta:
            { updateTime: '2016-04-19T00:06:18.481Z',
                createTime: '2016-04-19T00:06:18.481Z' } } ];

exports.getBlogEntries = function (){
   return entries;
};

exports.getMovieInfo = function(){
    var url = 'http://54.187.124.117:3000/movie'
    var http = require('http');
    http.get(url ,function callback(response){
        response.setEncoding('utf8');
        var body = '';
        response.on("data", function (data) {
            body += data;
        });
        response.on("error", function (err) {
            console.log('error');
        });
        response.on('end',function(){
            var parsed = JSON.parse(body);
            return parsed;
        });
    });
};

//exports.movie1 = function (){

    //http.get(process.argv[3] ,function callback(response){
    //    response.setEncoding('utf8');
    //    response.on("data", function (data) {
    //        URL_2_Content += data;
    //    });
    //    response.on("error", function (err) {
    //        console.log('error');
    //    });
    //    response.on('end',function(){
    //        count ++;
    //        if(count == 3){
    //            print();
    //        }
    //    });
    //});

//    var options = {
//        host : '54.187.124.117',
//        path : '/movie',
//        port : 3000,
//        method : 'GET'
//    }
//    var http = require('http');
//    var request = http.request(options, function(response){
//        var body = ""
//        response.on('data', function(data) {
//            body += data;
//            console.log(body);
//        });
//        response.on('end', function() {
//            res.send(JSON.parse(body));
//        });
//    });
//
//    request.on('error', function(e) {
//        console.log('Problem with request: ' + e.message);
//    });
//    //request.end();
//	return body;
//}


//http.get('http://www.google.com/index.html', function(res) {
//	console.log('Got response: '+ res.statusCode);
//// consume response body
//	res.resume();
//	}).on('error', function(e){
//	console.log('Got error: ${e.message}');
//});

// exports.getBlogEntry = function (id){
//    for(var i = 0; i < entries.length; i++){
//       if(entries[i].id == id) return entries[i];
//    }
// }