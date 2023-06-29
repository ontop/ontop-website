# AWS DynamoDB
*Supported since 5.1.0.*

Through the [DynamoDB](https://www.amazonaws.cn/en/dynamodb/) connector, Ontop is able to construct VKGs on AWS DynamoDB tables using the [CData JDBC Driver for Amazon DynamoDB](https://www.cdata.com/drivers/dynamodb/jdbc/).

## Limitations & Exceptions

:::warning
DynamoDB only provides limited information about integrity constraints. Make sure to provide this information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

:::warning
To run Ontop with the CData DynamoDB JDBC, *"enhanced SQL queries"* must be enabled. This is achieved by adding `supportenhancedsql=true` to the connection properties.
:::

- Nested data structures and the *FlattenLens* are not supported.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to DynamoDB:

```bash
jdbc.url = jdbc:amazondynamodb:AuthScheme=AwsRootKeys;AWSRegion=FRANKFURT;supportenhancedsql=true
jdbc.property.AWSAccessKey = public-access-key
jdbc.property.AWSSecretKey = private-access-key
jdbc.driver = cdata.jdbc.amazondynamodb.AmazonDynamoDBDriver
```

## Nested Type Support

Nested data types and the [flatten lens](/guide/advanced/lenses#flattenlens) are not supported for DynamoDB.