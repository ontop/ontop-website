# SPARQL 1.1 Compliance

In the following table we present a summary of *Ontop* v4 compliance with [SPARQL 1.1](https://www.w3.org/TR/sparql11-query/), where rows correspond to sections of the WC3 recommendation and unsupported features are ~~crossed out~~. Most of the features are supported, but some are unsupported or only partially supported.

| Section in SPARQL 1.1  | Features  | Coverage |
| --------------------------- | --------- | --------- |
| 5-7. Graph Patterns, etc.       | `BGP`, `FILTER`, `OPTIONAL`, `UNION` | 4/4    |
| 8. Negation          | `MINUS`, <code>~~FILTER \[NOT\] EXISTS~~</code>    | 1/2    |
| 9. Property Paths      | ~~PredicatePath~~, ~~InversePath~~, ~~ZeroOrMorePath~~, ...    | 0 |
| 10. Assignment  | `BIND`, `VALUES`      | 2/2 |
| 11. Aggregates  | `COUNT`, `SUM`, `MIN`, `MAX`, `AVG`, `GROUP_CONCAT`, `SAMPLE`      | 6/6 |
| 12. Subqueries | Subqueries | 1/1 |
| 13. RDF Dataset | `GRAPH`, <code>~~FROM \[NAMED\]~~</code> | 1/2 |
| 14. Basic Federated Query | `SERVICE` | 0 |
| 15. Solution Seqs. & Mods. | `ORDER BY`, `SELECT`, `DISTINCT`, `REDUCED`, `OFFSET`, `LIMIT` | 6/6 |
| 16. Query Forms | `SELECT`, `CONSTRUCT`, `ASK`, `DESCRIBE` | 4/4 |
| 17.4.1. Functional Forms | `BOUND`, `IF`, `COALESCE`, <code>~~EXISTS~~</code>, <code>~~NOT EXISTS~~</code>, <code>&#124;&#124;</code> , `&&`, `=`, `sameTerm`, <code>~~IN~~</code>, <code>~~NOT IN~~</code>  | 7/11 |
| 17.4.2. Functions on RDF Terms | `isIRI`, `isBlank`, `isLiteral`, `isNumeric`, `str`, `lang`, `datatype`, `IRI`, `BNODE`, <code>~~STRDT~~</code>, <code>~~STRLANG~~</code>, `UUID`, `STRUUID` | 11/13 |
| 17.4.3. Functions on Strings | `STRLEN`, `SUBSTR`, `UCASE`, `LCASE`, `STRSTARTS`, `STRENDS`, `CONTAINS`, `STRBEFORE`, `STRAFTER`, `ENCODE_FOR_URI`, `CONCAT`, `langMatches`, `REGEX`, `REPLACE` | 14/14 |
| 17.4.4. Functions on Numerics | `abs`, `round`, `ceil`, `floor`, `RAND` | 5/5 |
| 17.4.5. Functions on Dates&Times | `now`, `year`, `month`, `day`, `hours`, `minutes`, `seconds`, <code>~~timezone~~</code>, `tz` | 8/9 |
| 17.4.6. Hash Functions | `MD5`, `SHA1`, `SHA256`, `SHA384`, `SHA512` | 5/5 |
| 17.5 XPath Constructor Functions | ~~easting~~ | 0 |
| 17.6 Extensible Value Testing | ~~user defined functions~~ | 0 |

## GeoSPARQL 1.0 Compliance

The following table provides a summary of *Ontop* v4 compliance with [OGC GeoSPARQL 1.0](https://www.ogc.org/standards/geosparql), the standard for representing and querying geospatial linked data. The summary focuses only on the main geospatial functions and properties and unsupported features are ~~crossed out~~.

| Section in OGC GeoSPARQL 1.0 | Features  | Coverage                                     |
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

Several non-topological query functions use a unit of measure URI which OGC defines under a specific namespace e.g. `<http://www.opengis.net/def/uom/OGC/1.0/metre>`. *Ontop* v4 currently supports the units metre, radian and degree.