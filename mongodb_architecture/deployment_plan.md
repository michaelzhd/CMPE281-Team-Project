### MongoDB sharding replica set deployment plan

####1. mongodb installation:
1.. download tarball and extract binaries

```
$cd ~  

$curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.5.tgz

$tar -zxvf mongodb-linux-x86_64-3.2.5.tgz

mkdir -p mongodb

cp -R -n mongodb-linux-x86_64-3.2.5/ mongodb

echo 'PATH=/home/ec2-user/mongodb/bin:$PATH' >> ~/.bashrc

source ~/.bashrc
```

2.. create folders for mongos, config, shard1,shard2,shard3 servers.
```
mkdir -p ~/data/mongos/{conf,log}

mkdir -p ~/data/configdb/{conf,data,log}

mkdir -p ~/data/shard{1,2,3}/{conf,data,log}

```
