# Release notes

## 4.1.0 (upcoming)

#### Changed behavior
 - OBDA to R2RML mapping conversion requires by default access to DB metadata (through credentials or as a serialized file). This requirement can be bypassed with the argument `--force`.
 - By default, DESCRIBE queries only return the triples where the described IRI appears as subject. To also consider the triples where it appears as object, set the parameter `ontop.includeFixedObjectPositionInDescribe` to true.
 - The Docker endpoint image is now based on Debian ([#394](https://github.com/ontop/ontop/issues/394)), not on Alpine anymore.

#### New features

- Support for GeoSPARQL functions added ([#335](https://github.com/ontop/ontop/issues/335)).
- [Rich JSON-based query logging](/guide/advanced/logging) added.
- [New endpoint for predefined queries](/guide/advanced/predefined) added (beta). It enables the specification of custom low-latency Web APIs in a declarative manner.
- Support for the `IF`, `IRI`, `BNODE` SPARQL functions added.
- Supported for Dremio added.
- DB Metadata can now be loaded from files instead of connecting to the database.
- Bnode labels are now anonymized on-the-fly. Bnode templates can safely use PII.
- Sensitive JDBC information (user, password, url) can now be passed as arguments or environment variables (for Docker) instead of being written in the properties file. Docker secrets are also supported for further security.
- Basic support for Ontop views added (experimental). In particular, this allows to specify integrity constraints on views defined at the Ontop-level.
- New left join optimization techniques added. General functional dependencies are now taken into account. Sensitivity to left-join ordering minimized.
- [HTTP caching](/guide/advanced/caching) headers can now be returned by the Ontop SPARQL endpoint.
- Native Protégé bundles for each platform (win, macOS, linux) with JRE 8 embbed

#### Removal
 - As announced before, the RDF4J Workbench-based bundles are not shipped anymore. However, the webapps war file can still be built with Maven.

#### Refactoring

- Drastic reduction of memory consumption when processing SPARQL queries ([#370](https://github.com/ontop/ontop/pull/370)). Significative when materializing large RDF graphs.
- Better file resource handling ([#368](https://github.com/ontop/ontop/pull/368)).
- Distinct lifting improved.
- Self-join elimination based on functional dependencies re-implemented.
- Decomposition of heterogeneous IRI templates enabled.
- Lexical value space is now considered when decomposing IRIs. 
- Protégé plugin codebase cleaned.
- RDF4J external binding management refactored.
- Bnode handling refactored.
- Java 11 support.
- Better handling of column names when converting OBDA mappings into R2RML. It now uses DB metadata.
- Parser for OBDA mappings refactored.
- CONSTRUCT and DESCRIBE query handling refactored.
- Character encoding in R2RML templates refactored.
- Default file encoding set to UTF-8. Particularly useful on Windows. Can be overridden if needed.
- Build script refactored. Now fully based on Maven ([#393](https://github.com/ontop/ontop/pull/393)) *(to be merged)*.
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
