# AWS Redshift

Through the [Redshift](https://aws.amazon.com/redshift/) connector, Ontop is able to construct VKGs on AWS Redshift databases.

## Limitations & Exceptions

:::warning
AWS Redshift does not provide information about integrity constraints. Make sure to provide this information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- The Simba Redshift JDBC does not support the use of default databases when connecting to Redshift.
- Accessing `SUPER` object fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Redshift:

```bash
jdbc.url = jdbc:redshift:iam://default.dummyaccount.eu-central-1.redshift-serverless.amazonaws.com:5439/defaultdatabase
jdbc.property.AccessKeyID = public-access-key
jdbc.property.SecretAccessKey = private-access-key
jdbc.driver = com.amazon.redshift.jdbc42.Driver
```

:::tip NOTE
The AWS Redshift JDBC supports different types of authentication methods. The above `.property` file corresponds to authentication with access keys. However, any other authentication method can be used with Ontop as well. In these cases, the corresponding connection properties have to be supplied as `jdbc.property.<property-name>` instead of the `AccessKeyID` and `SecretAccessKey` properties.
:::

## Nested Type Support

Ontop implements explicit compatibility with the Redshift type `SUPER`. 

This type can be used with the [flatten lens](/guide/advanced/lenses#flattenlens). However, Ontop is not able to automatically infer the type of the result column.

### Struct Access
 In Redshift, individual `SUPER` struct objects can be accessed by SQL expressions using the "dot operator" on the `SUPER` column. In Ontop, this feature is not currently supported. 

Should any of their elements still be required, then a workaround can be performed by first transforming the struct into a JSON object and then accessing it using JSON functions. 

Example:

 `my_struct.my_attribute` $\rightarrow$ `JSON_EXTRACT_PATH_TEXT(JSON_SERIALIZE(my_struct), 'my_attribute')`