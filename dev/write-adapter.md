# Deploying Ontop over an unsupported Relational Database Management System (RDBMS)

This page describes how Ontop can be deployed over a SQL RDBMS that is not yet supported.

The following RDBMSs are currently supported:

* DB2
* MySQL
* Oracle
* PostgreSQL
* SQL server

It is relatively easy though to extend Ontop's source code in order to support an additional RDBMS, thanks to dependency injection.

## Required implementations

3 implementations must be provided, each for a different interface that has already a default (abstract) implementation.

Ontop uses internally a variant of Relational Algebra to manipulate queries, called *IQ* (for "Intermediate Query").  
These 3 implementations dictate how an IQ must be serialized into the SQL dialect supported by the RDBMS.

The default implementation of each of these interfaces is often sufficient to handle many query operators and functions.  
As a result, only a few methods generally need to be overwritten,
to account for specificities of the new SQL dialect. 

The 3 required implementations are the following:

### Serializer

The *serializer* dictates the general shape (SELECT-FROM-WHERE) of the SQL query.  

The interface to implement is `it.unibz.inf.ontop.generation.serializer.SelectFromWhereSerializer`.  
And the default implementation is `it.unibz.inf.ontop.generation.serializer.impl.DefaultSelectFromWhereSerializer`.  

For instance, the serializer for PostgreSQL within Ontop is the class `it.unibz.inf.ontop.generation.serializer.impl.PostgresSelectFromWhereSerializer`.

### Function symbol factory 

The *function symbol factory* establishes the correspondence between the function symbols of the SPARQL specification (such as "STRLEN" or "NOW") and their counterparts in the target dialect (e.g. "LENGTH" or "CURRENT_TIMESTAMP").  

The interface to implement is `it.unibz.inf.ontop.model.term.functionsymbol.db.DBFunctionSymbolFactory`.  
And the default implementation is `it.unibz.inf.ontop.model.term.functionsymbol.db.impl.AbstractSQLDBFunctionSymbolFactory`.  

For instance, the function symbol factory for PostgreSQL within Ontop is the class `it.unibz.inf.ontop.model.term.functionsymbol.db.impl.PostgreSQLDBFunctionSymbolFactory`.

### Datatype factory 

The *datatype factory* declares the hierarchy of datatypes used by the DBMS, and specifies their correspondence with types used in SPARQL (such as xsd datatypes).  

The interface to implement (for SQL dialects) is `it.unibz.inf.ontop.model.type.SQLDBTypeFactory`.  
And the default implementation is `it.unibz.inf.ontop.model.type.impl.DefaultSQLDBTypeFactory` .  

For instance, the datatype factory for PostgreSQL within Ontop is the class `it.unibz.inf.ontop.model.type.impl.PostgreSQLDBTypeFactory`.

## Optional implementations

Additional implementations can be optionally provided.

### Normalizer

The *normalizer* addresses limitations of certain DBMSs (such as a non-canonical evaluation of the ORDER BY clause).  

The interface to implement is `it.unibz.inf.ontop.generation.normalization.DialectExtraNormalizer`.  
And several implementations are already available, some of which are used by several DBMS.  

For instance, the normalizer associated to PostgreSQL within Ontop is `it.unibz.inf.ontop.generation.normalization.impl.OnlyInPresenceOfDistinctProjectOrderByTermsNormalizer`.


### Metadata provider
The *metadata provider* specifies how schema and integrity constraints (for instance primary keys) are retrieved from the DBMS.  

The interface to implement is `it.unibz.inf.ontop.dbschema.MetadataProvider`.  
And the default implementation is `it.unibz.inf.ontop.dbschema.impl.DefaultDBMetadataProvider`.  

For instance, the metadata provider for PostgreSQL within Ontop is `it.unibz.inf.ontop.dbschema.impl.PostgreSQLDBMetadataProvider`.


## Declaring an implementation
All the implementations mentioned above can be declared in the property file
`it/unibz/inf/ontop/injection/sql-default.properties`.

A key-value pair must be added for each of these implementations, where the key indicates the type of the implementation (serializer, function symbol factory, etc.), and the value is the implementation.

The naming scheme for the keys is the following.  
Let `<driverName>` be the name of the JDBC driver for the RDBMS (for instance, the JDBC driver for PostgreSQL is `org.postgresql.Driver`).  
Then the keys are:

* `<driverName>-serializer` for a serializer
* `<driverName>-symbolFactory` for a function symbol factory
* `<driverName>-typeFactory` for a datatype factory
* `<driverName>-normalizer` for a normalizer
* `<driverName>-metadataProvider` for a metadata provider

For instance, the key-value pairs declared for PostgreSQL are:
```
org.postgresql.Driver-serializer = it.unibz.inf.ontop.generation.serializer.impl.PostgresSelectFromWhereSerializer
org.postgresql.Driver-symbolFactory = it.unibz.inf.ontop.model.term.functionsymbol.db.impl.PostgreSQLDBFunctionSymbolFactory
org.postgresql.Driver-typeFactory = it.unibz.inf.ontop.model.type.impl.PostgreSQLDBTypeFactory
org.postgresql.Driver-normalizer = it.unibz.inf.ontop.generation.normalization.impl.OnlyInPresenceOfDistinctProjectOrderByTermsNormalizer
org.postgresql.Driver-metadataProvider = it.unibz.inf.ontop.dbschema.impl.PostgreSQLDBMetadataProvider
```
