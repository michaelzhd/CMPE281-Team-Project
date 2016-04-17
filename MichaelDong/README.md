
Student name : Michael Dong

Student ID : 005174781


Week 1 accomplished: 

1.Meet with team members to discuss focusing area. I will focus on backend with MongoDB.

2.Research on MongoDB: MongoDB is a document-based NoSQL database with emphasis on CP system design. There are two ways to achieve high availability. 
One is the master-slave mode, which is the traditional mode that only allows writes on master node and data are copied from master to slave. Master is the single point of failure. The second way is the replica set mode. A replica set is a group of MongoDB servers that maintain the same data set, providing redundancy and increasing data availability. In replica set there are several node roles: the primary, the secondary, the arbiter. The primary node is similar to master node that can read and write. But if current primary node failed, a secondary node will be elected as the new primary node. 

The mechanism is ensured by Paxos related algorithm thus to elect the new primary, majority of nodes must be alive. Arbiter nodes are the nodes that only vote to elect primary but do not store data.

MongoDB provides horizontal scalability through sharding. Sharding distributes data across a cluster of machines. If some sharding server failed, the others are not affected. As data grows, system can be horizontally scaled by adding more sharding servers. However, a sharded server failed, that part of data is forever lost. Besides, computing pressure could be high for one sharding server.



3.Research on MongoDB database architecture:  According to above statements, the best way to implement cloud scaling app with high availabity and data redundancy is to combine sharding and replica set.

Two modes were proposed. 

Proposal 1: three nodes distributed in 3 different availability zones. Each node runs mongos, config server and 3 sharding server. The sharding server are deployed in a way that each node has only one primary sharding server while other two nodes have its corresponding replica set secondary node and arbiter node. This architecture utilize as few as 3 nodes and achieved both scalability and high availability.

Proposal 2: six nodes distributed in 3 different availability zones. In each availability zone, there are two nodes. One of them runs mongos server and a secondary server node. The other node has config server and exactly one primary server and possible secondary or arbiter servers.  In such a way load for mongos server and primar server is divide into two instances in the same availability zone since they are the ones with heaviest load.


Proposal are depicted in images.


Week2 accomplished:

1. Discussed with teammates and decided to adopt the three instances architecture because it is of intermediate  complexity while six instance architecture is too complex for this project.

2. Set up deployment environment for MongoDB cluster with Hengyu. The environment consists of a VPC with 3 subnets residing in 3 different availability zone. 3 instances will be instantiated in each subnet. A load balancer will be used to balance requests to these servers.

3. Designed backend RESTful API to access data from MongoDB cluster. The API will be powered by Node.js and express framework. There will be a router object for cart, user, movie individually. A user document will contain the id of a cart document. A cart document will contain multiple ids of movie documents. The API will support GET, POST, PUT, DELETE operations on each resource URI.

4. Implementing the backend RESTful API with Xue, now around 80% functionality finished. The backend system now performs well on local MongoDB instance.


Week3 to do:

1. Deploy the MongoDB sharding + replica set cluster on AWS. Write a detailed deployment documentation.

2. Finish slides for extra credit demo.

3. Finish the left functionalities of backend RESTful API implementation.

4. Deploy the backend to MongoDB cluster.