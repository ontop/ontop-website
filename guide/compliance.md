# Compliance

In the following table we present a summary of *Ontop* v4 compliance with [SPARQL 1.1](https://www.w3.org/TR/sparql11-query/), where rows correspond to sections of the WC3 recommendation and unsupported features are ~~crossed out~~. Most of the features are supported, but some are unsupported or only partially supported.

| Section in SPARQL 1.1                 | Features  | Coverage                                     |
| --------------------- | --------- | ------------------------------------------   |
| 5-7. Graph Patterns, etc.       | `BGP`, `FILTER`, `OPTIONAL`, `UNION` | 4/4                                                |
| 8. Negation          | `MINUS`, <code>~~FILTER \[NOT\] EXISTS~~</code>    | 1/2    |
| 9. Property Paths      | ~~PredicatePath~~, ~~InversePath~~, ~~ZeroOrMorePath~~, ...    | 0 |
| 10. Assignment  | `BIND`, `VALUES`      | 2/2                 |
| 11. Aggregates  | `COUNT`, `SUM`, `MIN`, `MAX`, `AVG`, `GROUP_CONCAT`, `SAMPLE`      | 6/6                 |
| 12. Subqueries | Subqueries | 1/1 |
| 13. RDF Dataset | `GRAPH`, <code>~~FROM \[NAMED\]~~</code> | 1/2 |
| 14. Basic Federated Query | `SERVICE` | 0 |
| 15. Solution Seqs. & Mods. | `ORDER BY`, `SELECT`, `DISTINCT`, `REDUCED`, `OFFSET`, `LIMIT` | 6/6 |
| 16. Query Forms | `SELECT`, `CONSTRUCT`, `ASK`, `DESCRIBE` | 4/4 |
| 17.4.1. Functional Forms | `BOUND`, `IF`, `COALESCE`, <code>~~EXISTS~~</code>, <code>~~NOT EXISTS~~</code>, <code>&#124;&#124;</code> , `&&`, `=`, `sameTerm`, <code>~~IN~~</code>, <code>~~NOT IN~~</code>  | 6/11 |
| 17.4.2. Functions on RDF Terms | `isIRI`, `isBlank`, `isLiteral`, `isNumeric`, `str`, `lang`, `datatype`, `IRI`, `BNODE`, <code>~~STRDT~~</code>, <code>~~STRLANG~~</code>, `UUID`, `STRUUID` | 9/13 |
| 17.4.3. Functions on Strings | `STRLEN`, `SUBSTR`, `UCASE`, `LCASE`, `STRSTARTS`, `STRENDS`, `CONTAINS`, `STRBEFORE`, `STRAFTER`, `ENCODE_FOR_URI`, `CONCAT`, `langMatches`, `REGEX`, `REPLACE` | 14/14 |
| 17.4.4. Functions on Numerics | `abs`, `round`, `ceil`, `floor`, `RAND` | 5/5 |
| 17.4.5. Functions on Dates&Times | `now`, `year`, `month`, `day`, `hours`, `minutes`, `seconds`, <code>~~timezone~~</code>, `tz` | 8/9 |
| 17.4.6. Hash Functions | `MD5`, `SHA1`, `SHA256`, `SHA384`, `SHA512` | 5/5 |
| 17.5 XPath Constructor Functions | ~~easting~~ | 0 |
| 17.6 Extensible Value Testing | ~~user defined functions~~ | 0 |


Most recent version:
* Stable:  Ontop 4.1.0, released on February 28, 2021.

See [release notes](/guide/releases) for more details.