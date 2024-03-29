# Presto
*Supported since 5.0.2.*

Through the [Presto](https://prestodb.io) connector, Ontop is able to construct VKGs on Presto databases.

## Limitations & Exceptions

:::warning
Presto does not provide information about integrity constraints. Make sure to provide this information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- Accessing struct fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Presto:

```bash
jdbc.url = jdbc:presto://localhost:8080/defaultdatabase
jdbc.user = user
jdbc.password = password
jdbc.driver = com.facebook.presto.jdbc.PrestoDriver
```

In case Presto is set up without authentication, the `jdbc.user` and `jdbc.password` lines can also be left out.

## Nested Type Support

Ontop implements explicit compatibility with the Presto array type `array(t)`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

The flatten lens cannot be used on arrays stored as JSON-encoded columns in the database. For such use cases, the column first has to be converted to an array type.

### Struct Access
 In Presto, individual `ROW` objects can be accessed by SQL expressions using the "dot operator" on the `ROW` column. In Ontop, this feature is not currently supported. 

Should any of their elements still be required, then a workaround can be performed by first transforming the struct into a JSON object and then accessing it using JSON functions. 

Example:

 `my_row.my_attribute` $\rightarrow$ `JSON_EXTRACT(CAST(my_struct AS JSON), '$.my_attribute')`

Elements of `MAP` objects can be accessed using the `[]` operator, as in
```SQL
SELECT my_map['my_attribute'] FROM ...
```