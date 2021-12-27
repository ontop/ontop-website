# Standards compliance

## SPARQL 1.1
*Updated for 4.2.0*.

In the following table we present a summary of the compliance of the latest version of Ontop with [SPARQL 1.1](https://www.w3.org/TR/sparql11-query/), where rows correspond to sections of the WC3 recommendation and unsupported features are ~~crossed out~~. Most of the features are supported, but some are unsupported or only partially supported.

| <div style="width:140px">Section in <br>SPARQL 1.1</div>  | Features  | Coverage |
| --------------------------- | --------- | --------- |
| [5. Graph Patterns](https://www.w3.org/TR/sparql11-query/#GroupPatterns) | `BGP`, `FILTER` | 2/2    |
| [6. Including Optional Values](https://www.w3.org/TR/sparql11-query/#optionals) | `OPTIONAL` | 1/1    |
| [7. Matching Alternatives](https://www.w3.org/TR/sparql11-query/#alternatives) | `UNION` | 1/1    |
| [8. Negation](https://www.w3.org/TR/sparql11-query/#negation)          | `MINUS`, <code>~~FILTER \[NOT\] EXISTS~~</code>    | 1/2    |
| [9. Property Paths](https://www.w3.org/TR/sparql11-query/#propertypaths)      | ~~PredicatePath~~, ~~InversePath~~, ~~ZeroOrMorePath~~, ...    | 0 |
| [10. Assignment](https://www.w3.org/TR/sparql11-query/#assignment)  | `BIND`, `VALUES`      | 2/2 |
| [11. Aggregates](https://www.w3.org/TR/sparql11-query/#aggregates)  | `COUNT`, `SUM`, `MIN`, `MAX`, `AVG`, `GROUP_CONCAT`, `SAMPLE`      | 6/6 |
| [12. Subqueries](https://www.w3.org/TR/sparql11-query/#subqueries) | Subqueries | 1/1 |
| [13. RDF Dataset](https://www.w3.org/TR/sparql11-query/#rdfDataset) | `GRAPH`, <code>~~FROM \[NAMED\]~~</code> | 1/2 |
| [14. Basic Federated Query](https://www.w3.org/TR/sparql11-federated-query/) |  <code>~~SERVICE~~</code> | 0 |
| [15. Solution Seqs. & Mods.](https://www.w3.org/TR/sparql11-query/#solutionModifiers) | `ORDER BY`, `SELECT`, `DISTINCT`, `REDUCED`, `OFFSET`, `LIMIT` | 6/6 |
| [16. Query Forms](https://www.w3.org/TR/sparql11-query/#QueryForms) | `SELECT`, `CONSTRUCT`, `ASK`, `DESCRIBE` | 4/4 |
| [17.4.1. Functional Forms](https://www.w3.org/TR/sparql11-query/#func-forms) | `BOUND`, `IF`, `COALESCE`, <code>~~EXISTS~~</code>, <code>~~NOT EXISTS~~</code>, <code>&#124;&#124;</code> , `&&`, `=`, `sameTerm`, `IN`, `NOT IN`  | 9/11 |
| [17.4.2. Functions on RDF Terms](https://www.w3.org/TR/sparql11-query/#func-rdfTerms) | `isIRI`, `isBlank`, `isLiteral`, `isNumeric`, `str`, `lang`, `datatype`, `IRI`, `BNODE`, <code>~~STRDT~~</code>, <code>~~STRLANG~~</code>, `UUID`, `STRUUID` | 11/13 |
| [17.4.3. Functions on Strings](https://www.w3.org/TR/sparql11-query/#func-strings) | `STRLEN`, `SUBSTR`, `UCASE`, `LCASE`, `STRSTARTS`, `STRENDS`, `CONTAINS`, `STRBEFORE`, `STRAFTER`, `ENCODE_FOR_URI`, `CONCAT`, `langMatches`, `REGEX`, `REPLACE` | 14/14 |
| [17.4.4. Functions on Numerics](https://www.w3.org/TR/sparql11-query/#func-numerics) | `abs`, `round`, `ceil`, `floor`, `RAND` | 5/5 |
| [17.4.5. Functions on Dates&Times](https://www.w3.org/TR/sparql11-query/#func-date-time) | `now`, `year`, `month`, `day`, `hours`, `minutes`, `seconds`, <code>~~timezone~~</code>, `tz` | 8/9 |
| [17.4.6. Hash Functions](https://www.w3.org/TR/sparql11-query/#func-hash) | `MD5`, `SHA1`, `SHA256`, `SHA384`, `SHA512` | 5/5 |
| [17.5 XPath Constructor Functions](https://www.w3.org/TR/sparql11-query/#FunctionMapping) | ~~casting~~ | 0 |
| [17.6 Extensible Value Testing](https://www.w3.org/TR/sparql11-query/#extensionFunctions) | ~~user defined functions~~ | 0 |

### Limitations
 - The 5 hash functions and functions `REPLACE` and `REGEX` for regular expressions have limited support because they heavily depend on the DBMS: not all DBMSs provide all hash functions, and many DBMSs have their own regex dialects. Currently, the SPARQL regular expressions of `REPLACE` and `REGEX` are simply sent to the DBMS.
 - In the implementation of function `langMatches`, the second argument has to a be a constant: allowing variables will have a negative impact on the performance in our framework.


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
*Since 4.2.0.*

These functions use the prefix `ofn` (http://www.ontotext.com/sparql/functions/) and their documentation can be found [here](https://graphdb.ontotext.com/free/devhub/time-functions.html#durations-expressed-in-certain-units)).

 - `ofn:weeksBetween`
 - `ofn:daysBetween`
 - `ofn:hoursBetween`
 - `ofn:minutesBetween`
 - `ofn:secondsBetween`
 - `ofn:millisBetween`