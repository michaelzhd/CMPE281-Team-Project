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

Movie APIs:
* /movie  #Post a movie, get all movies
* /movie/{title} #get all movies using title
* /movie/id/{id} #get, update, delete movie using generated id.

Cart APIs:
* /cart #Post a cart, get all carts
* /cart/{userId} #get all carts using userId
* /cart/id/{id} #get, update, delete a cart using generated id.


Request body could be in json format. When update record, please set all fields of a schema even if you didn't change them.

