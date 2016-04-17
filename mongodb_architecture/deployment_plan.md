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
dbpath=~/data/configdb/data/
logpath=~/data/configdb/log/config.log
logappend=true
pidfilepath=~/data/configdb/config.pid
bind_ip=xxx.xxx.xxx.xxx #IP of current machine
fork=true
configsvr=true

```

For mongos server, create a mongos.conf file in ~/data/mongos/conf/ with following content:
```
port=20000
logpath=~/data/mongos/log/mongos.log
logappend=true
bind_ip=xxx.xxx.xxx.xxx #IP of current machine
pidfilepath=~/data/mongos/mongos.pid


configdb=xxx.xxx.xxx.xxx:xxxxx,xxx.xxx.xxx.xxx:xxxxx,xxx.xxx.xxx.xxx:xxxxx #IP:port of config servers(not sharding servers)

fork=true
```

For shard1 servers, create a shard1.conf file in ~/data/shard1/conf/ with following content:
```
port=22001
logpath=~/data/shard1/log/shard1.log
logappend=true
dbpath=~/data/shard1/data/
pidfilepath=~/data/shard1/shard1.pid
bind_ip=xxx.xxx.xxx.xxx.xxx #IP of current machine
replSet=shard1
fork=true
shardsvr=true
```
For shard2 and shard3, create similar configuration file but replace port, IP and file names correspondingly. Besides, for planned primary node, append following content to the shardX.conf file:

```
priority=2
```

for planned secondary node, append:

```
priority=1
```
for arbiter node, append:

```
arbiterOnly=true
```









