# Ontop with Teiid

In this tutorial, we present the way of connecting Teiid to Ontop. We first show how to install Teiid, integrate two different data sources, i.e., two MySQL databases uni1 and uni2 developed by different , into one virtual database (VDB) of Teiid, and finally describe the way of porting the VDB into ontop.

##  Set up Teiid

### Install Teiid

Download the latest version 15.0.1 of Teiid from https://teiid.io/teiid_wildfly/downloads/ (choosing Teiid with WildFly/Console, by this way, we do not to install WildFly anymore). Unzip it into a location you like, such as /Users/Lucy/.

Configure the environment variables of WildFly:
``` 
export JBOSS_HOME=/Users/Lucy/teiid-15.0.1
export PATH=$PATH:$JBOSS_HOME/bin
```
Then start WildFly by executing the following commands:
``` 
 ~ cd /Users/Lucy/Teiid-15.0.1/bin/
 ~ bin ./standalone.sh
```
And access http://localhost:8080/ through your browser. If you see the following Welcome page then WildFly has been installed successfully.

![Image text](https://github.com/Lucy321456/Files/blob/image/WildFly.png)

After WildFly has been isntalled, Teiid standalone mode can be started by executing the commands below:
``` 
~ cd /Users/Lucy/Teiid-15.0.1/bin/
~ bin ./standalone.sh  -c=standalone-teiid.xml
```

Run *add-user.sh* (in the directory /Users/Lucy/Teiid-15.0.1/bin/) and follow the introduction to respectively add **Management User** and **Application User**. Management user is used to administrate your data sources and VDBs via web Console, and application user is used to connect Teiid Server.  

### Configure data sources

Before building and deploying VDBs of Teiid, we first need to configure the data sources needed to be integerated. Start Teiid. 

#### Deploy the driver of the data sources

Access http://localhost:8080/ through your browser. Click **Adminitration Console** and login with the management user account you have created. Then do the following steps:
* Click Deployments 
* Click Add 
* Upload the jar file, i.e., mysql-connector-java-8.0.21.jar, of the driver 
* Click Next 
* Click Fnish

![Image text](https://github.com/Lucy321456/Files/blob/image/deployDriver.png)

#### Configure the data sources

Respectively configure the data sources *uni1* and *uni2* via the web Console by the following steps:
* Click Configuration  
* Click Subsystems 
* Click Datasources 
* Click Non-XA 
* Click Add 
* Choose the type of the Datasources 
* Click Next 
* Input the Name and JNDI Name of the datasource and Click Next. 
  **Please record the name and JNDI name you inout for the source, since they will be used when build VDBs of Teiid**
* Choose the Driver of the datasource and click next 
* Input the connection URL, user name and password of the datasource and click next 
* Test the connection of the data source and click next if the connect is sucessful 
* Click finish

![Image text](https://github.com/Lucy321456/Files/blob/image/congData.png)

#### Build and Deploy VDBs

The VDB that integarte the sources uni1 and uni2 is the XML file with the following content:
```
<vdb name="UniversityDBs2"  version="1">
    <model visible="true" name="uni1">
        <source name="uni1" translator-name="mysql5" connection-jndi-name="java:/MySqlUni1"/>
        <metadata type="DDL"><![CDATA[
                CREATE FOREIGN TABLE student (
                  s_id  integer not null primary key,
                  first_name varchar(40) not null,
                  last_name varchar(40) not null
                  )OPTIONS(UPDATABLE 'FALSE');
                  
                CREATE FOREIGN TABLE academic (
                  a_id integer not null primary key,
                  first_name varchar(40) not null,
                  last_name varchar(40) not null,
                  position integer not null
                 )OPTIONS(UPDATABLE 'FALSE');
                 
                 CREATE FOREIGN TABLE course (
                   c_id integer not null primary key,
                   title varchar(100) not null
                  )OPTIONS(UPDATABLE 'FALSE');
                  
                CREATE FOREIGN TABLE teaching (
                 c_id integer not null,
                 a_id integer not null
                 )OPTIONS(UPDATABLE 'FALSE');
                 
                CREATE FOREIGN TABLE course_registration (
                  c_id integer not null,
                  s_id integer not null
                 )OPTIONS(UPDATABLE 'FALSE');
            ]]> </metadata>   
      </model> 
      <model visible="true" name="uni2">
        <source name="uni2" translator-name="mysql5" connection-jndi-name="java:/MySqlUni2"/>
        <metadata type="DDL"><![CDATA[
                CREATE FOREIGN TABLE person (
                  pid integer not null primary key,
                  fname varchar(40) not null,
                  lname varchar(40) not null,
                  status integer not null,
                  ssn varchar(40) not null unique
                 )OPTIONS(UPDATABLE 'FALSE');
                 
             CREATE FOREIGN TABLE course (
              cid integer not null primary key,
              lecturer integer not null,
              lab_teacher integer not null,
              topic varchar(100) not null
               )OPTIONS(UPDATABLE 'FALSE');
               
             CREATE FOREIGN TABLE registration (
              pid integer not null,
              cid integer not null
              )OPTIONS(UPDATABLE 'FALSE');
            ]]> </metadata>                
    </model>    
  </vdb>
 ```
 Here, "UniversityDBs2" is the name of this VDB. Thus the title of this file should be UniversityDBs2-vdb.xml. And the values of the sources names and the connection-jdni-names are the names used when configure the data sources. Besides, the forgign tables described by DDL are the schemas of the tables in the two DBs uni1 and uni2. See http://teiid.github.io/teiid-documents/15.0.x/content/reference/as_virtual-databases.html for more information on how to develop VDBs of Teiid. 

Then deploy the VDB *UniversityDBs2-vdb.xml* through the web Console by the following steps:
* Click Deployments 
* Click Add 
* Upload the VDB File 
* Click Next to varify your VDB 
* Click Finish 

![Image text](https://github.com/Lucy321456/Files/blob/image/deployVDB.png)

And through the following steps to see whether the VDB has been deployed successfully:
* Click Runtime 
* Click Standalone Server 
* Click Subsystems
* Choose Teiid and Click View:

![Image text](https://github.com/Lucy321456/Files/blob/image/checkVDB.png)

If the Statues of the VDB is ACTIVE then the VDB has successfully deployed. 

## Configure and connect Teiid in Ontop

Download the JDBC Driver of Teiid from here https://teiid.io/teiid_wildfly/downloads/. Install the Driver:
 ```
 mvn install:install-file -DgroupId=org.teiid -DartifactId=teiid -Dclassifier=jdbc -Dversion=15.0.1 -Dpackaging=jar -Dfile=/Users/zet/connectedJar/teiid-15.0.1-jdbc.jar
 ```
  
 Import the source code of Ontop into IntelliJ IDEA. Then use the following files we have builed as inout:
 * university.obda
 * university.ttl
 * teiid.properties
 
 you can access the two data sources from an unified top level. For example, excuting the following SPARQL query:
 ```
 PREFIX : <http://example.org/voc#>
 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
 
 SELECT ?x  {?x rdf:type  :Student} 
 ```
 you can obtain the followng certain answers which are generated from the data extracted from both uni1 and uni2:
 ```
<http://example.org/voc#uni1/student/1>
<http://example.org/voc#uni1/student/2>
<http://example.org/voc#uni1/student/3>
<http://example.org/voc#uni1/student/4>
<http://example.org/voc#uni1/student/5>
<http://example.org/voc#uni2/person/2>
<http://example.org/voc#uni2/person/10>
<http://example.org/voc#uni2/person/3>
<http://example.org/voc#uni2/person/9>
```
