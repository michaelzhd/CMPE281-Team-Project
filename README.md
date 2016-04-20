####To install nodejs on Amazon Linux:
```
wget https://nodejs.org/dist/v5.10.1/node-v5.10.1-linux-x64.tar.xz
tar xf node-v5.10.1-linux-x64.tar.xz
mv node-v5.10.1-linux-x64 node
```
edit .bashrc, add following to the end:
```
export PATH=$PATH:/home/ec2-user/node/bin
```

then run:

```
source .bashrc
```

To check installation:

```
npm -v
node -v
```

To run our application, you need supervisor:
```
npm install -g supervisor
```

cd into the project directory, run:

```
npm start
```




####To install MongoDB on Amazon Linux:
create following file
```
/etc/yum.repos.d/mongodb-org-3.2.repo 
```

the content of the file is as follow:

```
[mongodb-org-3.2]

name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc
```

install mongodb:

```
sudo yum install -y mongodb-org
```

to run mongod:

```
cd ~
mkdir -p mongodb/{data,log,conf}
touch mongodb/conf/mongod.conf
```
edit mongod.conf and add following:

```
dbpath=/home/ec2-user/mongodb/data
fork=true
logpath=/home/ec2-user/mongodb/log/mongod.log
```


####To run the backend
cd into the project directory, and run

```
nohup movie/bin/www 1>movie.log 2>movie.err &

```
 