# Use Ontop with other DataBase Management Systems (DBMSs)

This page describes how Ontop can be deployed over a SQL DBMS that is not among the list of supported ones.
Currently, Ontop can be natively deployed over the following DBMSs:

It is relatively easy though to extend Ontop's source code in order to support an additional DBMS, thanks to dependency injection.

## Required implementations

3 implementations must be provided, each for a different interface that has already have a default (abstract) implementation.
Ontop uses internally a variant of Relational Algebra (RA) to manipulate queries, called *IQ* (for "Intermediate Query"),
These 3 implementations dictate how an IQ must be serialized into the SQL dialect supported by the DBMS.

The default implementation of these 3 interfaces is based on the SQL 99 standard,
so that most operators or functions are generally serialized correctly by default,
and only a few methods need to be overwritten,
to account for aspects that are specific to a dialect. 

The 3 required implemetations are the following:

### Serializer

The *serialzer* dictates the general shape (SELECT-FROM-WHERE) of the SQL query.  

The interface to implement is `it.unibz.inf.ontop.generation.serializer.SelectFromWhereSerializer`,
and the default implementation is `it.unibz.inf.ontop.generation.serializer.impl.DefaultSelectFromWhereSerializer`.    

For instance, the serializer for Postgresql within Ontop is the class:  
`it.unibz.inf.ontop.generation.serializer.impl.PostgresSelectFromWhereSerializer`.

### Function Symbol Factory 

The *function symbol factory* establishes the correspondence between function the function symbols of the SPARQL specification (such as "STRLEN" or "NOW") and their counterparts in the SQL dialect (e.g. "LENGTH" or "CURRENT_TIMESTAMP").  

The interface to implement is `it.unibz.inf.ontop.model.term.functionsymbol.db.DBFunctionSymbolFactory`,
and the default implementation is `it.unibz.inf.ontop.model.term.functionsymbol.db.impl.AbstractSQLDBFunctionSymbolFactory`.  

For instance, the function symbol factory for Postgresql within Ontop is the class:  
`it.unibz.inf.ontop.model.term.functionsymbol.db.impl.PostgreSQLDBFunctionSymbolFactory`.

### Datatype Factory 

The *datatype factory* declares the hierarchy of datatypes used by the DBMS, and specifies their correspondence with xsd types (used by SPARQL).  
The interface to implement is `it.unibz.inf.ontop.model.type.SQLDBTypeFactory`, and the default implementation is `it.unibz.inf.ontop.model.type.impl.DefaultSQLDBTypeFactory`  
For instance, the datatype factory for Postgresql within Ontop is the class:  
`it.unibz.inf.ontop.model.type.impl.PostgreSQLDBTypeFactory`.

## Optional implementations

In addition to the 3 implementations above, some additional implementations can be optionally declared.
### Normalizer

The *normalizer* addresses limitations of certain DBMSs (such as a non-canonical evaluation of the ORDER BY clause).
The interface to implement is `it.unibz.inf.ontop.generation.normalization.DialectExtraNormalizer`, and several implementations are already available, some of which are used by veral DBMSs.
For instance, the normalizer associated to Oracle within Ontop is `it.unibz.inf.ontop.generation.normalization.impl.OnlyInPresenceOfDistinctProjectOrderByTermsNormalizer`

## Declaring an implementation

All the implementations mentioned above can be declared in the property file:  
`it/unibz/inf/ontop/injection/sql-default.properties`

A key-value pair must be added for each of the above implementations, where the key indicates the type of the implementation (serializer, function symbol factory, etc.), and the value is the implementation.

The naming scheme for the keys is the following:

Let `$driverName` be the name of the JDBC driver for the DBMS (for instance, the JDBC driver for Postgresql is `org.postgresql.Driver`).  
Then:
- the key for 


For instance, the key-value pairs declared for Postgresql are:
```
org.postgresql.Driver-typeFactory = it.unibz.inf.ontop.model.type.impl.PostgreSQLDBTypeFactory
org.postgresql.Driver-symbolFactory = it.unibz.inf.ontop.model.term.functionsymbol.db.impl.PostgreSQLDBFunctionSymbolFactory
org.postgresql.Driver-metadataProvider = it.unibz.inf.ontop.dbschema.impl.PostgreSQLDBMetadataProvider
```

The 
Fi

com.denodo.vdp.jdbc.Driver-typeFactory = it.unibz.inf.ontop.model.type.impl.DenodoDBTypeFactory
com.denodo.vdp.jdbc.Driver-symbolFactory = it.unibz.inf.ontop.model.term.functionsymbol.db.impl.DenodoDBFunctionSymbolFactory
com.denodo.vdp.jdbc.Driver-normalizer = it.unibz.inf.ontop.generation.normalization.impl.AlwaysProjectOrderByTermsNormalizer

The naming scheme is the following, where `$driverName` is the name of the JDBC for the DBMS.
`$driverName- 
com.denodo.vdp.jdbc.Driver



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
