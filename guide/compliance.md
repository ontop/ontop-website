# Standards compliance

## SPARQL 1.1
*Updated for 5.4.0*.

In the following table we present a summary of the compliance of the latest version of Ontop with [SPARQL 1.1](https://www.w3.org/TR/sparql11-query/), where rows correspond to sections of the W3C recommendation and unsupported features are ~~crossed out~~. Most of the features are supported, but some are unsupported or only partially supported.

| <div style="width:140px">Section in <br>SPARQL 1.1</div>  | Features  | Coverage |
| --------------------------- | --------- | --------- |
| [5. Graph Patterns](https://www.w3.org/TR/sparql11-query/#GroupPatterns) | `BGP`, `FILTER` | 2/2    |
| [6. Including Optional Values](https://www.w3.org/TR/sparql11-query/#optionals) | `OPTIONAL` | 1/1    |
| [7. Matching Alternatives](https://www.w3.org/TR/sparql11-query/#alternatives) | `UNION` | 1/1    |
| [8. Negation](https://www.w3.org/TR/sparql11-query/#negation)          | `MINUS`, `FILTER [NOT] EXISTS`    | 2/2    |
| [9. Property Paths](https://www.w3.org/TR/sparql11-query/#propertypaths)      | ~~PredicatePath~~, ~~InversePath~~, ~~ZeroOrMorePath~~, ...    | 0 |
| [10. Assignment](https://www.w3.org/TR/sparql11-query/#assignment)  | `BIND`, `VALUES`      | 2/2 |
| [11. Aggregates](https://www.w3.org/TR/sparql11-query/#aggregates)  | `COUNT`, `SUM`, `MIN`, `MAX`, `AVG`, `GROUP_CONCAT`, `SAMPLE`      | 6/6 |
| [12. Subqueries](https://www.w3.org/TR/sparql11-query/#subqueries) | Subqueries | 1/1 |
| [13. RDF Dataset](https://www.w3.org/TR/sparql11-query/#rdfDataset) | `GRAPH`, `FROM [NAMED]` | 2/2 |
| [14. Basic Federated Query](https://www.w3.org/TR/sparql11-federated-query/) |  <code>~~SERVICE~~</code> | 0 |
| [15. Solution Seqs. & Mods.](https://www.w3.org/TR/sparql11-query/#solutionModifiers) | `ORDER BY`, `SELECT`, `DISTINCT`, `REDUCED`, `OFFSET`, `LIMIT` | 6/6 |
| [16. Query Forms](https://www.w3.org/TR/sparql11-query/#QueryForms) | `SELECT`, `CONSTRUCT`, `ASK`, `DESCRIBE` | 4/4 |
| [17.4.1. Functional Forms](https://www.w3.org/TR/sparql11-query/#func-forms) | `BOUND`, `IF`, `COALESCE`, `EXISTS`, `NOT EXISTS`, <code>&#124;&#124;</code> , `&&`, `=`, `sameTerm`, `IN`, `NOT IN`  | 11/11 |
| [17.4.2. Functions on RDF Terms](https://www.w3.org/TR/sparql11-query/#func-rdfTerms) | `isIRI`, `isBlank`, `isLiteral`, `isNumeric`, `str`, `lang`, `datatype`, `IRI`, `BNODE`, <code>~~STRDT~~</code>, <code>~~STRLANG~~</code>, `UUID`, `STRUUID` | 11/13 |
| [17.4.3. Functions on Strings](https://www.w3.org/TR/sparql11-query/#func-strings) | `STRLEN`, `SUBSTR`, `UCASE`, `LCASE`, `STRSTARTS`, `STRENDS`, `CONTAINS`, `STRBEFORE`, `STRAFTER`, `ENCODE_FOR_URI`, `CONCAT`, `langMatches`, `REGEX`, `REPLACE` | 14/14 |
| [17.4.4. Functions on Numerics](https://www.w3.org/TR/sparql11-query/#func-numerics) | `abs`, `round`, `ceil`, `floor`, `RAND` | 5/5 |
| [17.4.5. Functions on Dates&Times](https://www.w3.org/TR/sparql11-query/#func-date-time) | `now`, `year`, `month`, `day`, `hours`, `minutes`, `seconds`, <code>~~timezone~~</code>, `tz` | 8/9 |
| [17.4.6. Hash Functions](https://www.w3.org/TR/sparql11-query/#func-hash) | `MD5`, `SHA1`, `SHA256`, `SHA384`, `SHA512` | 5/5 |
| [17.5 XPath Constructor Functions](https://www.w3.org/TR/sparql11-query/#FunctionMapping) | `xsd:string`, `xsd:float`, `xsd:double`, `xsd:decimal`, `xsd:integer`, `xsd:boolean`, `xsd:dateTime` | 7/7 |
| [17.6 Extensible Value Testing](https://www.w3.org/TR/sparql11-query/#extensionFunctions) | ~~user defined functions~~ | 0 |

### Limitations
 - The 5 hash functions and functions `REPLACE` and `REGEX` for regular expressions have limited support because they heavily depend on the DBMS: not all DBMSs provide all hash functions, and many DBMSs have their own regex dialects. Currently, the SPARQL regular expressions of `REPLACE` and `REGEX` are simply sent to the DBMS by default.
 - In the implementation of function `langMatches`, the second argument has to a be a constant: allowing variables will have a negative impact on the performance in our framework.
 - Cast to `xsd:boolean`. Casting NaN to boolean should result in `"false"^^xsd:boolean`, however this check is not feasible for many DB dialects, hence there is mostly no special handling of these values with support limited to PostgreSQL, Oracle and Spark.
- Cast to `xsd:decimal`. Casting to DECIMAL results in values with scale 0 in several SQL dialects. As such the custom DECIMAL_STR with an arbitrary precision defined in the respective DBTypeFactory of a dialect is used for each cast.
- Cast to `xsd:dateTime`. The list of possible timestamp patterns is too large, and many dialects lack an effective way to check for these patterns without getting extremely verbose. Hence, it is not possible to often detect whether a value is a valid timestamp before the cast is performed. With the exception of SQL Server and Snowflake which have TRY_CAST functions, applying this function to other dialects comes with severe limitations.
- `EXISTS` is only supported when it can be translated into a bottom-up manner, i.e. using a left join. In practice, it covers most of the cases, but sometimes a top-down evaluation is necessary.


## GeoSPARQL 1.0
*Starting from 4.1.0.*

The following table provides a summary of the compliance of the latest version of Ontop with [OGC GeoSPARQL 1.0](https://www.ogc.org/standards/geosparql), the standard for representing and querying geospatial linked data. The summary focuses only on the main geospatial functions and properties and unsupported features are ~~crossed out~~.

| <div style="width:140px">Section in OGC GeoSPARQL 1.0</div> | Features  | Coverage                                     |
| ------------------------------------------- | --------- | ---   |
| 7. Topology Vocabulary Extensions - Properties      | <code>~~geo:sfEquals~~</code>, <code>~~geo:sfDisjoint~~</code>, <code>~~geo:sfIntersects~~</code>, <code>~~geo:sfTouches~~</code>, <code>~~geo:sfCrosses~~</code>, <code>~~geo:sfWithin~~</code>, <code>~~geo:sfContains~~</code>, <code>~~geo:sfOverlaps~~</code>, <code>~~geo:ehEquals~~</code>, <code>~~geo:ehDisjoint~~</code>, <code>~~geo:ehMeet~~</code>, <code>~~geo:ehOverlap~~</code>, <code>~~geo:ehCovers~~</code>, <code>~~geo:ehCoveredBy~~</code>, <code>~~geo:ehInside~~</code>, <code>~~geo:ehContains~~</code>, <code>~~geo:rcc8eq~~</code>, <code>~~geo:rcc8dc~~</code>, <code>~~geo:rcc8ec~~</code>, <code>~~geo:rcc8po~~</code>, <code>~~geo:rcc8tppi~~</code>, <code>~~geo:rcc8tpp~~</code>, <code>~~geo:rcc8ntpp~~</code>, <code>~~geo:rcc8ntppi~~</code> | 0                                                |
| 8.4. Standard Properties for Geo:Geometry          | <code>~~geo:dimension~~</code>, <code>~~geo:coordinateDimension~~</code>, <code>~~geo:spatialDimension~~</code>, <code>~~geo:isEmpty~~</code>, <code>~~geo:isSimple~~</code>, <code>~~geo:hasSerialization~~</code>    |  0  |
| 8.5. WKT Serialization | `geo:wktLiteral`, `geo:asWKT` |  2/2  |
| 8.6. GML Serialization | <code>~~geo:gmlLiteral~~</code>, <code>~~geo:asGML~~</code> |  0  |
| 8.7. Non-Topological Query Functions      | `geof:distance`, `geof:buffer`, `geof:convexHull` , `geof:intersection`, `geof:union`, `geof:difference` `geof:symDifference`, `geof:envelope`, `geof:boundary`, `geof:getSRID`, | 10/10 |
| 9.2. Common Query Functions | `geof:relate` |  1/1  |
| 9.3. Topological Simple Features Relation Family Query Functions | `geof:sfEquals`, `geof:sfDisjoint`, `geof:sfIntersects`, `geof:sfTouches`, `geof:sfCrosses`, `geof:sfWithin`, `geof:sfContains`, `geof:sfOverlaps`      | 8/8 |
| 9.4. Topological Egenhofer Relation Family Query Functions | `geof:ehEquals`, `geof:ehDisjoint`, `geof:ehMeet`, `geof:ehOverlap`, `geof:ehCovers`, `geof:ehCoveredBy`, `geof:ehInside`, `geof:ehContains`      | 8/8 |
| 9.5. Topological RCC8 Relation Family Query Functions | `geof:rcc8eq`, `geof:rcc8dc`, `geof:rcc8ec`, `geof:rcc8po`, `geof:rcc8tppi`, `geof:rcc8tpp`, `geof:rcc8ntpp`, `geof:rcc8ntppi`    | 8/8 |

Several non-topological query functions use a unit of measure URI which OGC defines under a specific namespace e.g. `<http://www.opengis.net/def/uom/OGC/1.0/metre>`. The latest version of Ontop currently supports the units metre, radian and degree.

## R2RML
*Updated for 4.2.0*

The latest version of Ontop is almost fully compliant with the [R2RML](https://www.w3.org/TR/r2rml) standard. 

At the moment, it does NOT support:
 - Base IRIs
 - [R2RML default mapping](https://www.w3.org/TR/r2rml/#default-mappings) generation
 - Normalization of binary SQL datatypes

 For complex SQL queries (e.g. with a `GROUP BY`) in the mapping, Ontop may not be able to infer the datatype of each column if the option [`ontop.allowRetrievingBlackBoxViewMetadataFromDB`](/guide/advanced/configuration) is not enabled (disabled by default). In such a situation, it may not be able to derive the [natural RDF datatype](https://www.w3.org/TR/r2rml/#natural-mapping) of a literal built over a column and may not apply the expected normalization. This can be partially mitigated by expliciting the RDF datatype in the mapping, but normalization would remain unapplied. 

## RDF 1.1

Ontop complies with [RDF 1.1](https://www.w3.org/TR/rdf11-new/). It types simple literals (from RDF 1.0) as `xsd:string` and literals with a language tag as `rdf:langString`.

## OWL 2 QL

## RDFS

## Time functions
*Updated for 5.1.0*.

The functions using the prefix `ofn` (`http://www.ontotext.com/sparql/functions/`) and their documentation can be found [here](https://graphdb.ontotext.com/documentation/10.6/sparql-ext-functions-reference.html#date-and-time-function-extensions). They accept both `xsd:date` and `xsd:dateTime` as arguments. (*supported since 4.2.0*).

The functions using the prefix `obdaf` (`https://w3id.org/obda/functions#`) have been introduced in 5.1.0 (see [#705](https://github.com/ontop/ontop/pull/705)).


| <div style="width:140px">Function</div> | Argument 1     | Argument 2 |
|---------------------------------------------|----------------|------------|
| `ofn:weeksBetween`                          | `xsd:date`     | `xsd:date` |
| `ofn:weeksBetween`                          | `xsd:dateTime` | `xsd:dateTime` |
| `ofn:weeksBetween`*                         | `xsd:date`     | `xsd:dateTime` |
| `ofn:weeksBetween`*                         | `xsd:dateTime` | `xsd:date` |
| `ofn:daysBetween`                           | `xsd:date`     | `xsd:date` |
| `ofn:daysBetween`                           | `xsd:dateTime` | `xsd:dateTime` |
| `ofn:daysBetween`*                          | `xsd:date`     | `xsd:dateTime` |
| `ofn:daysBetween`*                          | `xsd:dateTime` | `xsd:date` |
| `ofn:hoursBetween`                          | `xsd:dateTime` | `xsd:dateTime` |
| `ofn:minutesBetween`                        | `xsd:dateTime` | `xsd:dateTime` |
| `ofn:secondsBetween`                        | `xsd:dateTime` | `xsd:dateTime` |
| `ofn:millisBetween`                         | `xsd:dateTime` | `xsd:dateTime` |
| `obdaf:dateTrunc` | `xsd:dateTime` | `xsd:string` |
| `obdaf:milliseconds-from-dateTime` | `xsd:dateTime` | |
| `obdaf:microseconds-from-dateTime` | `xsd:dateTime` | |
| `obdaf:week-from-dateTime` | `xsd:dateTime` | |
| `obdaf:quarter-from-dateTime` | `xsd:dateTime` | |
| `obdaf:decade-from-dateTime` | `xsd:dateTime` | |
| `obdaf:century-from-dateTime` | `xsd:dateTime` | |
| `obdaf:millenium-from-dateTime` | `xsd:dateTime` | |

Combinations of argument datatypes marked with the symbol * are not supported for queries over the following data sources: Oracle and Microsoft SQL Server.

The `obdaf:[datePart]-from-dateTime` functions are supported for all dialects. They can be used to extract a specific part of the provided `dateTime` value in a numeric format (`xsd:decimal` for `milliseconds` and `microseconds`, `xsd:integer` for the remaining functions).

:::tip NOTE
The function `obdaf:week-from-dateTime` returns the ISO week index of the given date, where week 1 is considered the first week with a majority of its days in January.
:::

The `obdaf:dateTrunc` function can be used to truncate a given `xsd:dateTime` to a new value with specified granularity. The granularity must be provided as an `xsd:string` __literal__. The following granularity values are supported:

- `microsecond`
- `millisecond`
- `second`
- `minute`
- `hour`
- `day`
- `week`
- `month`
- `quarter`
- `year`
- `decade`
- `century`
- `millennium`

:::warning
Not all database systems support all granularities equally.

`decade`, `century`, and `millennium` are not supported by:
- AWS Athena
- Denodo (`century` is supported)
- MySQL (`century` is supported)
- MariaDB (`century` is supported)
- Oracle
- Presto
- SQLServer
- Snowflake
- Spark
- Trino

`second` is not supported by:
- Denodo

`millisecond` and `microsecond` are not supported by:
- AWS Athena
- Denodo
- MySQL
- MariaDB
- Oracle
- Presto
- Trino

PostgreSQL requires these granularities to be named `milliseconds` and `microseconds` instead.
:::

### Examples

`obdaf:year("2023-08-16T09:00:00"^^xsd:dateTime)` $\rightarrow$ `"2023"^^xsd:integer`

`obdaf:hour("2023-08-16T09:00:00"^^xsd:dateTime)` $\rightarrow$ `"9"^^xsd:integer`

`obdaf:dateTrunc("2023-08-16T09:00:00"^^xsd:dateTime, "month"^^xsd:string)` $\rightarrow$ `"2023-08-01T00:00:00"^^xsd:dateTime`


## Other functions

- Cast to `xsd:date`
