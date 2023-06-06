# SparkSQL
*Supported since 4.2.0.*

Through the [SparkSQL](https://spark.apache.org/) connector, Ontop is able to construct VKGs on an external Spark database, using the SparkSQL JDBC.

## Limitations & Exceptions

:::warning
Trino does not provide information about integrity constraints. Make sure to provide this information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- Accessing struct fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to SparkSQL using the JDBC Hive Driver:

```bash
jdbc.url=jdbc:hive2://localhost:10000
jdbc.driver = org.apache.hive.jdbc.HiveDriver
jdbc.user = user
jdbc.password = password
```

## Nested Type Support

Ontop implements explicit compatibility with the SparkSQL array type `Array<T>`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

Furthermore, the flatten lens can also be used with the JSON-encoded string columns. For these columns, however, Ontop cannot infer the output type of the flattened column.

### Struct Access
 In SparkSQL, individual struct objects can be accessed by SQL expressions using the "dot operator" on the struct column. In Ontop, this feature is not currently supported. 

Should any of their elements still be required, then a workaround can be performed by first transforming the struct into a JSON object and then accessing it using JSON functions. 

Example:

 `my_struct.my_attribute` $\rightarrow$ `GET_JSON_OBJECT(TO_JSON(my_struct), '$.my_attribute')`