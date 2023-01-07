# Support a new database system


This page describes how Ontop can be extended to support a novel relational database system (RDBMS).

The following RDBMSs are currently supported:

* DB2
* MySQL / MariaDB
* Oracle
* PostgreSQL
* SQL server
* H2
* Denodo
* Dremio
* Apache Spark SQL & Databricks
* Teiid
* Snowflake

It is relatively easy though to extend Ontop's source code in order to support an additional RDBMS, thanks to dependency injection.

## Required implementations

Two implementations must be provided, each for a different interface that has already a default (abstract) implementation.

These implementations dictate what the datatypes of the RDBMS are and how certain function symbols can be translated into the SQL dialect supported by the RDBMS.

The default implementation of each of these interfaces is often sufficient to handle many query operators and functions.  As a result, only a few methods generally need to be overwritten,
to account for specificities of the new SQL dialect. 

The 2 required implementations are the DB function symbol factory and the DB datatype factory.

### DB function symbol factory 

The *DB function symbol factory* provides function symbols 
which can be directly serialized into the target SQL dialect (e.g. `LENGTH` or `CURRENT_TIMESTAMP`). This factory has methods for common operations with precise semantics (e.g. concatenating 3 string arguments in a null-rejecting manner). 

The interface to implement is `DBFunctionSymbolFactory`.  
And the default implementation is `AbstractSQLDBFunctionSymbolFactory`.  

For instance, the DB function symbol factory for PostgreSQL within Ontop is the class `PostgreSQLDBFunctionSymbolFactory`.

::: warning
This interface should not be confused with the ```FunctionSymbolFactory```, which is in charge of constructing
SPARQL function symbols and other function symbols that cannot be directly serialized into SQL.
:::

### DB Datatype factory 

The *DB datatype factory* declares the hierarchy of DB datatypes used by the DBMS, and specifies their correspondence with datatypes used in the RDF graphs (such as xsd datatypes).  

The interface to implement (for SQL dialects) is `SQLDBTypeFactory`.  
And the default implementation is `DefaultSQLDBTypeFactory` .  

For instance, the datatype factory for PostgreSQL within Ontop is the class `PostgreSQLDBTypeFactory`.

## Optional implementations

Additional implementations can be optionally provided in replacement of the default implementation.

### Serializer

The *serializer* dictates the general shape (SELECT-FROM-WHERE) of the SQL query.  

The interface to implement is `SelectFromWhereSerializer`.  
And the default implementation is `DefaultSelectFromWhereSerializer`.  

For instance, the serializer for PostgreSQL within Ontop is the class `PostgresSelectFromWhereSerializer`.

### Normalizer

The *normalizer* addresses limitations of certain DBMSs (such as a non-canonical evaluation of the ORDER BY clause).  

The interface to implement is `DialectExtraNormalizer`.  
And several implementations are already available, some of which are used by several DBMS.  

For instance, the normalizer associated to PostgreSQL within Ontop is `OnlyInPresenceOfDistinctProjectOrderByTermsNormalizer`.


### Metadata provider
The *metadata provider* specifies how schema and integrity constraints (for instance primary keys) are retrieved from the DBMS.  

The interface to implement is `MetadataProvider`.  
And the default implementation is `DefaultDBMetadataProvider`.  

For instance, the metadata provider for PostgreSQL within Ontop is `PostgreSQLDBMetadataProvider`.


## Declaring an implementation
All the implementations mentioned above can be declared in the property file `sql-default.properties` (which can be found in the directory `it/unibz/inf/ontop/injection/` of the `ontop-rdb` module).

A key-value pair must be added for each of these implementations, where the key indicates the type of the implementation (serializer, function symbol factory, etc.), and the value is the implementation.

The naming scheme for the keys is the following.  
Let `<driverName>` be the name of the JDBC driver for the RDBMS (for instance, the JDBC driver for PostgreSQL is `org.postgresql.Driver`.  
Then the keys are:

* `<driverName>-serializer` for a serializer
* `<driverName>-symbolFactory` for a DB function symbol factory
* `<driverName>-typeFactory` for a DB datatype factory
* `<driverName>-normalizer` for a normalizer
* `<driverName>-metadataProvider` for a metadata provider

For instance, the key-value pairs declared for PostgreSQL are:
```properties
org.postgresql.Driver-serializer = it.unibz.inf.ontop.generation.serializer.impl.PostgresSelectFromWhereSerializer
org.postgresql.Driver-symbolFactory = it.unibz.inf.ontop.model.term.functionsymbol.db.impl.PostgreSQLDBFunctionSymbolFactory
org.postgresql.Driver-typeFactory = it.unibz.inf.ontop.model.type.impl.PostgreSQLDBTypeFactory
org.postgresql.Driver-normalizer = it.unibz.inf.ontop.generation.normalization.impl.OnlyInPresenceOfDistinctProjectOrderByTermsNormalizer
org.postgresql.Driver-metadataProvider = it.unibz.inf.ontop.dbschema.impl.PostgreSQLDBMetadataProvider
```
