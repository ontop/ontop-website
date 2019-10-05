# Known issues

In the following we present in a categorized manner the remaining open issues the user has to be aware of, *for versions >= 4.0*.

::: danger 
THIS PAGE IS OUTDATED and needs to be refreshed
:::

## RDF
* `GRAPH` is not supported yet

## SPARQL
* `ORDER BY` doesn't support functions as parameters, accepts variables only. Example:
```sql 
SELECT ...
ORDER BY str(?o)
   
SELECT ...
ORDER BY xsd:integer(?o)

SELECT ...
ORDER BY (?o1 + ?o2)
```
* `REGEX` is not supported by MsSQL and DB2, while the other databases handle it differently: see [[Regex SPARQL filter]] 

* `URI` with a hierarchical directory path of the form directory/directory/.../name are supported if we use them without prefix or with complete prefix. Example we can query `<http://en.wikipedia.org/wiki/BMW_7_Series#section/help>` using it as it is  or with a complete prefix as:
```sql
PREFIX bmwSection: http://en.wikipedia.org/wiki/BMW_7_Series#section/
SELECT * WHERE {?x ?y bmwSection:help}
``` 
It is not supported the form:
```sql
PREFIX bmw: http://en.wikipedia.org/wiki/BMW_7_Series#
SELECT * WHERE {?x ?y bmw:section/help}
```
* No support for cast functions (e.g. xsd:string(...), xsd:integer(...) ).
* `REPLACE` function is supported with some limitations based on the database used. See [[Replace SPARQL filter]].
* Do not use `SELECT Expressions` with more variable declarations, use the correspondant version with BIND. Example:
Instead of:
```
SELECT  ?title (?p AS ?fullPrice) (?fullPrice*?discount) AS ?customerPrice)
{ ?x ns:price ?p .
  ?x dc:title ?title . 
  ?x ns:discount ?discount .
}
```
Use:
```
SELECT  ?title  (?fullPrice*?discount) AS ?customerPrice)
{ 
  ?x dc:title ?title . 
  ?x ns:discount ?discount .
  BIND (?p AS ?fullPrice)
  ?x ns:price ?fullPrice .
}
```
* Hash functions in oracle are supported only if DBMS_CRYPTO is enabled by the DBA.
* `Hash`, `timezone` and `uiid` functions are supported based on the database see [[OntopSPARQLFunctions |Supported Sparql Functions]] for more information.
* Using Oracle `strBefore` and `strAfter` SPARQL functions return null instead of an empty string when no result has been found.
* `IF`, `COALESCE`, `EXISTS`, `NOT EXISTS`, `IN`, `NOT IN`, `sameTerm`, `ISNUMERIC`, `IRI`, `BNODE`, `STRDT`, `langMatches` , `timezone` and `SHA384` functions are not supported .

## Mapping
* `BNODES` are not supported in the mapping language.
* `Date, time and hexBinary` are missing from our default mappings from SQL to RDF values.
* Mappings cannot involve `subClassOf` (BSBM uses them), that is the database cannot contain the ontology. If it does, `rdf:type` doesn't work appropriately. 
* Two columns with the same name are treated as equal to each other. Example:
```
mapping:
{name} a :Person
SQL Query:
Select T1.name from T2, T1
```
If both T1 and T2 have a table called `name` this 2 columns will be treated as equal to each other and one of the 2 will be used. It is possible that T2.name is used instead of T1.name
* If the source query may lead to the creation of a sub-view (e.g. if it uses a DISTINCT or operators unsupported by our mapping parser), please make sure to use `variables of the view` in the target, not fully qualified column names of one of the tables used in the view definition.
Example: 
Currently unsupported mapping:
```
target		:series-{se.id} :hasSeason :series-{se.id}-season-{te.season_nr} .
source		SELECT DISTINCT se.id, te.season_nr
			FROM title se, title te
			WHERE se.kind_id=2 AND se.id = te.episode_of_id AND te.season_nr IS NOT NULL
```
Supported variant:
```
target		:series-{vid} :hasSeason :series-{vid}-season-{vseason_nr} .
source		SELECT DISTINCT se.id AS vid, te.season_nr AS vseason_nr
			FROM title se, title te
			WHERE se.kind_id=2 AND se.id = te.episode_of_id AND te.season_nr IS NOT NULL
```


## RDF4J API and Workbench
* Because the SPARQL Update language is not supported, it is not possible to  `Update` and `Delete` RDF data triples.
* `Delete Repository` fails for repositories that cannot be created (invalid configuration). One workaround is to create a valid repository with the same name and then to delete it. Another workaround is to delete it from Sesame's console.

## OWL API
* `Implementation` of most OWLReasoner methods is missing.

* `Symbol @` When we pass a literal to the OWL API, if it finds an "\@" it will interpret it as a language tag. The OWL API says: 

```
"If the datatype is  rdf:PlainLiteral, and the lexical value contains
a language tag then the language tag will   be parsed out of the lexical value. For example, "abc@en"^^rdf:PlainLiteral would be parsed into a lexical value  of 'abc' and a language tag of 'en'. "
```

Thus, if one expects such symbols in an object property the best solutions are:
1) cast the object to string in the mapping
2) replace the @ in the query with @.

## Databases and SQL
* `Case sensitivity:` correct SQL queries in mappings may fail because Quest registers the name with a different case.
* `Registered Keywords` - when you have a column name that is also a registered DBMS keyword, you should enclose that column name in quotes. Supported common keywords are: cast, do, extract, first, following, last, materialized, nulls, partition, range, row, rows, siblings, value, xml. 
* `CASTING` is an issue in DB2 and MySQL. Apply normalization when matching column names and table names against JDBC metadata.
* `Double/Real` and other precision datatypes behave differently in each database.
* `ORDER BY` in SQL Server: It is not possible to use LIMIT or OFFSET without an ORDER BY clause. Exceptions: OBDAException: Error executing SQL query: Incorrect syntax near 'OFFSET'. OBDAException: Error executing SQL query: Invalid usage of the option FIRST in the FETCH statement.
* `ORDER BY` in H2: in presence of an Union, the last version of H2 (1.4.), it orders both subqueries independently of each other giving wrong results. See SPARQL-compliance test offset-1
* `UNOPTIMIZED SQL OPERATORS/FUNCTIONS`: MIN/MAX, CASE, WHEN clause, DATE FUNCTIONS, NESTED SELECTS, MATCHES, RIGHT/FULL/SELF/CARTESIAN JOIN, SUBJOIN, ALL, ANY, UNION, INTERSECT, MINUM and EXCEPT: Unoptimized sql operators will be transformed in view and generate a result.
* `UNSUPPORTED SQL OPERATORS`:  EXISTS, UNIQUE, TOP 
* `REGEX OPERATOR` is not supported by MsSQL and DB2, while the other databases handle it differently
* `ALIAS` cannot be repeated see also [[Case sensitivity for SQL identifiers]]
* `REPLACE` is translated in the databases H2, Postgres and Oracle with regexp_replace.
* Mysql Server works only with ANSI_QUOTES enabled, using double quotes for identifiers.


## R2RML mappings
* no support for `inverseExpression`
* predicate cannot be uritemplate (column reference or template declaration)
* object cannot be uritemplate (column reference or template declaration) when predicate is rdf:type
* no support for `bnode` in Ontop
* no support for `sqlversion`
* no support for `graphMaps` (hence context graphs)
* bnode naming is arbitrary 
* constant type objects are returned as simple literal. Constant-valued term maps are not considered as having a term type, and specifying rr:termType on these term maps has no effect. 
For example we return "2011-01-04T00:00:00.0"
instead of "2011-01-04T00:00:00.0"^^xsd:dateTime

The current state of the W3C R2RML compliance tests could be seen [[W3C-R2RML-Compliance| here]]

## Ontop Bootstrapper
* The BNode syntax generated by  Ontop bootstrapper cannot be processed by Ontop
* Foreign keys on multiple columns are not supported
