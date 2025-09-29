# Release notes

## 5.4.0 (September 29, 2025)

##### New features
- New query unfolder, performing query unfolding in two phases for handling abstract SPARQL queries more efficiently, added [#846](https://github.com/ontop/ontop/pull/846)
- Support for `rdfs:subClassOf*` property path added [#832](https://github.com/ontop/ontop/pull/832)
- Bottom-up implementation of `EXISTS`, supporting most cases for `EXISTS`, added [#853](https://github.com/ontop/ontop/pull/853) and [#861](https://github.com/ontop/ontop/pull/861)
- Support for TDEngine added [#875](https://github.com/ontop/ontop/pull/875) and [#877](https://github.com/ontop/ontop/pull/877)
- Support for multi-line target queries in OBDA files added [#874](https://github.com/ontop/ontop/pull/874)

##### New optimization
- Case-insensitive substring matching simplified [#882](https://github.com/ontop/ontop/pull/882)

##### Refactoring
- Robust to primary keys with NULLable attributes added [#859](https://github.com/ontop/ontop/pull/859)
- `IQTree` and `QueryNode` code cleaned up [#862](https://github.com/ontop/ontop/pull/862)
- Numeric binary operators refactored [#893](https://github.com/ontop/ontop/pull/893)
- More Trino functions recognized [#849](https://github.com/ontop/ontop/pull/849)


##### Bug fixes
- `ORDER BY` lifted above `DISTINCT` when necessary [#847](https://github.com/ontop/ontop/pull/847)
- Foreign key inference in lenses preserved in the presence of IRI safeness declarations [#880](https://github.com/ontop/ontop/pull/880)
- Correct datatypes declared for all geospatial related functions

[Milestone on Github](https://github.com/ontop/ontop/milestone/29?closed=1)

## 5.3.1 (September 29, 2025)

##### New features
- Database init script added [#856](https://github.com/ontop/ontop/pull/856)
- `ST_Distance` function for Trino added [#845](https://github.com/ontop/ontop/pull/845)
- H2 information schema tables are now classified as system tables [#869](https://github.com/ontop/ontop/pull/869)

##### New optimization
- Conjunctive query containment check now handles NULLable columns [#872](https://github.com/ontop/ontop/pull/872)

##### Refactoring
- `CHARACTER VARYING` and `VARCHAR` are now treated the same in Dremio [#881](https://github.com/ontop/ontop/pull/881)

##### Bugfixes
- Arity violation fixed [#866](https://github.com/ontop/ontop/pull/866)
- DuckDB catalogs are now taken into account [#867](https://github.com/ontop/ontop/pull/867)
- Non-renamed variable in `NullableFDSelfLJOptimizer` fixed [#900](https://github.com/ontop/ontop/pull/900)
- Missing padding with nulls when simplified left joins fixed
- Long artificial `LIMIT` value reduced for supporting Dremio 26

[Milestone on Github](https://github.com/ontop/ontop/milestone/28?closed=1)

## 5.3.0 (February 18, 2025)

#### Major dependency update
  - RDF4J updated from 4.x to 5.1.0 [#819](https://github.com/ontop/ontop/pull/819)
  - OWLAPI updated to 5.5.1 [#819](https://github.com/ontop/ontop/pull/819)

#### New optimizations

  - Unique constraint inference for unions improved in presence of disjoint IRI templates
  - Inference of strict dependents as a lightweight alternative to functional dependencies added

#### Bugfix
  - `STRSTARTS` handling of IRI template strings fixed

## 5.2.1 (November 24, 2024)

- Column info extraction for Oracle made robust to latency [#827](https://github.com/ontop/ontop/pull/827)
- Implement RDF4J `Query.getDataset()` and `Query.setDataset()`
- Exponentially slow removal of variables of a large BGP after applying a distinct fixed

Apache Commons IO dependency updated

## 5.2.0 (August 16, 2024)

#### New features
 - Extract user information (ID, group, role) from HTTP headers and make it available to special SQL functions [#753](https://github.com/ontop/ontop/pull/753)
 - Insert user information into the query log [#768](https://github.com/ontop/ontop/pull/768)
 - Compression option added to the materialization [#797](https://github.com/ontop/ontop/pull/797)

#### Optimizations
 - Left join optimizations:
      - Pruning the right child when unused and cardinality doesn't matter [#752](https://github.com/ontop/ontop/pull/752)
      - More non-nullability constraints extracted from the ancestors for transferring self-left-joins based on functional dependencies [#761](https://github.com/ontop/ontop/pull/761)
      - Self-left-join elimination with nullable determinants of functional dependencies [#783](https://github.com/ontop/ontop/pull/783)
      - Self-left join elimination on nullable functional dependency determinants made robust to provenance variables and trivial functional dependencies [#804](https://github.com/ontop/ontop/pull/804)
 - Unique constraint and variable non requirement inference with distinct nodes improved [#756](https://github.com/ontop/ontop/pull/756)
 - Simplification of conjunctions and disjunctions of equalities [#755](https://github.com/ontop/ontop/pull/755)
 - Propagation of foreign keys from basic lenses to parents [#759](https://github.com/ontop/ontop/pull/759)
 - Functional dependency inference for unions improved [#760](https://github.com/ontop/ontop/pull/760)
 - Optimization to the SPARQL `strStartsWith` function [#801](https://github.com/ontop/ontop/pull/801)
 - IRI decomposition with more than 1 argument when some arguments are nullable enabled [#809](https://github.com/ontop/ontop/pull/809)
 - Removal of distincts below joins when there is a `limit 1` above
 - Year extraction from timestamps with DuckDB optimized

#### Refactoring
  - T-mapping and related optimizations refactored [#769](https://github.com/ontop/ontop/pull/769)
  - B-node label anonymization pushed into the IQTree [#772](https://github.com/ontop/ontop/pull/772)
  - Handling environment variables with the CLI refactored [#814](https://github.com/ontop/ontop/pull/814)
  - Robust simplification for GeoSPARQL functions [#808](https://github.com/ontop/ontop/pull/808)
  - Wrapping a values node into a lens at mapping processing time added (disabled by default; see property `ontop.wrapMappingValuesNodesInLenses`)
  - Non-nullable variables are not used anymore for right provenance from a left join (was preventing some optimizations)

#### Bug fixes
  - `<expression> = true` issue with SQLServer and Oracle fixed [#758](https://github.com/ontop/ontop/pull/758)
  - Connection test for Trino and H2 fixed [#767](https://github.com/ontop/ontop/pull/767)
  - Mysql datetime conversion is now encoded to UTF8 to avoid collation error [#779](https://github.com/ontop/ontop/pull/779)
  - Missing spaces in string format pattern with MySQL added [#784](https://github.com/ontop/ontop/pull/784)
  - Configuration classes now use injector suppliers [#794](https://github.com/ontop/ontop/pull/794)
  - MS SQL Server identifiers are now treated not case-sensitive (even if quoted) [#805](https://github.com/ontop/ontop/pull/805)
  - Incorrect time zone format in xsd:dateTime for Redshift's `TIMESTAMP` data type fixed [#807](https://github.com/ontop/ontop/pull/807)
  - Database constraints were ignored by Ontop CLI [#777](https://github.com/ontop/ontop/pull/777)
  - Error with the CLI during the R2RML to OBDA mapping conversion fixed [#799](https://github.com/ontop/ontop/pull/799)
  - `TIMESTAMP WITH TIME ZONE` is now recognized for H2
  - Typing nulls for `DATE` with Dremio fixed
  - Missing minutes from the DuckDB time zone added
  - Invalid URNs for the triple patterns generated when converting the mapping to R2RML fixed
  - Error with constant in order-by involving a VALUES node fixed
  - Missed duplicate elimination for some overlapping IRI templates fixed
  - Incorrect content types returned for CSV and TSV results of a SPARQL query fixed

[Milestone on Github](https://github.com/ontop/ontop/milestone/24?closed=1)

## 5.1.2 (January 17, 2024)

#### Bug fixes
 - Conflict between columns in case of a self-join in the bootstrapper [#786](https://github.com/ontop/ontop/pull/786)
 - Handling of casts for different versions of MySQL and MariaDB [#787](https://github.com/ontop/ontop/pull/787)

Several dependencies updated, including JQuery ([#780](https://github.com/ontop/ontop/pull/780))

## 5.1.1 (November 22, 2023)

#### New features
 - Option to expose system tables added [#744](https://github.com/ontop/ontop/pull/744)
 - Standard deviation and variance functions added [#735](https://github.com/ontop/ontop/pull/735)
 - Option to disable the registration of custom SPARQL aggregation functions [#746](https://github.com/ontop/ontop/pull/746)

#### Bug fixes
  See [https://github.com/ontop/ontop/milestone/23?closed=1](https://github.com/ontop/ontop/milestone/23?closed=1)

## 5.1.0 (August 15, 2023)

#### New features

 - Support for [flatten lenses](/guide/advanced/lenses.html#flattenlens) added *(beta)* [#622](https://github.com/ontop/ontop/pull/622), [#625](https://github.com/ontop/ontop/pull/625), [#628](https://github.com/ontop/ontop/pull/628), [#629](https://github.com/ontop/ontop/pull/629), [#633](https://github.com/ontop/ontop/pull/633), [#635](https://github.com/ontop/ontop/pull/635), [#636](https://github.com/ontop/ontop/pull/636), [#637](https://github.com/ontop/ontop/pull/637), [#638](https://github.com/ontop/ontop/pull/638), [#639](https://github.com/ontop/ontop/pull/639), [#640](https://github.com/ontop/ontop/pull/640), [#641](https://github.com/ontop/ontop/pull/641), [#642](https://github.com/ontop/ontop/pull/642), [#643](https://github.com/ontop/ontop/pull/643), [#661](https://github.com/ontop/ontop/pull/661), [#715](https://github.com/ontop/ontop/pull/715)
 - Support for [union lenses](/guide/advanced/lenses.html#unionlens) added *(beta)* [#612](https://github.com/ontop/ontop/pull/612)
 - Support for XSD cast functions added [#630](https://github.com/ontop/ontop/pull/630)
 - Support for date-trunc and more date extraction functions added [#705](https://github.com/ontop/ontop/pull/705)
 - Support for a separate RDF file for facts added [#666](https://github.com/ontop/ontop/pull/666)
 - Options to ignore invalid mapping entries [#631](https://github.com/ontop/ontop/pull/631) and lenses [#709](https://github.com/ontop/ontop/pull/709) added
 - Partial support for regular expressions in SQL Server added [#702](https://github.com/ontop/ontop/pull/702)
 - Support for DynamoDB using the CData connector added *(beta)* [#693](https://github.com/ontop/ontop/pull/693)


#### Optimizations
 - Upwards propagation of lens unique constraints added [#668](https://github.com/ontop/ontop/pull/668)
 - Left join optimizations:
    - Reducing left joins to inner joins when the right child has a left join [#662](https://github.com/ontop/ontop/pull/662)
    - Merging left joins nested on the left [#663](https://github.com/ontop/ontop/pull/663), [#686](https://github.com/ontop/ontop/pull/686)
    - Robustness to nullable joining columns [#667](https://github.com/ontop/ontop/pull/667) 
    - Pruning the right of a left join when not contributing
 - VALUES node decomposition added [#680](https://github.com/ontop/ontop/pull/680)
 - Functional dependency inference added [#681](https://github.com/ontop/ontop/pull/681)
 - Reduction of aggregation nodes with no aggregation functional terms to distinct added
 - Transitive closure of functional dependencies added [#732](https://github.com/ontop/ontop/pull/732)


#### Refactoring
  - Substitutions refactored [#616](https://github.com/ontop/ontop/pull/616)
  - Typing for math operators added [#706](https://github.com/ontop/ontop/pull/706)
  - QuotedIDFactory refactored [#644](https://github.com/ontop/ontop/pull/644)
  - Removal of non-required variables improved [#669](https://github.com/ontop/ontop/pull/669)
  - Support for the STRING datatype for DuckDB added [#646](https://github.com/ontop/ontop/pull/646)
  - Support for SAMPLE at the database level added [#660](https://github.com/ontop/ontop/pull/660)

#### Bug fixes
  - Support LIMIT/OFFSET in SQL Server improved [#676](https://github.com/ontop/ontop/pull/676), [#679](https://github.com/ontop/ontop/pull/679), [#682](https://github.com/ontop/ontop/pull/682), [#721](https://github.com/ontop/ontop/pull/721)
  - Extraction of unique constraints in Oracle made more consistent [#695](https://github.com/ontop/ontop/pull/695)
  - Metadata extraction for DuckDB made more robust [#687](https://github.com/ontop/ontop/pull/687)
  - Missing casts when using Bnode templates added [#657](https://github.com/ontop/ontop/pull/657)
  - Invalid SPARQL UNION translation fixed [#651](https://github.com/ontop/ontop/pull/651)
  - Empty results for CONSTRUCT queries with unions and different variables fixed [#652](https://github.com/ontop/ontop/pull/652)


#### Documentation
 - Dedicated pages for each supported database (for instance [AWS Athena](https://ontop-vkg.org/guide/databases/athena))
 - [Tutorial about lenses](/tutorial/lenses/)
 - [Tutorial about materialization](/tutorial/materialization/materialization)


## 5.0.2 (March 9, 2023)

#### New features
  - Support for Trino [#599](https://github.com/ontop/ontop/pull/599), PrestoDB [#601](https://github.com/ontop/ontop/pull/601), AWS Athena [#602](https://github.com/ontop/ontop/pull/602), DuckDB [#604](https://github.com/ontop/ontop/pull/604), AWS Redshift [#605](https://github.com/ontop/ontop/pull/605) and Google BigQuery [#615](https://github.com/ontop/ontop/pull/615) added
  - Declare some columns as IRI-safe in lenses [#587](https://github.com/ontop/ontop/issues/587)
  - Support for arbitrary JDBC properties added [#606](https://github.com/ontop/ontop/issues/606)

#### Bugfixes
  - Missing TLS cypher suite JRE modules added to the Docker image
  - More system schemas are now ignored in Oracle [#591](https://github.com/ontop/ontop/issues/591)

#### Tooling
  - [Scaffolding tool](https://github.com/ontop/dialect-factory-scaffolding) created to make it easier to implement a new SQL dialect adapter. 

## 5.0.1 (January 29, 2023)

#### New feature
  - DB metadata extraction for MS Access added [#589](https://github.com/ontop/ontop/issues/589)
  - JRE-embedded Ontop-Protégé bundles with Protégé-5.6.0-beta-2 are now provided

#### Refactoring
  - Support for Spark SQL improved and tests added in the CI
  - All the tables (besides excluded ones) in Oracle are now extracted, not just the user's ones

Several dependencies updated.

## 5.0.0 (December 31, 2022)

#### Important changes
  - Java 11 or newer is required
  - Ontop's Protégé plugin now requires at least Protégé 5.6-beta
  - RDF4J bindings updated to 4.1.0
  - The module `ontop-owlapi` is not published anymore. We recommend using `ontop-rdf4j` instead
  - RDF4J workbench modules removed
  - Docker image moved to [`ontop/ontop`](https://hub.docker.com/r/ontop/ontop)
  - Ontop views renamed [lenses](/guide/advanced/lenses)

#### New features
  - Support for SPARQL rules for the extending the VKG added [#576](https://github.com/ontop/ontop/pull/576)
  - Support for SPARQL `FROM` and `FROM NAMED` constructs (also part of [#576](https://github.com/ontop/ontop/pull/576))
  - The [Docker image](https://hub.docker.com/r/ontop/ontop) now also supported the ARM64 architecture and allows to run all the CLI commands [#532](https://github.com/ontop/ontop/issues/532)
  - Support for Snowflake added [#520](https://github.com/ontop/ontop/issues/520)
  - Support for MariaDB added [#271](https://github.com/ontop/ontop/issues/271)
  - N-Triples and N-quads are now supported by the SPARQL endpoint [#566](https://github.com/ontop/ontop/pull/566)
  - Option to fully reformulate the SPARQL query into SQL added [#577](https://github.com/ontop/ontop/pull/577)
  - Experimental support for flatten lenses added (only for PostgreSQL)

#### New optimizations
 - Optimization of joins with a union of class definitions added [#543](https://github.com/ontop/ontop/issues/543)
 - Optimizations for generic queries with limit added [#578](https://github.com/ontop/ontop/pull/578)
 - Optimization for queries retrieving all the properties or classes in use in the VKG added [#581](https://github.com/ontop/ontop/pull/581)

#### Refactoring
  - New module for testing dialects in the Github CI pipeline added [#568](https://github.com/ontop/ontop/issues/568)
  - JSQLParser updated to 4.4
  - Ontop's Protégé plugin isolated from Ontop modules [#278](https://github.com/ontop/ontop/issues/278)
  - Support for Databricks (Apache Spark) improved

Many bugfixes. See also [its milestone on Github](https://github.com/ontop/ontop/milestone/16?closed=1).

## 4.2.2 (November 18, 2022)

#### New features
  - Support for Protege 5.6-beta under Java 11 and Java 17
  - Support for the Databricks-specific JDBC driver [#554](https://github.com/ontop/ontop/issues/554)
  - Support for LIMIT/OFFSET in SQL Server 2008 [#531](https://github.com/ontop/ontop/issues/531)
  - Support for materialized views in PostgreSQL [#541](https://github.com/ontop/ontop/issues/541)

#### Bugfixes
 - VALUES handling with Teiid [#525](https://github.com/ontop/ontop/issues/525)
 - Metadata extraction for Dremio of schema names with dots
 - Typo in registration of Oracle factories [#557](https://github.com/ontop/ontop/issues/557)

Preventive update of dependencies including Jackson and Gson to address potential vulnerabilities.


## 4.2.1 (April 20, 2022)

#### New feature
  - Support for partial serialized DB metadata, when `ontop.allowRetrievingBlackBoxViewMetadataFromDB` is enabled.

#### Bugfixes
  - Not renamed variable in sub-query with a distinct ([#417](https://github.com/ontop/ontop/issues/417)).
  - OBDA to R2RML conversion: require mapping entry IDs to be unique.
  - Lang tags for constants in R2RML were ignored.
  - Several fixes related to VALUES.
  - Better HTTP codes for the ontology download endpoint.

The Jackson and Spring Boot dependencies have been preventively updated (to 2.13.2.2 and 2.6.6 respectively) to address potential vulnerabilities ([CVE-2020-36518](https://nvd.nist.gov/vuln/detail/CVE-2020-36518) and [CVE-2022-22965](https://nvd.nist.gov/vuln/detail/cve-2022-22965)).


## 4.2.0 (December 30, 2021)

#### New features
 - Support for Apache Spark ([#422](https://github.com/ontop/ontop/pull/422)).
 - Support for time functions added ([#478](https://github.com/ontop/ontop/issues/478)).
 - Support for the `IN` SPARQL function added.
 - Datatypes can be extracted from non-supported source queries in the mapping (treated internally as "black-box" views). Disabled by default (see [`ontop.allowRetrievingBlackBoxViewMetadataFromDB`](/guide/advanced/configuration)).
 - TBox triples (e.g. sub-classes, domains and ranges) can be added to the default RDF graph. Disabled by default (see [`ontop.enableFactExtractionWithTBox`](/guide/advanced/configuration)).
 - Support for [Ontop join views](/guide/advanced/views) added.
 - Support for arbitrary levels of Ontop views added (views over views).
 - Better integrity constraint extraction for Ontop basic and join views.
 - Non-null information can now be specified for Ontop views.
 - Support for b-node facts added.
 - The default query of the SPARQL endpoint portal is now configurable ([#454](https://github.com/ontop/ontop/issues/454)).
 - Contextually injective IRI templates with numeric or UUID arguments are now decomposed ([#363](https://github.com/ontop/ontop/issues/363)).
 - JSON-LD serialization now supported by the materializer ([#481](https://github.com/ontop/ontop/issues/481)).


#### Refactoring
 - Support for Java >= 8. Ontop decoupled from Protégé so as to update several common libraries ([#467](https://github.com/ontop/ontop/issues/467)). 
 - RDF facts provided by the ontology file are now internally grouped together into values blocks (sorts of "in-memory tables") instead of being splitted into large unions. Enabled by default (see [`ontop.enableValuesNode`](/guide/advanced/configuration)).
 - Unions are lifted above aggregations when possible.
 - Docker image updated to JRE 11.
 - Mutable intermediate queries are not used anymore.
 - Stronger handling of non well-designed `OPTIONAL` blocks.
 - Stronger handling of `ORDER BY` in sub-queries.
 - Type extractor relaxed ([#438](https://github.com/ontop/ontop/issues/438)) to tolerate slightly different datatypes.
 - JDBC distinct result set removed.
 - JDBC user name and password are not required anymore. Useful when passed in the JDBC URL.
 - The Command-Line Interface of the bootstrapper has been refactored (invalid options removed, comments improved).

 Many bugfixes (see for instance [our Github bugtracker](https://github.com/ontop/ontop/milestone/14?closed=1)).

 

## 4.1.1 (July 23, 2021)

#### Bugfixes

- Bugs related to GeoSPARQL support ([#428](https://github.com/ontop/ontop/issues/428),[#434](https://github.com/ontop/ontop/issues/434) )
- Issue with ORDER BY and LIMIT for MS SQL ([#225](https://github.com/ontop/ontop/issues/225),[#412](https://github.com/ontop/ontop/issues/412))

#### New features
- Teiid support ([#336](https://github.com/ontop/ontop/issues/336))
- Various improvements of the Protégé plugin 

## 4.1.0 (February 28, 2021)

#### Changed behavior
 - [OBDA to R2RML mapping conversion](/guideécli#ontop-mapping-to-r2rml) now requires by default access to DB metadata (through credentials or as a serialized file). This requirement can be bypassed with the argument `--force`.
 - By default, DESCRIBE queries only return the triples where the described IRI appears as subject. To also consider the triples where it appears as object, set the parameter `ontop.includeFixedObjectPositionInDescribe` to true.
 - The Docker endpoint image is now based on Debian ([#394](https://github.com/ontop/ontop/issues/394)), not on Alpine anymore.

#### New features

- Support for GeoSPARQL functions added ([#335](https://github.com/ontop/ontop/issues/335)).
- [Rich JSON-based query logging](/guide/advanced/logging) added.
- [New endpoint for predefined queries](/guide/advanced/predefined) added (beta). It enables the specification of custom low-latency Web APIs in a declarative manner.
- Support for the `IF`, `IRI`, `BNODE` SPARQL functions added.
- Support for Dremio added.
- DB metadata can now be loaded from files instead of connecting to the database.
- Bnode labels are now anonymized on-the-fly. Bnode templates can safely use PII.
- Sensitive JDBC information (user name, password, URL) can now be passed as arguments or environment variables (for Docker) instead of being written in the properties file. Docker secrets are also supported for further security.
- New left join optimization techniques added. General functional dependencies are now taken into account. Sensitivity to left join ordering reduced.
- [HTTP caching](/guide/advanced/caching) headers can now be returned by the Ontop SPARQL endpoint.
- Native Protégé bundles for each platform (Windows, MacOS, Linux) with JRE 8 embedded.
- Basic support for Ontop views added (experimental), which, in particular, allows specifying integrity constraints on views defined at the Ontop level.

#### Removal
 - As announced earlier, the RDF4J Workbench-based bundles are not shipped anymore. However, the webapps war file can still be built with Maven.

#### Refactoring

- Drastic reduction of memory consumption when processing SPARQL queries ([#370](https://github.com/ontop/ontop/pull/370)), which is significant for materializing large RDF graphs.
- Better file resource handling ([#368](https://github.com/ontop/ontop/pull/368)).
- Distinct lifting improved.
- Self-join elimination based on functional dependencies re-implemented.
- Decomposition of heterogeneous IRI templates enabled.
- Lexical value space is now considered when decomposing IRIs. 
- Protégé plugin codebase cleaned, with parts of UI streamlined and redesigned. Improved syntax highlighting in target and source queries. Mapping validation extended. Multiple open ontologies supported ([#282](https://github.com/ontop/ontop/issues/282) and [#175](https://github.com/ontop/ontop/issues/175)).
- RDF4J external binding management refactored.
- Bnode handling refactored.
- Java 11 support.
- Better handling of column names when converting OBDA mappings into R2RML, which now uses DB metadata.
- CONSTRUCT and DESCRIBE query handling refactored.
- Parser for OBDA mappings refactored.
- Character encoding in R2RML templates refactored.
- Default file encoding set to UTF-8. Particularly useful on Windows. Can be overridden if needed.
- [Build script](/dev/build) refactored. Now fully based on Maven ([#393](https://github.com/ontop/ontop/pull/393)).
- Base Docker image updated.
- PostgreSQL transaction handling (in streaming mode) improved.
- Timeout support extended to non-SELECT queries.

Many bugfixes.


## 4.0.3 (October 16, 2020)

#### Bugfixes

- Wrong IRI decomposition ([#358](https://github.com/ontop/ontop/issues/358))
- Logback config file ignored by Ontop CLI ([#361](https://github.com/ontop/ontop/issues/361))

## 4.0.2 (September 3, 2020)

- Fixed Named Graphs (quad) grammar in the target of the Ontop native mapping language.

## 4.0.1 (August 28, 2020)

#### New features and bugfixes

- Named Graphs (quad) are supported in materialization ([#343](https://github.com/ontop/ontop/issues/343))
- Removal of Jena as a dependency ([#349](https://github.com/ontop/ontop/issues/349))
- `com.mysql.cj.jdbc.Driver` is now also recognized. Non-recognized drivers now use the default SQL factories instead of the mock-up one.


## 4.0.0 (July 31, 2020)

#### Refactoring
* Dependencies updated (e.g. RDF4J 3.3.0)
* SERIAL datatypes of PostgreSQL better handled
* Anonymous blank nodes are now supported in CONSTRUCT blocks
* JSON-LD now supported for graph queries
* Denodo support improved.

Few bugfixes.


## 4.0.0-rc-1 (July 8, 2020)

#### Changed behavior
 - Streaming mode is enabled by default for query answering. It fetches data by batches of 500 results. 

#### New features

- Support of GROUP_CONCAT added. All the standard SPARQL aggregation functions are now supported.
- Named graphs are now supported.
- Support of Denodo added. Support of Dremio is postponed to 4.1.
- Support XML catalog file added (beta). It enables resolving `owl:imports` assertions from the ontology by loading local files instead of fetching remote URLs. It is available in Protégé and with the `ontop endpoint` CLI command.
- DB metadata extraction CLI command added (experimental).
- CASE and CAST is now supported in the mapping.
- Streaming mode for query answering added.

#### Deprecation

- The RDF4J Workbench-based SPARQL endpint is deprecated. Tomcat, Jetty bundles and webapps (.war files) will be removed in a future version. Users are recommended to switch to the `ontop endpoint` CLI or its Docker image.

#### Removal
 - The Mapping Assistant panel has been removed from the Ontop Protégé plugin.

#### Refactoring

- SQL parsing of the mapping improved. JSQLParser's version has been updated.
- Metadata extraction refactored, and SQLDialectAdapter has been eliminated. 
- Meta-mapping management improved.
- Non-recognized SQL functions in the mapping are now only assumed to be deterministic. Other assumptions have been removed.
- Internal data nodes now create variables only for database columns that are used in the query. This sparse usage of variables strongly improve reformulation time and log readibility when using tables with 100+ columns in the mapping.

Many bugfixes.


## 4.0.0-beta-1 (December 23, 2019)

#### Changed behaviors

-   Cardinality is now enforced by default (duplicates are removed at
    the mapping level). This is required to support most of the
    aggregation functions.
-   Functions in the SQL queries of the mapping that are unknown to
    Ontop do no cause the creation of SQL views anymore. The strategy
    regarding SQL functions moved from white-list to black-list.
-   Types returned by supported SPARQL functions now strictly follow the
    SPARQL 1.1 specification.

#### New features

-   SPARQL Aggregation functions SUM, COUNT, AVG, MIN, MAX are now
    supported. SAMPLE is currently implemented as MIN.
-   Joins over terms that are constructed using different functions are
    now supported.
-   Some functions (such as IRI templates) can now be post-processed
    (that is, they are not always included in the SQL query anymore).
    Generated SQL queries are generally less verbose than before.
-   The Ontop endpoint now has the portal option, where predefined
    queries are shown in the Web interface.
-   The NULLIF SQL function is now supported and optimized. Useful for
    filtering out some unwanted values in the mapping assertions.
-   OPTIONALs outside the well-designed fragment are now supported.
    Weakly well-designed queries encoding preferences are optimized.

#### Refactoring

-   The typing system have been entirely redesigned. RDF types and
    database types are now clearly separated. Each database engine can
    now bring in its own data types.
-   The Datalog data structure (from version 1.x) for representing
    queries internally has been removed.
-   Function symbol creation and optimization has been entirely
    refactored. They are constructed by two factories, the
    FunctionSymbolFactory and the DBFunctionSymbolFactory.
-   Most of the logic of SQLDialectAdapter has been moved to
    DBFunctionSymbolFactory and DBTypeFactory. Each database engine is
    expected to have its own implementation of these new interfaces.
-   The SPARQL translation has been rewritten (was formerly translating
    into Datalog).
-   The SQL generator has been rewritten (was formerly translating from
    Datalog).

#### Temporary limitation

-   Due to a complete refactoring of the SQL dialect management, only
    the H2, MySQL, PostgreSQL, Oracle, SQL server and DB2 dialects are
    supported in this beta. Dremio and Denodo dialects are expected to
    be supported in a next beta release.

Many bugfixes.


## 3.0.1 (December 9, 2019)

#### Changed behaviors

-   Protégé: no property file (resp. mapping file) is created if no data
    source (resp. mapping assertion) is specified by the user.

#### New features

-   Ontop endpoint now supports R2RML files and doesn\'t require an
    ontology.
-   Materialization: N-triples format is now supported.

#### Refactoring

-   Rewriting of the tree-witness rewriter (now independent from
    Datalog)

#### Bug fixes

-   Protégé: fixed issues related to prefix management.
-   Reasoning: issue related to the handling of inverse properties
    fixed.

## 3.0.0 (August 23, 2019)

#### Changed behaviors

-   The \`rdfs:range\` of a data property is not used anymore for
    inferring the non-specified datatype in a mapping assertion but for
    validating the datatype once specified or inferred. Datatype
    inference is now based on the DB datatype and follows the R2RML
    natural mapping (https://www.w3.org/TR/r2rml/\#natural-mapping)

#### New features

-   Support of Protege 5.5
-   Support of BNode in R2RML
-   Basic support for the \`geo:wktLiteral\` datatype (\#256)
-   New command-line interface for SPARQL endpoint
-   Docker container for SPARQL endpoint
    (https://hub.docker.com/r/ontop/ontop-endpoint)
-   Preliminary support of Dremio
-   Preliminary support of Denodo
-   The ordering of SPARQL variables is now preserved (\#291)
-   N-Triples output for materialization added
-   The SQL translation now appears as a sub-tab in the Protégé Ontop
    SPARQL tab

#### Refactoring

-   The triple predicate is now systematically used in the mapping and
    during query unfolding
-   Atom predicates and function symbols are now clearly distinguished
-   The Datalog-based data structure is not used anymore at mapping
    processing time and by the default rewriter
-   Query containment-based optimizations applied to the mapping after
    saturation improved
-   The materializer is now based on RDF4J (instead of OWLAPI)

#### Project organisation

-   Release of Ontop on both SourceForge and GitHub (\#274)
-   A new repository for the tutorial
    (https://github.com/ontop/ontop-tutorial)

Many bugfixes.

## 3.0.0-beta-2 (February 28, 2018)

#### Changed Behaviours

-   The JDBC driver class name is now required in Protégé (issue \#248)

#### New features

-   Novel left join optimization techniques (issue \#230)
-   LIMIT appended to test SQL queries and SPARQL queries in Protégé
-   Report illegal usage of Fully qualified column names (FQDN) in the
    target part of a mapping assertion
-   Support for the SPARQL isNumeric function

#### Refactoring

-   Internal representation of the ontology improved
-   Improvement of the intermediate query representation (issues \#235,
    \#236)
-   Switch to ANTLR4 to parse ontop native mapping (issues \#238, \#239)
-   Make ResultSet.next() robust (issue \#219)
-   More robust handling of IRI-safe encoding (issue \#245)

#### Bug Fixes
Many, see [closed issues](https://github.com/ontop/ontop/milestone/7?closed=1).

## 3.0.0-beta-1 (August 11, 2017)

Note that this is the first release from version 3 series with many
internal refactoring and improvements, and bug fixes. However, these
changes also cause incompatibility with Ontop v1. See [the migration
guide](MigrationGuideV1toV3 "wikilink").

#### Changed Behaviours

-   JDBC connection information is stored in a separate properties file
-   Fully qualified columns (table.column) are not allowed in the target
    part of the mapping language. One has to explicitly create an alias
    (e.g. table.column AS table\_column) and use the alias in the
    target. (complying with R2RML)
-   The rules for datatype type inference and checking are changed. Now
    we use only mapping and database to infer the datatypes (complying
    with R2RML), and the (range axioms) in the ontologies to check the
    compatibility (complying with OWL).

#### New features

-   Major refactoring of the internal structure of the Ontop system
-   Databases for Integration Tests have been dockerized.
-   Upgrade Sesame to the latest version of RDF4J (v2.2.2).
-   The redesigned OWLAPI and RDF4J API bindings of Ontop API (see
    examples: <https://github.com/ontop/ontop-api-examples>)
-   Upgrade of R2RML API to v0.6.0
-   Official support of both Tomcat and Jetty (v9) for deploying a
    SPARQL endpoint
-   Better support of Optional (bugfix \#190)
-   Protege: support for \"Synchronize Reasoner\" in the Reasoner menu
-   Improved error messages for incorrect mapping
-   CLI tool for converting Mapping from v1 to v3

## 1.18.1 (June 16, 2017)

-   Return a correct extension for files in ontop cli materializer
    (issue \#145)
-   Materialize support non-http resource uris

-   Bug Fixes
    -   Small fixes in cli (issues \#127, \#141, \#188)
    -   PostgreSQL JDBC driver fix for quotation marks
    -   Remove unknown property warning for owl:sameAs
    -   Remove duplicate annotations during materialization (issues
        \#183 \#186)
    -   Generate different file names for properties and classes during
        materialization with separate files (issue \#165)
    -   R2RML
        -   Small changes in api
        -   Fix R2RML import of SQL query (issues \#181 \#182)
        -   Fix export from OBDA mapping to R2RML (issues \#158 \#159
            \#160)
    -   Fix in SPARQL use of filter and values with a IRI (issue \#191)
    -   Fix handling of mysql metadata with lower\_case\_table\_names
        setting on (issue \#192)

## 1.18.0 (May 26, 2016)

-   Protege
    -   Redesigned materialization gui
    -   Upgrade to Protege 5.0.0
-   Support of querying annotation property from ontology (issue \#105)
    (disabled by default)
-   Support of the use of owl:sameAs in mappings (disabled by default)
-   Package names have been unified to it.unibz.inf.ontop
-   Upgrade OWLAPI to v4.2.5
-   Bug Fixes
    -   Fix obda-to-r2rml convert for template like \<{uri}\> (issue
        \#97)
    -   Fix an issue in Protege when renaming data source.
    -   Fix error messages in protege mapping assistant panel and SPARQL
        query
    -   Fix issue with multiple schemas (issue \#99)
    -   Fix internal SQL conversion for Teiid jdbc driver
    -   Fix support of anonymous ontology (issue \#101)
    -   Fix warning message in Protege (issue \#102)
    -   Fix xml uri (issue \#104)
    -   Fix r2rml api, error predicateMap with template (issue \#107)
    -   Fix in Protege import of additional ontology and add classes and
        properties of imported ontologies at runtime (issues \#106
        \#108)
    -   Fix querying URI constants (issue \#111)
    -   Fix error message creating new mapping (issue \#120)

## 1.17.1 (February 16, 2016)

-   Bug Fixes
    -   Fix an issue when creating new datasource in Protege

## 1.17.0 (February 4, 2016)

-   Protege
    -   Ontop protege plugin now available on official Protege Plugin
        Repository!
    -   Upgrade Protege to 5.0.0-beta-21 (latest version)
    -   Ontop protege plugin is packed as one jar now \-- no need for
        separated OSGI JDBC configuration jars
    -   do not generate .obda and .q file when no datasource is present
    -   General improvement of UI \-- more intuitive and less confusion
-   Support for Annotation Properties in mappings
-   Improvement of Ontop mapping language for URIs/Literals retrieved
    from DB columns
-   Support for SPARQL VALUES keyword for SPARQL federation
-   Java 8
-   Upgrade OWLAPI to v4.1.3 (latest version)
-   Bash Completion for command line interface
-   Better structured Wiki: <https://github.com/ontop/ontop/wiki>

## 1.16.1 (November 16, 2015)

-   Optimizations exploiting foreign key constraints over multiple
    columns
-   Improvement in the RDB2RDF compliance test (contributed by Evren
    Srin)

## 1.16.0 (October 14, 2015)

-   Support for [ SPARQL functions ](OntopSPARQLFunctions "wikilink")
-   Support for column oriented RDBMS [
    MonetDB](ObdalibPluginJDBC "wikilink")
-   Support for cloud RDBMS [ SAP HANA](ObdalibPluginJDBC "wikilink")
-   New Optimization technique: [
    Implicit-database-constraints](Implicit-database-constraints "wikilink")
-   New Optimization technique: [
    Exact-Mappings](Exact-Mappings "wikilink")
-   Bug Fixes
    -   Handling quotes in the WHERE clause of SQL query in mappings .
    -   Allow multiple subjects in the target of mapping of Ontop native
        syntax.
    -   Return correct value from datetime columns using jtds driver
    -   Fix the translation of LIMIT with ORDER BY in oracle database
    -   Fix a bug in MetaMappingExpander

## 1.15.0 (May 13, 2015)

-   Upgrade the Protege plugin to Protégé 5
-   New Command line interface
-   Better support for SPARQL BIND
-   Support for SPARQL Concat and Replace
-   Support for SQL Concat and Replace (in the mappings)
-   Support for xsd:dateTimeStamp
-   Improved Optimization techniques (Contribution by Roman Konchakov)
-   Implementation of Autoclosable interface for core classes in the API
    to support \`try with resource\`.
-   Create a sub-query when SELECT DISTINCT is used in the mappings.
-   Bug Fixes
    -   Handle the 30-characters limit for variable names in Oracle.
    -   Fix the mapping render of Protege when multiple subjects are in
        the target of mapping.

## 1.14.0 (November 4, 2014)

-   Added support in ontology and mappings for datatypes xsd:int,
    xsd:long, xsd:positiveInteger, xsd:negativeInteger,
    xsd:nonPositiveInteger, xsd:nonNegativeInteger, xsd:float
-   Optimized implementations of TBox classifications, and query
    containment checking, which are much faster than before
-   Validation for Sesame Workbench made stronger. It prevents
    repositories with an invalid configuration to be created.
-   Bug Fixes:
    -   Fix SPARQL functions (str(), lang()) to use rdfs:Literal instead
        of xsd:string
    -   Issue converting datatypes of R2RML constants
    -   Support UNICODE characters in TurtleParser
    -   Catch exceptions for Protege R2RML Export
    -   Fix conversion from ontop mappings to R2RML of language tag and
        triples

## 1.13.1 (September 29, 2014)

-   Bug Fixes:
    -   The redundant query elimination optimization sometimes does not
        handle facts properly
    -   Some warning messages related to datatype range axioms are
        ambiguous

## 1.13.0 (September 25, 2014)

-   Support for providing implicit DB Constraints (e.g. foreign keys) to
    Ontop to generate efficient SQL
-   Command line feature to generate pretty R2RML
-   Stream output in the Protege Plugin
-   Support for Regex in mappings
-   Proper handling of datatypes in ontology and mappings
-   Support for hsql database
-   Support for datatypes xsd:date, xsd:time and xsd:gYear
-   Bug Fixes:
    -   Issue with nested equivalences in unfolder
    -   Problem with multiple join conditions in R2RML
    -   Cancelling running queries in Protege
    -   Blank lines in generated sql causes problems for oracle

## 1.12.0 (June 26, 2014)

-   Support for finding empty concepts and properties
-   Integration with a new R2RML API
-   Less restrictive mode for JDBC driver validation
-   Faster TBox reasoner implementation
-   Optional \"Replace\" Statement in the SQL translation. When
    \"Replace\" is off the SQL performs much better.
-   Several Bug Fixes:
    -   Issue with \'true\' in Oracle
    -   Meta-mapping editing in Protege
    -   Problem with regex in Oracle
    -   Several issues with R2RML

## 1.11.0 (February 19, 2014)

-   Support for Consistency Checking
-   Improved Performance
-   Support for Multi-schema queries
-   New SQL parser for the mapping based on JSQLParser.
-   Extended the supported SQL language: IN, BETWEEN, LIKE, etc.
-   Extended the supported SPARQL: BIND
-   Improved the Treewitness rewriting algorithm.
-   Upgraded to Sesame 2.7.10
-   General clean-up
-   Fixed a number of bugs:
    -   Translation of SAPRQL REGEX into SQL
    -   Infinite loop triggered by some nested Optionals
    -   Several issues with Construct
    -   Several issues with R2RML

## 1.10.0 (December 16, 2013)

-   Ontop under Apache license
-   Ontop packages in central maven repository

## 1.9.0 (September 18, 2013)

-   Update to Sesame 2.7.6 (latest)
-   Validation of datatypes w.r.t. XMLSchema specification
-   New hybrid Abox functionality support
-   Removed all dependencies to Jena
-   Removed wrong/unnecessary dependencies
-   Turtle parser can handle variables in the predicate
-   Mappings with URI templates in class or properties suppot
-   First version of mapping splitter
-   Bug fix: Null pointer exception when the URI in Protege plugin was
    empty
-   Bug fix: Literal and literal with language tag handling
-   Bug fix: Shutdown of Sesame repoConnection
-   Bug fix: Object column literal gerenation in R2RML
-   Bug fix: Queries that would not finish execution
-   Bug fix: Unexpected bindings in unfolder
-   Bug fix: Null pointer exception in ontology translation in the case
    of unsupported axiom
-   Bug fix: OWL class assertion generation, inverted arguments
-   Bug fix: SameTerm in sparql algebra to datalog translation
-   Bug fix: URI template matcher to find most specific matches first
-   Bug fix: Construct queries
-   Bug fix: Describe queries

## 1.8.0 (July 29, 2013)

-   Improve error message and better exception handling.
-   Change the representation of `null` value in BindingSet
-   Modified the computation of the LeftJoin to support empty evaluation
    in its second argument.
-   Changed the type of the semantic index table for integer data
    property assertion from INT to BIGINT to be able to handle
    `xsd:integer` type
-   Set index creation during Quest startup
-   Implement new feature for bootstrapping, command line scripts,
    integration in ontoPro plugin
-   Updated the URI templates in Turtle mapping syntax to make it
    simpler and closer to Turtle. Now quotes, question marks and
    class/property declarations are no longer required

For example, in the previous syntax:

      <"test;person/{?id}"> a :MyClass; :hasName {?name}.

becomes simply

     test:person/{id} a :MyClass ; :hasName {name} .

-   Support \"%\", \"=\", \";\" characters in the URI template.

<!-- -->

      :class/{id};{name}%{class type}

-   Bug fix: Major bugs in execution handling SPARQL Construct and
    SPARQL Describe queries.
-   Bug fix: Issues related to commits and batch sizes in
    QuestOWLStatement
-   Bug fix: Issue with URI template matcher that generates `null` in
    case failed template (now it generates URI(\"xxxx\") where xxx is
    the URI that was being matched.)
-   Bug fix: Issue in existential clause in tree-witness algorithm
-   Bug fix: Issue in the maximum size of URI that has more than 400
    characters
-   Bug fix: Issue in some data that can not be tracked when inserted
    into the database. In particular if the data comes from
    classes/properties that were simplified by the equivalence
    resolution.
-   Bug fix: Issue in exception handling during index creation in
    semantic index test.
-   Bug fix: Issue in SQL parser that it doesn\'t capture the scope
    within parentheses in the WHERE clause.
-   Remove table and column identifier quotes in the SQL target query
    string so that the parser can parse properly. For example:

<!-- -->

      SELECT "Student"."sid" from "Student"

will become:

      SELECT Student.sid from Student

-   New semantic index implementation with integer references for URIs
    for faster query answering (faster joins on integers instead of
    strings)

**Ontop source code**

-   Ontop is now in GitHub!
-   Cleaner and slimmer project structure. We removed obsolete classes
    and tests.
-   Code refactor in Materialiser API, MinimalCQProducer and
    Construct-Describe query execution.
-   More complete test cases for testing Quest features, e.g.,
    Tree-Witness rewriting, Data materialiser, SQL parser, SPARQL
    Construct, SPARQL Describe, SPARQL Optional, Database metadata and
    Query completeness.
-   Support JUnit4 test cases.

## 1.7-alpha2 (rev 2305, April 5, 2013)

-   Support for importing/exporting R2RML mappings
-   Support for automated mapping generation as defined by the \"Direct
    Mapping\" W3C specification
-   Various options for data materialization (similar to dump-rdf in
    D2RQ)
-   Support for concurrent queries in the SPARQL endpoint through
    connection pooling
-   Better support for Oracle, Postgres, SQL Server and DB2
-   Improved the SQL queries generated by Quest by avoiding some
    operations when unnecessary (e.g., casting), and placing optimally
    the JOIN conditions in the SQL query.

## 1.7-alpha2 (rev 2178, February 7, 2013)

**-ontopQuest-**

-   Mapping optimiser: improved the generation of OR mappings
-   Mapping optimiser: improved the simplification of mappings using
    FOREIGN KEYS
-   Query optimiser: Improved the query optimiser to avoid generation of
    redundant JOINs and redundant UNIONs w.r.t. FOREIGN KEYs
-   Support percent encoding in strings in URI templates as defined by
    the R2RML standard.
-   Better propagation of Exception messages in the Sesame provider
-   New **scripts for querying quest** from the command line

**-ontopPro- plugin**

-   **Introducing mapping assistant**. A new GUI-based tool for creating
    mappings. This is an experimental GUI to help you create mappings in
    a faster way, please help us improve it by reporting any issues you
    may find. (See [
    guideliness](ObdalibPluginMappingAssistant "wikilink")).
-   Users can set the max number of tuples returned in \"OBDA Query\"
    tab.

**Mapping language features (-ontopQuest- and -ontopCore-)**

-   Support URI identifier obtained directly from the database (no using
    URI template).
-   Support multiple lines when wrting SQL source query (See [ feature
    notes](ObdalibObdaFile#SourceandMappingDeclaration "wikilink"))

**Bug fixes**

-   Bug fix: Issue with MySQL and UTF8 characters (Korean in particular)
-   Bug fix: Issue with \"unbound variable freshX\_X found while
    generating SQL\" fixed.
-   Bug fix: Inverse minimum cardinality assertion was being ignored.
-   Bug fix: Source SQL query doesn\'t accept parenthesis in WHERE
    clause.
-   Bug fix: JDBC connection doesn\'t recover when connection lost.
-   Bug fix: Sesame virtual repository fails to read Quest preferences.
-   Bug fix: CSV export function only exports 101 tuples instead of all
    the tuples.
-   Bug fix: Null pointer exception in the query result table.

## 1.7-alpha (rev 2039, December 30, 2012)

**SPARQL support**

-   Support for most SPARQL built in functions, e.g., arithmetics, type
    checking, etc.
-   Support for CONSTRUCT and DESCRIBE result forms
-   Support for OPTIONAL and bound, which allow you to have NEGATION in
    the usual SPARQL 1.0 style.
-   Support for variables in ANY position, e.g., to allow queries such
    as SELECT ?p ?v WHERE { ?x :name \"John Smith\". ?x ?p ?v }
-   Stronger compliance to standard RDF and SPARQL semantics for FILTER
    expressions

**Performance**

-   Multiple improvements to the SPARQL-to-rule translation, mapping and
    TBox optimization algorithms.
-   New algorithm for query rewriting w.r.t. the TBox that increases the
    performance of query answering by many orders of magnitude when
    inference w.r.t. to existential constants is enabled. The
    implementation has been contributed by Dr. Roman Kontchakov.
-   New benchmarks. We tested against Virtuoso triple store, Virtuoso
    RDF views and D2R Server using the BSBM and FishMark benchmarks.

**APIs and Accessibility**

-   Completely new Sesame API provider, now users of Sesame can create
    \"Virtual RDF repositories\" with -ontop-
-   SPARQL end-point support through integration with Sesame\'s
    workbench

**Mapping language**

-   Improved support for default literal types, now it conforms with the
    R2RML \"Natural Mapping\" specification
-   Support for language tags obtained from the DB
-   Proper support for constants in the mappings
-   Proper internal handling of NULL values in the database (as
    recommended by the R2RML standard)

**Database support**

-   Restored support for Oracle, DB2 and SQL Server
-   Improved support and performance over MySQL

**Documentation**

-   Revised and extended all technical documentation

## 1.7-alpha-rev-1692 (August 16, 2012)

**-ontop- general**

-   New file content for the OBDA output file. The file is no longer in
    XML format but instead it uses plain text for simplicity (Issue:
    \#244).
-   Improved error messages when the system initializes, parses
    mappings, fails to

` execute queries, etc.`\
`  `

**-ontopPro- Protege plugin**

-   Support Protégé 4.2
-   Add cancel button during query execution to terminate the process
    immediately.
-   Add help button to guide filling data source parameters.
-   The plugin no longer introduces prefix definitions
-   Implemented \"Cancel\" function for query execution
-   New shortcut CONTROL + T to test mappings in the mapping creator
-   Fixed several issues with prefix management and rendering of

` URIs short forms`

-   Improved GUI, hints and suggestions for JDBC connections, improved
    TAB navigation

` in all dialogs`

-   Bug fix: Improve error reporting and stack trace printing (Issue:
    \#255, \#262)
-   Bug fix: The target and source string got saved partially if
    newlines are used.
-   Bug fix: The OBDA model doesn\'t get loaded if the query has an
    exception.
-   Improved error management during .obda and query file load
-   Fixed null pointer exception and blank window that appear in cases
    where the .owl file

` in OWL/RDF contained different default ns and a default prefix`

**-ontopQuest- OWL Reasoner**

-   Added support for SPARQL query modifiers: ORDER BY, OFFSET and LIMIT
    (Issue: \#261).
-   Add query caching to speed up the system performance, now repeated
    query execution will not require SQL generation every time.
-   Relaxed on punning checks to allow loading of DBPedia and similar
    ontologies.
-   EXPERIMENTAL: Added support for mixed ABoxes for class assertions,
    i.e., most data comes from the mappings but a bit of data is also
    allowed in the ABox, e.g., global facts Planet(\'mars\')
-   Improved support for MySQL, Postgres, DB2 and SQL Server dialects
-   Added a warnings when axioms are being ignored because of being out
    of OWL 2 QL
-   Improved error reporting on failed connections
-   Improved support for SQL AS for table and column renaming in
    mappings
-   New way to generate SQL. SQL now includes typing information and is
    pretty printed.
-   Bug fix: Fixed issue with INVALID URI that appeared when mappings
    used data that contained invalid characters for URI\'s (e.g., white
    space) Now we call URIEncode (Jena\'s) before returning the value.
-   Bug fix: Exception when importing data as ABox individuals.
-   Bug fix: Exception when null values is used as constants.
-   Bug fix: Exception if ambiguous column names are used in SQL
    queries.
-   Bug fix: Wrong URI shorten if there are two or more namespaces with
    overlapping strings.
-   Bug fix: Null pointer exception due to inconsistent OBDA model
    identifier string.
-   Bug fix: Unknown signature in the SELECT clause if the name is a
    qualified name and it comes from a view (Issue: \#259)
-   Bug fix: Exception when using URIs as a constant values in SPARQL.
-   Bug fix: Prefix Manager accepts any string including invalid prefix
    names.

Known issues:

-   The ORDER BY modifier is not ready for columns with literal datatype
-   Issues with MySQL in non-ANSI mode
-   DateTime data properties in Oracle can crash the system.

## 1.7-alpha-rev-1529 (June 12, 2012)

**-ontopPro- plugin**

-   Better layout, fonts and command icons.
-   Better query saving mechanism (Issue: \#248)
-   Better error reporting to users and crash handling (Issue:
    \#255, 256)
-   Pretty printing of SQL queries (Issue: \#254)
-   Re-enabled the export function in the Query Interface panel (Issue:
    \#213, \#250)
-   Improved syntax-error messages in the mapping editor tooltip
-   Cleaned console messages
-   Added \"Number of sources\" indicator to show how many sources are
    already declared in the OBDA model.
-   Improved ESC and CONTROL+ENTER shortcuts in most dialogs in the GUI.
-   Replaced JDBC Driver text box with an editable Combo Box with
    default driver string.
-   Better OBDA statistics table (Issue: \#251)
-   Bug fix: CRITICAL stability issue that would rise an end-less cycle
    of warning messages when Quest crashed.
-   Bug fix: issue with final dot \".\" in mappings.

**-ontopQuest-**

-   Added support for data-type UUIDs for SQL Server (Issue: \#253)
-   Now we create forward-only and concur-read-only JDBC Statements by
    default to allow for server side cursors.
-   Bug fix: issue with SQL parser and table renamings in SQL queries
    (Issue: \#259)
-   Bug fix: issue with NULL pointer when primary key optimization in
    unfolding when there is a join on primary condition but atoms are
    not unifiable.

Known issues:

-   Oracle is unstable

## 1.7-alpha-rev-1479 (May 22, 2012)

Quest performance and features:

-   T-Mappings algorithm optimization: Combine disjunctive conditions in
    OR clauses instead of multiple mappings. This reduces the size of
    the final query and improves its performance. (Issue: \#237)

Mapping language features (Quest and ontopCore):

-   Support using IS NULL and IS NOT NULL in SQL query (Issue: \#200).
-   Support using UNION in SPARQL queries.

Bug Fixes:

-   Fix packing problem in Windows XP (Issue: \#228)
-   Fix packing problem in Linux
-   Fix unresponsive plugin when using mapping filter (Issue: \#217).
-   Fix unresponsive plugin when inserting a new mapping (Issue: \#232).
-   Fix support for MySQL in both virtual and classic mode (Issue:
    \#238).
-   Fix support for Oracle in virtual mode (Issue: \#226).
-   Fix issue where creating or modifying a mapping would not trigger a
    \"ontology out of synch\" flag.

Known Issue:

-   Oracle still has some issues in classic mode.

## 1.7-alpha-rev-1446 (May 4, 2012)

Mapping language features (Quest and ontopCore):

-   Add support on writing qualified name for atom predicates.
-   Add coloring for atoms typed Individual in the target query.

Bug Fixes:

-   Fix the \"Show Short URIs\" feature in the query panel.

## 1.7-alpha-rev-1440 (May 2, 2012)

Mapping language features (Quest and ontopCore):

-   Support writing URI constants in target queries (Issue: \#227)

General:

-   Better system logging for recording exceptions.

Bug Fixes:

-   Fix the null pointer exception due to the old OBDA preferences.
-   Fix bugs related to vocabulary prefixes.

## 1.7-alpha-rev-1427 (April 17, 2012)

Quest performance and features:

-   Implemented the T-Mappings mapping optimization algorithm improved
    performance of query rewriting in Virtual Mode. Now query rewriting
    is as fast in virtual ABox mode as in classic ABox mode (Issue:
    \#169)
-   Implemented a new query containment algorithm that is many times
    faster than before.
-   Added data source analysis to obtain DB metadata for SQL query
    generation.
-   Added analysis of SQL queries in the mappings to produce better SQL
    queries.
-   Added **SQL JOIN ELIMINATION** using PRIMARY KEY metadata.
-   Added mappings optimization using query containment w.r.t.
    constraints
-   Added initial support for **FILTER**
-   Added support for typed constants in SPARQL queries (Issue: \#157)
-   Small updates to internal API for speed of equality, hash and clone
    computation

Mapping language features (Quest and ontopCore):

-   New Turtle-like syntax for mappings allows for more succinct and
    easy to read mappings.
-   Added support for LANGUAGE tag for the Literal datatype (Issue:
    \#198)
-   Added support for datatypes in the OBDA mapping axioms (Issue:
    \#147, \#194, \#196)
-   Added URI templates for URI creation in mapping mapping axioms
    (Issue: \#151)
-   New feature for typing literals in mapping axioms (Issue: \#194,
    \#207)

General:

-   Added support for OWL API 3 (Issue: \#98)
-   Internal refactoring of all modules and packages for a cleaner API

ontopPro:

-   The plugin is now compatible with Protege 4.1 (Issue: \#99)
-   The plugin has a new and fresh GUI display.
-   Stronger integration with Protege\'s refactoring mechanism
-   The ABox materializer can import data complete with datatype
    information (Issue: \#195)
-   The target query use Turtle syntax for better display and management
    (Issue: \#204)
-   The plugin has Class/Property panel for better navigation and
    filtering.

Bug Fixes:

-   Fixed a problem with the encoding of axioms of the form
    subClassOf(Person, hasFather some Person)
-   Fixed issues with open and dead JDBC connections
-   Cleaned OWLReasoner synchronization issue
-   Fixed null pointer exceptions related to incorrect mappings
-   Proper error handling for translating an empty datalog program
    (Issue: \#197)
-   Fixed the \"Attach Prefixes\" feature in the OBDA Query panel
    (Issue: \#211)
-   Fixed issue regarding xsd:dateTime (Issue: \#199)

## 1.6.1 (October 19, 2011)

-   Fast patch in the query translation module.

## 1.6 (October 18, 2011)

-   Allow fast navigation using TAB key in the new mapping form (Issue:
    \#92)
-   Allow SQL query execution in the mapping tree (Issue: \#104)
-   Improvement in the error message deliveries (Issues: \#107, \#112,
    \#118)
-   Improvement in the data source management tab, including adding
    \"Test Connection\" button (Issues: \#108, \#111, \#114)
-   Add OBDA model statistics report (Issues: \#106, \#117)
-   Add support for adding integrated data source in Teiid (Issue: \#89)
-   Fix the unresponsive cancel button during importing OWL Individuals
    (Issue: \#88)
-   Fix CSV header in the exported query result (Issue: \#120)
-   Fix connection failure when users change the parameters (Issue:
    \#121)
-   Fix the password field so now the text is hidden (Issue: \#113)
-   Fix query selection in the OBDA query tab (Issue: \#91)
-   Fix import failure when storing very long record values (Issue:
    \#95)
-   Fix import failure when storing records that contain single quotes
    (Issue: \#96)

##  1.5.1-RC1 (July 15, 2011)

-   Significant code refactoring in the plugin. This effort makes the
    code easier to debug and to extend, and is almost ready for Protege
    4.1 and OWL-API 3.0 support.
-   Term renaming. Modified the term \'Mapping Head\' to \'Target
    Query\' and \'Mapping Body\' to \'Source Query\' to maintain the
    consistency with the literature.
-   Temporarly disabled the SPARQL query coloring.
-   Temporarly disabled the \'Load OWL Individuals into DB\'
    functionality.
-   Add improved search filters in the mapping manager (Issues: \#37,
    \#54).
-   Add \'show short URIs\' option in the query results to hide long URI
    strings.
-   Add \'select all\', \'select none\', \'expand all\' and \'collapse
    all\' buttons for easy browsing in the mapping tree (Issues: \#35,
    \#36).
-   Add mapping validation with respect to the vocabulary in the
    ontology (Issues: \#42).
-   Add input validation to many parts of the GUI (Issues: \#63, \#64,
    \#65, \#67, \#68, \#69, \#70, \#71, \#76).
-   Fix the save query functionality in the Query manager (Issues:
    \#57).
-   Fix the persistency of user preferences when opening/closing Protege
    (Issues: \#58).
-   Fix the exceptions that appeared when loading/saving/reloading
    ontologies (Issues: \#59, \#60, \#61, \#75).
-   Fix problems with several progress dialogs in the GUI (Issues: \#50,
    \#87).
-   Fix problems in the \'tuple count\' functionality (Issues: \#82,
    \#84).
