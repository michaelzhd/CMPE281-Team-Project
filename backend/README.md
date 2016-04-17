**Movie website RESTful backend**

to run the app in movie folder:

```javascript
npm install
npm start
```

***APIs***

User APIs:
* /user #Post a user, get all users
* /user/{username} #get,update,delete user using username
* /user/id/{id} #get user, update user, delete user using generated id.
* post json example:
```
	{
    	"username":"hello",
    	"password":"123456",
    	"email":"chris@gmail.com"
	}
```


Movie APIs:
* /movie  #Post a movie, get all movies
* /movie/{title} #get all movies using title
* /movie/id/{id} #get, update, delete movie using generated id.
* post json example:
```
	{
		"title":"Transformers",
		"director":"Michael Bay",
		"year":2015,
		"price":20
	}
```

Cart APIs:
* /cart #Post a cart, get all carts
* /cart/{userId} #get all carts using userId
* /cart/id/{id} #get, update, delete a cart using generated id.
* post json example:
```
	{
		"userId":"57140e96962ce7b6028bc067",
		"movieId":["5714138c4f21cb090353ef3b"]
	
	}
```


Request body could be in json format. When update record, please set all fields of a schema even if you didn't change them.

