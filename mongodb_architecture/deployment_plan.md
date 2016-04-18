### MongoDB sharding replica set deployment plan

####Mongodb installation:
1. download tarball and extract binaries

```
$cd ~  

$curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.5.tgz

$tar -zxvf mongodb-linux-x86_64-3.2.5.tgz

mkdir -p mongodb

cp -R -n mongodb-linux-x86_64-3.2.5/ mongodb

echo 'PATH=/home/ec2-user/mongodb/bin:$PATH' >> ~/.bashrc

source ~/.bashrc
```


####Create folders and configuration files
1. create folders for mongos, config, shard1,shard2,shard3 servers.

```
mkdir -p ~/data/mongos/{conf,log}

mkdir -p ~/data/configdb/{conf,data,log}

mkdir -p ~/data/shard{1,2,3}/{conf,data,log}

```

2. configuration file for each server:

For config server, create a configsvr.conf file in ~/data/configdb/conf/ with following content:
```
port=21000
dbpath=/home/ec2-user/mongodb/data/configdb/data/
logpath=/home/ec2-user/mongodb/data/configdb/log/config.log
logappend=true
pidfilepath=/home/ec2-user/mongodb/data/configdb/config.pid
bind_ip=xxx.xxx.xxx.xxx #IP of current machine
fork=true
configsvr=true

```

For mongos server, create a mongos.conf file in ~/data/mongos/conf/ with following content:

```
port=20000
logpath=/home/ec2-user/mongodb/data/mongos/log/mongos.log
logappend=true
bind_ip=xxx.xxx.xxx.xxx #IP of current machine
pidfilepath=/home/ec2-user/mongodb/data/mongos/mongos.pid


configdb=configRS/xxx.xxx.xxx.xxx:xxxxx,xxx.xxx.xxx.xxx:xxxxx,xxx.xxx.xxx.xxx:xxxxx #IP:port of config servers(not sharding servers)

fork=true

```

For shard1 servers, create a shard1.conf file in ~/data/shard1/conf/ with following content:
```
port=22001
logpath=/home/ec2-user/mongodb/data/shard1/log/shard1.log
logappend=true
dbpath=/home/ec2-user/mongodb/data/shard1/data/
pidfilepath=~/mongodb/data/shard1/shard1.pid
bind_ip=xxx.xxx.xxx.xxx.xxx #IP of current machine
replSet=shard1
fork=true
shardsvr=true
```
For shard2 and shard3, create similar configuration file but replace port, IP and file names correspondingly. 

#### Starting servers
The sequence should be sharding servers, config servers, then mongos servers. 
On each server, perform the following:
```
mongod -f ~/mongodb/data/shard1/conf/shard1.conf
mongod -f ~/mongodb/data/shard2/conf/shard2.conf
mongod -f ~/mongodb/data/shard3/conf/shard3.conf
mongod -f ~/mongodb/data/configdb/conf/configsvr.conf
```
mongos servers can only start after setting up config servers. Starting from version 3.2, MongoDB config servers can be set up as replica set too. A config replica set should not contain arbiter node. To set up config server replica set, connect to any one of config server and do the following:
```
mongo> use admin
mongo> rs.initiate({_id:"configRS",configsvr:true,
members:[
	{_id:0,host:"xxx.xxx.xxx.xxx:xxxxx"},
	{_id:1,host:"xxx.xxx.xxx.xxx:xxxxx"},
	{_id:2,host:"xxx.xxx.xxx.xxx:xxxxx"}
]});
```
If you see 
```
{"ok":1}
```
then your config servers are ready.

Next step will be to start mongos servers. Do the following on each instance:
```
mongos -f ~/mongodb/data/mongos/conf/mongos.conf

```

####Configurate replica set for each shards

Connect to any one of shard1 replica set server:

```
mongo> use admin
switched to db admin
mongo>config={_id:"shard1",members:[ {_id:0,host:"172.30.0.112:22001",priority:2}, {_id:1,host:"172.30.1.232:22001",priority:1}, {_id:2,host:"172.30.2.125:22001",arbiterOnly:true}]}
mongo>rs.initiate(config)

```


Connect to the other shard replica servers and initiate with following config respectively.

```
config={_id:"shard2",members:[ {_id:0,host:"172.30.0.112:22002",priority:1}, {_id:1,host:"172.30.1.232:22002",priority:2}, {_id:2,host:"172.30.2.125:22002",arbiterOnly:true}]}


config={_id:"shard3",members:[ {_id:0,host:"172.30.0.112:22003",arbiterOnly:true}, {_id:1,host:"172.30.1.232:22003",priority:1}, {_id:2,host:"172.30.2.125:22003",priority:2}]}
```

#### Adding sharded replica sets

```
mongos> use admin
switched to db admin
mongos> db.runCommand({addshard:"shard1/172.30.0.112:22001,172.30.1.232:22001,172.30.2.125:22001"});
{ "shardAdded" : "shard1", "ok" : 1 }
mongos> db.runCommand({addshard:"shard2/172.30.0.112:22002,172.30.1.232:22002,172.30.2.125:22002"});
{ "shardAdded" : "shard2", "ok" : 1 }
mongos> db.runCommand({addshard:"shard3/172.30.0.112:22003,172.30.1.232:22003,172.30.2.125:22003"});
{ "shardAdded" : "shard3", "ok" : 1 }
```
```
//list all shards

db.runCommand({listshards:1});
{
	"shards" : [
		{
			"_id" : "shard1",
			"host" : "shard1/172.30.0.112:22001,172.30.1.232:22001,172.30.2.125:22001"
		},
		{
			"_id" : "shard2",
			"host" : "shard2/172.30.0.112:22002,172.30.1.232:22002"
		},
		{
			"_id" : "shard3",
			"host" : "shard3/172.30.1.232:22003,172.30.2.125:22003"
		}
	],
	"ok" : 1
}
```

#### Enabling sharding on databases and collections
Connect to any one of the mongos server:

```
mongos> use admin
switched to db admin
mongos> db.runCommand({enablesharding:"movie"});
{ "ok" : 1 }

mongos>
db.runCommand({shardcollection:"movie.user",key:{username:"hashed"}});
{ "collectionsharded" : "movie.user", "ok" : 1 }
mongos> db.runCommand({shardcollection:"movie.movie",key:{title:"hashed"}});
{ "collectionsharded" : "movie.movie", "ok" : 1 }
mongos> db.runCommand({shardcollection:"movie.cart",key:{userId:"hashed"}});
{ "collectionsharded" : "movie.cart", "ok" : 1 }

```


####Modify configuration
If you need to adjust the roles of members in the replica set, connect to any one of the set, and do the following:

```
mongo> use admin;
mongo> config = rs.conf();
mongo> config.members[2] = {_id:2,host:"xxxx",priority:0, arbiterOnly:true};
mongo> rs.reconfig(config);

```

####Check sharding and replica set
Connect to any one of mongos server and:

Check sharding servers:

```
mongos> use config
mongos> db.shards.find()
```

Check sharded database and collections:
```
mongos> use movie
mongos> db.stats()
mongos> db.user.stats()

//or

mongos> db.printShardingStatus()
```








