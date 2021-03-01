# Ontop with Dremio


In this tutorial we present step-by-step the way of connecting Dremio to Ontop. We show how to integrate *uni1* data saved in the PostgreSQL database and *uni2* data saved in plain JSON files into one Dremio data space. 

Before you proceed, we recommend you to see the following tutorials provided by Dremio:

  1. [Getting oriented with Dremio](https://www.dremio.com/tutorials/getting-oriented-to-dremio/)
  2. [Working with your first dataset](https://www.dremio.com/tutorials/working-with-your-first-dataset/)


As a first step, by following the instructions in [Working with your first dataset](https://www.dremio.com/tutorials/working-with-your-first-dataset/), we create a *space* named **university** as shown below.

Add and save the new data space:

<img src="img/add-space.png" width="300"/>

It will be our data space in which we integrate data from various sources.

The *uni1* data is contained in a PostgreSQL database named *university-session1*. Either you can download the SQL script that generates the database from [here](data/postgres-docker/db/university-session1.sql) and load it to your local PostgreSQL server, or you can run the docker container that we provide by executing the following script:

```bash
IMAGENAME="university-db"
docker ps -q --filter ancestor=$IMAGENAME | xargs docker stop
docker build -t $IMAGENAME .
docker run -p 5435:5432 $IMAGENAME
``` 
 
The database *university-session1* becomes accesable with the following JDBC URL:

```sql
jdbc:postgresql://localhost:5435/university-session1?user=postgres&password=postgres
``` 

Now we are ready to add our database as a new datasource into Dremio:

<img src="img/add-external-source.png" width="300"/>

Select PostgreSQL:

<img src="img/add-postgres-external.png" width="600"/>

Enter the required JDBC information:

<img src="img/postgres-info.png" width="600"/>

Now we see the tables in *university-session1*:

<img src="img/postgres-tables.png" width="600"/>

We add the table *course-registration* as dataset into *university*. We rename it to *uni1-registration*.

<img src="img/postgres-uni1-registration-dataset.png" width="600"/>

Save the other datasets in similar manner.


Now we add the *uni2* data from [here](data/uni2.json) as a JSON data source:

<img src="img/add-json.png" width="600"/>

The *uni2* JSON data can be seen as follows:

<img src="img/see-json.png" width="600"/>

JSON files usually contain nested data. However, Ontop can not directly query nested data. For this reason, in order to make our JSON data queryable by Ontop, first we need to extract relevant group of elements, and save these groups as datasets. 

With the following SQL query we create an *uni2-registration* dataset and save it into the data space *university*:

```sql
SELECT T.cid, T.enrollers.pid AS pid 
FROM (
   SELECT cid, flatten(enrollers) AS enrollers 
   FROM uni2
) T
```

The following SQL expression flattens the array of enrollers:

```sql
flatten(enrollers) AS enrollers
```

*Save As* the data set with the name *uni2-registration*.

<img src="img/uni2-registration.png" width="600"/>

Create a dataset named *uni2-course* in a similar manner:

```sql
SELECT course, cid FROM uni2
``` 

Create a *uni2-student* dataset with a bit more involved SQL that flattens the array of students:

```sql
SELECT T.enrollers."pid" AS pid,T.enrollers."fname" AS fname, T.enrollers."lname" AS lname 
FROM(
    SELECT flatten(enrollers) AS enrollers
    FROM uni2
) T
``` 

Create *uni2-teaching* dataset with the following SQL:

```sql
SELECT cid, uni2.lecturer.pid AS pid
FROM uni2
```

Now we can list all the datasets we saved in the *university* space:

<img src="img/dataset-list-updated.png" width="600"/>

Finally we are ready to connect Dremio to Ontop. Dremio can be connected to Ontop through its JDBC interface. By following the instructions provided in [here](https://docs.dremio.com/drivers/dremio-jdbc-driver.html), we provide  to Ontop the following JDBC connection information in a ".properties file" for a Dremio instance running on the localhost:

```
jdbc.url=jdbc\:dremio\:direct\=localhost\:31010
jdbc.driver=com.dremio.jdbc.Driver
jdbc.user=dremiotest
jdbc.password=dremiotest
``` 
Dremio JDBC driver can be downloaded from [here](https://www.dremio.com/drivers/). 

Over an OBDA setting containing the following mapping assertions:

```
[PrefixDeclaration]
:		http://example.org/voc#
ex:		http://example.org/
owl:		http://www.w3.org/2002/07/owl#
rdf:		http://www.w3.org/1999/02/22-rdf-syntax-ns#
xml:		http://www.w3.org/XML/1998/namespace
xsd:		http://www.w3.org/2001/XMLSchema#
foaf:		http://xmlns.com/foaf/0.1/
obda:		https://w3id.org/obda/vocabulary#
rdfs:		http://www.w3.org/2000/01/rdf-schema#

[MappingDeclaration] @collection [[
mappingId	uni1-student
target		:uni1/student/{s_id} a :Student ; foaf:firstName {first_name}^^xsd:string ; foaf:lastName {last_name}^^xsd:string . 
source		SELECT * FROM "university"."uni1-student"

mappingId	uni1-attends
target		:uni1/student/{s_id} :attends :uni1/course/{c_id}/{title} .
source		SELECT "uni1-registration".s_id, "uni1-course".c_id, "uni1-course".title FROM "university"."uni1-registration", "university"."uni1-course" WHERE "uni1-registration".c_id = "uni1-course".c_id

mappingId	uni2-student
target		:uni2/student/{pid} a :Student ; foaf:firstName {fname}^^xsd:string ; foaf:lastName {lname}^^xsd:string . 
source		SELECT * FROM "university"."uni2-student"

mappingId	uni2-attends
target		:uni2/student/{pid} :attends :uni2/course/{cid}/{course} .
source		SELECT "uni2-registration".pid, "uni2-course".cid, "uni2-course".course FROM "university"."uni2-registration", "university"."uni2-course" WHERE "uni2-registration".cid = "uni2-course".cid
]]
```

Now we can execute the following SPARQL query on Ontop:

```sparql
PREFIX : <http://example.org/voc#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?course ?firstName ?lastName {
  ?student :attends ?course .
  ?student foaf:firstName ?firstName .
  ?student foaf:lastName ?lastName .
}
```

The results:

<img src="img/sparql-2021plugin.png" width="600"/>