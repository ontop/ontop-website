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
* Trino
* Presto
* Athena
* Redshift
* DuckDB

It is relatively easy though to extend Ontop's source code in order to support an additional RDBMS, thanks to dependency injection.

::: tip New: Guided Implementation
Ontop also provides a [python tool](https://github.com/ontop/dialect-factory-scaffolding) that automatically generates a large part of the required code end simplifies the process of developing support for new SQL dialects.

Using it minimizes the overhead for the implementation of new dialect support and allows you to test your code easily right away.
:::

_This page provides a detailed explanation of the key concepts that need to be implemented, and was updated with Ontop 5.0.2. For newer versions of Ontop, it may no longer be up-to-date._

## Required implementations

Two implementations must be provided, each for a different interface that already has a default (abstract) implementation.

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

A basic template for this implementation is provided here:

```java
public class NewDialectDBFunctionSymbolFactory extends AbstractSQLDBFunctionSymbolFactory {

    @Inject
    protected DuckDBDBFunctionSymbolFactory(TypeFactory typeFactory) {
        super(createNewDialectRegularFunctionTable(typeFactory), typeFactory);
    }

    protected static ImmutableTable<String, Integer, DBFunctionSymbol> createNewDialectRegularFunctionTable(TypeFactory typeFactory) {
        DBTypeFactory dbTypeFactory = typeFactory.getDBTypeFactory();
        DBTermType abstractRootDBType = dbTypeFactory.getAbstractRootDBType();

        Table<String, Integer, DBFunctionSymbol> table = HashBasedTable.create(
                createDefaultRegularFunctionTable(typeFactory));

        /*
            ------------------------------------------
            -       Changed Function Symbols         -
            ------------------------------------------
        */

        return ImmutableTable.copyOf(table);
    }

    /*
        ------------------------------------------
        -             Implementations            -
        ------------------------------------------
    */

}
```

In the template above, two code blocks are commented out. We will now look at each of them individually.

#### __Changed Function Symbols__

The _regular function table_ is a dictionary, that maps from function names to the function symbol instance it corresponds to. The abstract base classes we inherit from already define a default function symbol table that includes all commonly used SQL functions. In some cases, however, some of these default function symbols need to be changed. For these cases, new entries can be created in this block, to override existing, bad entries.

A popular example is the `CURRENT_TIMESTAMP` function symbol. By default, it is created as a simple function with arity 0 of the form `CURRENT_TIMESTAMP()`. In some dialects, however, the current time is called without parentheses, simply in the form `CURRENT_TIMESTAMP`. In this case, we need to override the function symbol created by the default implementation, to not include parentheses:

```java
DBFunctionSymbol nowFunctionSymbol = new WithoutParenthesesSimpleTypedDBFunctionSymbolImpl(
    CURRENT_TIMESTAMP_STR, dbTypeFactory.getDBDateTimestampType(), abstractRootDBType);
table.put(CURRENT_TIMESTAMP_STR, 0, nowFunctionSymbol);
```

The `CURRENT_TIMESTAMP` function is now a `WithoutParenthesesSimpleTypedDBFunctionSymbol`, so when generating SQL queries, ontop will not include the parentheses. By putting this new function symbol into the table at the key `CURRENT_TIMESTAMP_STR`, we override the default behaviour that was put into the table by the default method.

#### __Implementations__

A set of serialization methods have been left abstract by the base classes. These _always_ have to be implemented for each new dialect. 

All such methods share the same structure:
```java
protected String serialize[FUNCTION_NAME](ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    ...
}
```
Here, `terms` is the list of arguments that were passed to the function, `termConverter` ist a function that can be used to transform any given term into its SQL equivalent, and termFactory can be used to generate new terms that may be required for some functions.

We will now go through each of them and provide example implementations.

___Contains___:

This function returns a boolean value, indicating whether a given string (argument 2) is included in a different string (argument 1). While some dialects have their own `CONTAINS` functions, for others it may have to be implemented through a string search, like in this example:
```java
@Override
protected String serializeContains(ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    return String.format("(POSITION(%s IN %s) > 0)",
                            termConverter.apply(terms.get(1)),
                            termConverter.apply(terms.get(0)));
}
```

___StrBefore___:

This function returns the section of a given string (argument 1) before the first appearance of a given search string (argument 2). If the searched string is not contained in the base string, an empty string is returned instead. In many languages, this can be implemented using string search and substring methods.

```java
@Override
protected String serializeStrBefore(ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    String str = termConverter.apply(terms.get(0));
    String before = termConverter.apply(terms.get(1));

    return String.format("SUBSTRING(%s,1,POSITION(%s IN %s)-1)", str, before, str);
}
```

___StrAfter___:

The opposite of `STRBEFORE`, this function returns the section of a given string (argument 1) _after_ the first appearance of a search string (argument 2). This function can be implemented similarly:

```java
@Override
protected String serializeStrBefore(ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    String str = termConverter.apply(terms.get(0));
    String before = termConverter.apply(terms.get(1));

    return String.format("SUBSTRING(%s, IF(POSITION(%s IN %s) != 0, POSITION(%s IN %s) + LENGTH(%s), 0))", str, after, str, after, str, after);
}
```

___Tz___:
This function extracts the timezone part of a given timestamp. An example implementation may look like this:
```java
@Override
protected String serializeTz(ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    String str = termConverter.apply(terms.get(0));
    return String.format("(LPAD(EXTRACT(TIMEZONE_HOUR FROM %s)::text,2,'0') || ':' || LPAD(EXTRACT(TIMEZONE_MINUTE FROM %s)::text,2,'0'))", str, str);
}
```

___DateTimeNorm___:
This function converts a given timestamp to the standardized `ISO 8601` format. An example implementation may look like this:
```java
@Override
protected String serializeDateTimeNorm(ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    return String.format("TO_ISO8601(%s)", termConverter.apply(terms.get(0)));
}
```

___Hashing Functions___:

Ontop supports a set of hasing functions:
- `MD5`
- `SHA1`
- `SHA256`
- `SHA384`
- `SHA512`

For each of them, the implementation of a serialization method is required. An example implementation of the `MD5` function may look like this:
```java
@Override
protected String serializeMD5(ImmutableList<? extends ImmutableTerm> terms, Function<ImmutableTerm, String> termConverter, TermFactory termFactory) {
    return String.format("MD5(%s)", termConverter.apply(terms.get(0)));
}
```

&nbsp;

Other than the serialization methods, four additional methods must be implemented by the subclass:

```java
@Override
protected String getUUIDNameInDialect() { return "[UUID_FUNCTION_NAME]"; }
```
returns the string that represents the name of the UUID in the SQL dialect.

The methods `createNullRejectingDBConcat(int arity)`, `createDBConcatOperator(int arity)`, and `createRegularDBConcat(int arity)` need to be implemented to define the concat function symbols. The `DBConcat` methods define function symbols that represent `CONCAT` function calls of a given arity. Sample implementations for them may look like this:
```java
@Override
protected DBConcatFunctionSymbol createRegularDBConcat(int arity) {
    return new NullToleratingDBConcatFunctionSymbol("CONCAT", arity, dbStringType, abstractRootDBType, false);
}

@Override
protected DBConcatFunctionSymbol createNullRejectingDBConcat(int arity) {
    return new NullRejectingDBConcatFunctionSymbol("CONCAT_NO_NULL", arity, dbStringType, abstractRootDBType, false);
}
```
The `createDBConcatOperator(int arity)` method represents a concat operation executed through a concat operator (often `+` or `||`). It may be implemented like this: 
```java
@Override
protected DBConcatFunctionSymbol createDBConcatOperator(int arity) {
    return new NullRejectingDBConcatFunctionSymbol("||", arity, dbStringType, abstractRootDBType, Serializers.getOperatorSerializer("||"));
}
```

### DB Datatype factory 

The *DB datatype factory* declares the hierarchy of DB datatypes used by the DBMS, and specifies their correspondence with datatypes used in the RDF graphs (such as xsd datatypes).  

The interface to implement (for SQL dialects) is `SQLDBTypeFactory`.  
And the default implementation is `DefaultSQLDBTypeFactory` .  

For instance, the datatype factory for PostgreSQL within Ontop is the class `PostgreSQLDBTypeFactory`.

A basic template for this implementation is provided here:

```java
public class NewDialectDBTypeFactory extends DefaultSQLDBTypeFactory {
    
    /*
        ------------------------------------------
        -             Type Definitions           -
        ------------------------------------------
    */

    @AssistedInject
    protected NewDialectDBTypeFactory(@Assisted TermType rootTermType, @Assisted TypeFactory typeFactory) {
        super(createNewDialectTypeMap(rootTermType, typeFactory), createNewDialectCodeMap());
    }

    protected static Map<String, DBTermType> createNewDialectTypeMap(TermType rootTermType, TypeFactory typeFactory) {
        /*
            ------------------------------------------
            -                Type Map                -
            ------------------------------------------
        */
    }

    protected static ImmutableMap<DefaultTypeCode, String> createNewDialectCodeMap() {
        /*
            ------------------------------------------
            -               Code Map                -
            ------------------------------------------
        */
    }

    /*
        ------------------------------------------
        -             Support Flags              -
        ------------------------------------------
    */

}
```

In the template above, four code blocks are commented out. We will now look at each of them individually.

#### __Type Definitions__

In this section, we define a set of `String` constants that represent the names of datatypes in our SQL dialect. These constants are then used in other code blocks. An excerpt of the _type definitions_ part in an implementation may look like this:

```java
protected static final String BIT_STR = "BIT";
protected static final String INT2_STR = "INT2";
protected static final String INT4_STR = "INT4";
protected static final String INT8_STR = "INT8";
protected static final String FLOAT4_STR = "FLOAT4";
protected static final String FLOAT8_STR = "FLOAT8";
```

#### __TYPE MAP__

In this method, we define the contents of the type map for our dialect. We create `DBTermType` instances for each supported type and store them in a `Map` object, that matches their identifiers to the `DBTermType`. The base class we extend from already generates an extensive type map for many popular types, such as `VARCHAR`, `INTEGER`, `REAL`, `DOUBLE`, and more in the method `createDefaultSQLTypeMap(...)`.  New types can be added to the map in the subclass, and, alternatively, we can override existing entries in the map here. An example implementation of this method may look like this:

```java
protected static Map<String, DBTermType> createNewDialectTypeMap(TermType rootTermType, TypeFactory typeFactory) {
    TermTypeAncestry rootAncestry = rootTermType.getAncestry();

    Map<String, DBTermType> map = createDefaultSQLTypeMap(rootTermType, typeFactory);

    return map;
}
```

#### __CODE MAP__

The code map is a dictionary, that maps different type codes to their "default type" for the SQL dialect. This includes the following type codes:

- `STRING`
- `HEXBINARY`
- `LARGE_INTEGER`
- `DECIMAL`
- `DOUBLE`
- `BOOLEAN`
- `DATE`
- `TIME`
- `DATETIMESTAMP`
- `GEOMETRY`
- `GEOGRAPHY`
- `ARRAY`
- `JSON`

The default implementation already maps many of these to the name of the corresponding data type. To support additional ones, or to override existing mappings, this method can be implemented. An example implementation may look like this:

```java
protected static ImmutableMap<DefaultTypeCode, String> createNewDialectCodeMap() {
    Map<DefaultTypeCode, String> map = createDefaultSQLCodeMap();
    
    map.put(DefaultTypeCode.JSON, JSONB_STR);

    return ImmutableMap.copyOf(map);
}
```

#### __Support Flags__

An instance of `DBTypeFactory` supports a set of methods that, when called, return a flag indicating if a certain SQL feature is supported by the dialect. These methods are

- `supportsDBGeometryType()`
- `supportsDBGeographyType()`
- `supportsDBDistanceSphere()`
- `supportsJson()`
- `supportsArrayType()`

Any of these functions can be overridden by the `DBTypeFactory` sub-class to return a boolean constant indicating if the type is supported.

#### __Other Implementations__

The `DBTypeFactory` base-class supports further methods that can be included in sub-classes for fine-tuning. One popular set of such methods are the `LexicalValue` methods. These return a `String` constant that represents the lexical value the corresponding literal may assume. For instance, by default, the method `getDBFalseLexicalValue()` returns the string `"FALSE"`, as this is a common representation of the boolean `false` value in many SQL dialects. To implement the `DBTypeFactory` for a dialect that instead uses the digit `0` for `false` literals, we could override the method like so:
```java
@Override
public String getDBFalseLexicalValue() {
    return "0";
}
```

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

A basic set of key-value pairs may be:
```properties
name.of.jdbc.Driver-serializer = it.unibz.inf.ontop.generation.serializer.impl.DefaultSelectFromWhereSerializer
name.of.jdbc.Driver-symbolFactory = it.unibz.inf.ontop.model.term.functionsymbol.db.impl.NewDialectDBFunctionSymbolFactory
name.of.jdbc.Driver-typeFactory = it.unibz.inf.ontop.model.type.impl.NewDialectDBTypeFactory
name.of.jdbc.Driver-normalizer = it.unibz.inf.ontop.generation.normalization.impl.OnlyInPresenceOfDistinctProjectOrderByTermsNormalizer
name.of.jdbc.Driver-metadataProvider = it.unibz.inf.ontop.dbschema.impl.DefaultSchemaCatalogDBMetadataProvider
``` 

## Preparing and Running the Testcases

Ontop currently uses a set of tests called `lightweight-tests` to test all main ontop language support features on minimal databases. A simple way of testing the correctness of newly implemented dialect support is to run the same tests a database that uses the corresponding dialect.

This consists of the following steps:

1) Set up a database with the required testing conditions
2) Prepare files that assist the connection to the database
3) Implement sub-classes of the abstract lightweight test classes and run them

In the following sections, we will discuss each of these steps.

### Setting up the Database

The exact procedure of the database preparation depends on the database system. In ontop, we generally use docker images that reproduce the exact same database state for each test run so we can test the different dialects automatically.

Each directory inside `test/lightweight-tests/lightweight-db-test-images/` corresponds to one docker image, and many of them contain table definitions in `.sql` file. For instance, the `mysql` directory contains the exact definitions of the three databases that are used for testing, `books`, `dbconstraints`, and `university`.

To prepare the required testing conditions, you can take these `.sql` files and run their queries on your database. Should any of the features not be supported, you will be required to either use alternative equivalent features to reach the same final database state, or disable the corresponding test cases.

### Preparing Connection Files

The directory `test/lightweight-tests/src/test/resources/` contains files that are used for setting up an ontop connection with different databases, including `.obda` files for the VKG creation and `.property` files for JDBC connections. While the `.obda` files can usually be reused for different systems, the `.property` files must be included for each database system. The directories `books` and `prof` inside the test resources contain one sub directory for each dialect, where each sub directory in turn includes one `.properties` file for the JDBC connection. The `dbconstraints` and `university` directories, on the other hand, directly contain `.property` files for each dialect. 

To run all lightweight tests for a new dialect, the corresponding files and directories have to be creates for its JDBC connection. In particular, the connection files should be created in such a way, that the corresponding database/schema of the test is selected as the default database/schema, as the `.obda` files access the tables through relative paths.

### Implementing the Lightweight Test Classes

The directory `test/lightweight-tests/src/test/java/` contains the test cases that have to run successfully for each new dialect. They are defined in the four abstract classes `AbstractBindTestWithFunctions`, `AbstractConstraintTest`, `AbstractDistinctInAggregateTest`, and `AbstractLeftJoinProfTest`.

For each new dialect, a new package has to be created at this location, containing the implementations of sub-classes for each of these abstract base classes.

#### __`BindTestWithFunctions`__

This test class tests all main SQL functions that are supported by ontop. It uses the `books` database, as well as directly generated data through the SPARQL `BIND` function. An example implementation of this class may look like this:

```java
@NewDialectLightweightTest
public class BindWithFunctionsNewDialectTest extends AbstractBindTestWithFunctions {

    private static final String PROPERTIES_FILE = "/books/new-dialect/books-new-dialect.properties";

    @BeforeAll
    public static void before() throws IOException, SQLException {
        initOBDA(OBDA_FILE, OWL_FILE, PROPERTIES_FILE);
    }

    @AfterAll
    public static void after() throws SQLException {
        release();
    }

    /*
        ------------------------------------------
        -            Result Definitions          -
        ------------------------------------------
    */

}
```
::: tip NOTE
Using the `@NewDialectLightweightTest` annotation requires the definition of the annotation in the same package, similarly to how it was defined for other dialects.
:::

The code block "Result Definitions" is commented out in the above example. This code block may contain redefinitions of expected results that are tested in the base class. To do this, override the `get[TEST-NAME]ExpectedValues()` method here. An example implementation may look like this:

```java
@Override
protected ImmutableList<String> getConstantIntegerDivideExpectedResults() {
    return ImmutableList.of("\"0.500\"^^xsd:decimal");
}
```

Should any of the functionalities not be supported by the SQL dialect, then the corresponding test case may simply be disabled with an exaplanation as to why it is not supported. An example for that may look like this:
```java
@Disabled("New Dialect does not support SHA384")
@Test
@Override
public void testHashSHA384() {
    super.testHashSHA384();
}
```

Some test cases are disabled by default.

#### __`Constraint`__

This set of test cases tests for the correct interpretation of integrity constraints in the data. It uses the `dbconstraints` database. An example implementation may look like this:

```java
@NewDialectLightweightTest
public class ConstraintNewDialectTest extends AbstractConstraintTest {

    private static final String PROPERTIES_FILE = "/dbconstraints/dbconstraints-new-dialect.properties";

    public ConstraintNewDialectTest(String method) {
        super(method, PROPERTIES_FILE);
    }

}
```

Once again, specific tests may be disabled if they are not supported. For database systems that do not support integrity constraints, this class can be ignored.

#### __`DistinctInAggregate`__

This set of test cases runs queries containing aggregate functions that include the `DISTINCT` keyword. It can be implemented analogously to the `BindWithFunctions` test class.

#### __`LeftJoinProf`__

This set of test cases runs on the `university` database. It accesses items that have to be taken from the database through `JOIN`s. Furthermore, it tests the optimization procedures employed by ontop to minimize the required number of joins. Once again, it can be implemented analogously to the `BindWithFunctions` test class.

If the database management system does not support integrity constraints, many of these test cases will fail because the optimizations will not be performed.

## Further Implementations and Troubleshooting

Once the basic features and lightweight test cases have been implemented for a dialect, the tests can be run to determine which features still do not work correctly.

If a test case fails, its corresponding feature is likely not yet supported by the current implementation. In these cases, changes need to be applied to the implemented `DBTypeFactory` or `DBFunctionSymbolFactory` to solve the issue.

In some situations, however, issues may be caused by problems not related to database types or functions. In these cases, one of the following default implementations may also be extended for the new dialect. 

::: tip NOTE
New implementations of these classes have to be linked to the driver through the `sql-default.properties` file.
:::

### __`DefaultSchemaCatalogDBMetadataProvider`__, __`DefaultSchemaDBMetadataProvider`__, or __`DefaultDBMetadataProvider`__

If the `DBMetadataProvider` assigned to the dialect is not able to perform its expected actions through its default implementation, it may have to be extended with a new sub-class that is particularly tailored for this dialect.

In that case, its methods may be overridden to change the default behavious. Commong targets include:

- `insertIntegrityConstraints(...)` if the dialect does not support integrity constraints.
- `getRelationId(...)` to return the ID of a given relation.

Additionally, the constructor may be implemented to determine the default schema or default catalog names if they cannot be accessed directly throug the JDBC, or a different `QuotedIDFactory` instance can be passed to the super-class to force ontop to generate quoted identifiers in a specific way.

### __`SelectFromWhereSerializer`__

This class is responsible for the serialization of the SQL query frame. Different SQL dialects have different rules as to how the general shape of an SQL query have to be defined. For instance, some dialects allow users to combine `LIMIT` and `OFFSET` clauses as `LIMIT <offset>,<limit>`, while others require the form `OFFSET <offset> LIMIT <limit>`. The following shows a default implementation of a `SelectFromWhereSerializer` to achieve the latter behaviour:

```java
@Singleton
public class NewDialectSelectFromWhereSerializer extends DefaultSelectFromWhereSerializer implements SelectFromWhereSerializer {

    @Inject
    private NewDialectSelectFromWhereSerializer(TermFactory termFactory) {
        super(new DefaultSQLTermSerializer(termFactory));
    }

    @Override
    public QuerySerialization serialize(SelectFromWhereWithModifiers selectFromWhere, DBParameters dbParameters) {
        return selectFromWhere.acceptVisitor(
                new DefaultRelationVisitingSerializer(dbParameters.getQuotedIDFactory()) {
                    @Override
                    protected String serializeLimitOffset(long limit, long offset, boolean noSortCondition) {
                        return String.format("OFFSET %d LIMIT %d", offset, limit);
                    }
                });
    }
}
```