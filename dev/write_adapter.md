# Use Ontop with other DataBase Management Systems (DBMSs)

This page describes how Ontop can be deployed over a SQL DBMS that is not among the list of supported ones.
Currently, Ontop can be natively deployed over the following DBMSs:

It is relatively easy though to extend Ontop's source code in order to support an additional DBMS, 
thanks to dependency injection.

Precisely, 3 classes must be implemented, all of which have already a default implementation.
Ontop uses internally a variant of Relational Algebra (RA) to manipulate queries, called *IQ* (for "Intermediate Query").
These 3 classes dictate how an IQ must be serialized into the SQL dialect supported by the DBMS.
The default implementation of these 3 classes is based on the SQL 99 standard,
so that most operators or functions are generally serialized correctly by default,
and only a few methods need to be overwritten,
to account for dialect-specific serialization. 

The 3 classes are:
- a *serialzer* that dictates how the  


, which may be sufficient for a large numbe of  


All there
- one that overwrites the default 
First, 


a 's Java code can be simply write a SQL adapter for a SQL dialect DataBase Management System (DBMS) that is not yet supported by Ontop.



But another (SQL-compliant) DBMS can easily be added, thanks to dependency injection.
Each DBMS comes with its own dialect of SQL 
 

This page describe how to debug the Protégé Plugin of Ontop from IntelliJ.

If you just want to test the plugin (without debugging), you only need to follow the step of building the Protégé plugin, and then run Protégé as usual:
```console
$ build/distribution/ontop-protege/Protege-[protege-version]/run.sh
```

## Build the Protégé plugin

### Requirements

1. Make sure that the JAVA_HOME environment variable is set.
For Mac:
```console
$ vim .bash_profile 
Add this line:  export JAVA_HOME=$(/usr/libexec/java_home)
$ source .bash_profile
```

2. Unzip the Protege distribution:
```console
$ cd build/distribution/ontop-protege
$ unzip Protege-[protege-version]-platform-independent.zip
```
See  [here](/dev/build) in case the folder build/distribution is empty.


### Procedure

<b>Each time you modify the code, you need to recompile and build the Ontop distribution as follows.</b>

Suggested procedure:

```console
$ cd client/protege
$ ./build-plugin.sh
```

Alternative procedure:

1. Fom Ontop's root directory, compile and build Ontop bundles:
```console
$ mvn clean install -DskipTests
```

2. Compile the Ontop Protégé plugin jar file:
```console
$ cd client/protege
$ mvn bundle:bundle 
```

3. Copy the generated plugin into the Protégé plugin directory:
```console
$ cp target/it.unibz.inf.ontop.protege-[ontop-version].jar ../../build/distribution/ontop-protege/Protege-[protege-version]/plugins/
```
If this is the first time you build the plugin, you may need to create the 'build/distribution/ontop-protege/Protege-[protege-version]/plugins/' directory.
<b>Make sure that there is only one Protégé plugin in build/distribution/ontop-protege/Protege-[protege-version]/plugins/.</b>


## Debug in IntelliJ using the Remote debugger

### IntelliJ configuration

* Create a remote configuration: 'Edit configurations', select 'Remote', then click '+'

* Host: <code>localhost</code>

* Port: choose a port number (<code>5005</code> in what follows) 

### Protégé run options

* Edit the the script  build/distribution/ontop-protege/Protege-[protege-version]/run.sh, adding the following JVM option:
```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005
```
* Note that parameter 'suspend' is set to 'y'

### Run / Debug

* Execute build/distribution/ontop-protege/Protege-[protege-version]/run.sh

* From IntelliJ, click on the Debug button (or Shift+F9)
