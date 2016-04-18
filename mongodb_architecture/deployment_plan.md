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


2. create folders for mongos, config, shard1,shard2,shard3 servers.

```
mkdir -p ~/data/mongos/{conf,log}

mkdir -p ~/data/configdb/{conf,data,log}

mkdir -p ~/data/shard{1,2,3}/{conf,data,log}

```

3. configuration file for each server:

For config server, create a configsvr.conf file in ~/data/configdb/conf/ with following content:
```
port=21000
dbpath=~/mongodb/data/configdb/data/
logpath=~/mongodb/data/configdb/log/config.log
logappend=true
pidfilepath=~/mongodb/data/configdb/config.pid
bind_ip=xxx.xxx.xxx.xxx #IP of current machine
fork=true
configsvr=true

```

For mongos server, create a mongos.conf file in ~/data/mongos/conf/ with following content:
```
port=20000
logpath=~/mongodb/data/mongos/log/mongos.log
logappend=true
bind_ip=xxx.xxx.xxx.xxx #IP of current machine
pidfilepath=~/mongodb/data/mongos/mongos.pid


configdb=xxx.xxx.xxx.xxx:xxxxx,xxx.xxx.xxx.xxx:xxxxx,xxx.xxx.xxx.xxx:xxxxx #IP:port of config servers(not sharding servers)

fork=true
```

For shard1 servers, create a shard1.conf file in ~/data/shard1/conf/ with following content:
```
port=22001
logpath=~/mongodb/data/shard1/log/shard1.log
logappend=true
dbpath=~/mongodb/data/shard1/data/
pidfilepath=~/mongodb/data/shard1/shard1.pid
bind_ip=xxx.xxx.xxx.xxx.xxx #IP of current machine
replSet=shard1
fork=true
shardsvr=true
```
For shard2 and shard3, create similar configuration file but replace port, IP and file names correspondingly. 




config={_id:"shard2",members:[ {_id:0,host:"172.30.0.112:22002",priority:1}, {_id:1,host:"172.30.1.232:22002",priority:2}, {_id:2,host:"172.30.2.125:22002",arbiterOnly:true}]}


config={_id:"shard3",members:[ {_id:0,host:"172.30.0.112:22003",arbiterOnly:true}, {_id:1,host:"172.30.1.232:22003",priority:1}, {_id:2,host:"172.30.2.125:22003",priority:2}]}


db.runCommand({addshard:"shard1/172.30.0.112:22001,172.30.1.232:22001,172.30.2.125:22001"});

db.runCommand({addshard:"shard2/172.30.0.112:22002,172.30.1.232:22002,172.30.2.125:22002"});

db.runCommand({addshard:"shard3/172.30.0.112:22003,172.30.1.232:22003,172.30.2.125:22003"});

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









