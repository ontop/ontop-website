# Databricks

Through the [Databricks](https://spark.apache.org/) SparkSQL connector, Ontop is able to construct VKGs on a Databricks cloud database. All main Ontop features are supported for Databricks.

## Limitations & Exceptions

:::warning
Databricks does not provide information about integrity constraints. Make sure to provide this information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- Accessing struct fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Databricks using each supported driver:

- `com.databricks.client.jdbc.Driver`
```bash
jdbc.url = jdbc:databricks://dummyid.cloud.databricks.com:443;HttpPath=/sql/1.0/endpoints/endpointid;
jdbc.user = token
jdbc.password = private-access-token 
jdbc.driver=com.databricks.client.jdbc.Driver
```

- `com.simba.spark.jdbc.Driver` (legacy driver)
```bash
jdbc.url = jdbc:spark://dummyid.cloud.databricks.com:443/default;transportMode=http;ssl=1;AuthMech=3;httpPath=/sql/1.0/endpoints/endpointid;
jdbc.user = token
jdbc.password = private-access-token 
jdbc.driver=com.simba.spark.jdbc.Driver
```

## Nested Type Support

Ontop implements explicit compatibility with the SparkSQL array type `Array<T>`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

Furthermore, the flatten lens can also be used with the JSON-encoded string columns. For these columns, however, Ontop cannot infer the output type of the flattened column.

### Struct Access
 In SparkSQL, individual struct objects can be accessed by SQL expressions using the "dot operator" on the struct column. In Ontop, this feature is not currently supported. 

Should any of their elements still be required, then a workaround can be performed by first transforming the struct into a JSON object and then accessing it using JSON functions. 

Example:

 `my_struct.my_attribute` $\rightarrow$ `GET_JSON_OBJECT(TO_JSON(my_struct), '$.my_attribute')`
