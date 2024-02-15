# DuckDB
*Supported since 5.0.2.*

Through the [DuckDB](https://duckdb.org) connector, Ontop is able to construct VKGs on DuckDB database files.

## Limitations & Exceptions

- DuckDB database files prior to version 1.0 are not guaranteed to be compatible with later versions.
- Setting a default schema is not supported when connecting to DuckDB.
- Nested data types are only supported starting from version 0.7 of DuckDB.
- Accessing struct fields using the "dot operator" is not supported.
- The Ontop option `ontop.exposeSystemTables` is not supported for DuckDB, as the JBDC does not allow us to access system tables.
- DuckDB has a very specific [concurrency model](https://duckdb.org/faq#how-does-duckdb-handle-concurrency). In particular, it does not support concurrent multi-process read-write queries.
- DuckDB supports integrity constraints, but they tend to [costly for large tables](https://duckdb.org/docs/guides/performance/indexing). Consider instead specifying constraints using lenses for large datasets.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to DuckDB:

```bash
jdbc.url = jdbc:duckdb:path/to/database.db
jdbc.driver = org.duckdb.DuckDBDriver
```

## Nested Type Support

Ontop implements explicit compatibility with the DuckDB array type `T[]`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

The flatten lens cannot be used on arrays stored as JSON-encoded columns in the database. For such use cases, the column first has to be converted to an array type.

:::tip NOTE
Nested data types are only supported starting from version 0.7 of DuckDB.
:::

### Struct Access
 Individual struct objects can be accessed by SQL expressions in the dialect's default way:
```
SELECT my_struct['my_attribute'] FROM ...
```

:::warning
Accessing struct fields using the "dot operator" is not supported.
:::
