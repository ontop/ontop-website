# Google BigQuery
*Supported since 5.0.2.*

Through the [BigQuery](https://cloud.google.com/bigquery) connector, Ontop is able to construct VKGs on cloud-based Google BigQuery databases using the [Simba BigQuery JDBC Driver](https://cloud.google.com/bigquery/docs/reference/odbc-jdbc-drivers).


## Limitations & Exceptions

:::warning
Integrity constraint information is a recent feature in BigQuery. Beware that the majority of tables in BigQuery are still not providing this kind of information. Make sure to provide missing integrity constraint information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- String literals have to be encased in _single quotes_ (`'`). Double quote string literals (`"`) are not supported.
- The position counter in the [flatten lens](/guide/advanced/lenses#flattenlens) starts counting at 0 instead of 1 for BigQuery.
- Accessing struct fields with the "dot operator" is not supported (see below).
- In BigQuery, columns of the type `ARRAY<ARRAY<T>>` are not supported. Use `ARRAY<STRUCT<ARRAY<T>>>` instead.
- Fields taken from structs may cause errors in the presence of `DISTINCT`, as BigQuery does not support `DISTINCT` over `STRUCT`.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to BigQuery:

```bash
jdbc.url = jdbc:bigquery://dummydomain.com:443;ProjectId=dummyproject;OAuthType=0
jdbc.property.OAuthServiceAcctEmail = service.account@dummydomain.com
jdbc.property.OAuthPvtKey = paht/to/private/key/file.json
jdbc.driver = com.simba.googlebigquery.jdbc.Driver
```

:::tip NOTE
The Google BigQuery JDBC supports different types of authentication methods. The above `.property` file corresponds to the _OAuthType 0: Service Account_ method, which involves creating a service account for BigQuery and downloading its private key from the web interface. However, any other authentication method can be used with Ontop as well.
:::

## Nested Type Support

Ontop implements explicit compatibility with the `ARRAY<T>` type. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

The flatten lens cannot be used on arrays stored as JSON columns in the database. For such use cases, the column first has to be converted to an array type.

:::tip NOTE
The position counter starts counting at 0 instead of 1 for BigQuery.
:::

:::warning
In BigQuery, columns cannot directly be "arrays of arrays". To represent a two-dimensional array, the type `ARRAY<STRUCT<ARRAY<T>>>` has to be used instead of just `ARRAY<ARRAY<T>>`
:::

### Struct Access
 In BigQuery, individual struct objects can be accessed by SQL expressions using the "dot operator" on the struct column. In Ontop, this feature is not currently supported. 

Should any of their elements still be required, then a workaround can be performed by first transforming the struct into a JSON object and then accessing it using JSON functions. 

Example:

 `my_struct.my_attribute` $\rightarrow$ `JSON_VALUE(TO_JSON(my_struct), '$.my_attribute')`

