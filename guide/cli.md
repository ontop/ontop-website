# Command Line Interface


Ontop ships a shell script (`ontop` for *nix)  and a bat file (`ontop.bat` for Windows) exposing the core functionality and several utilities through the command line interface. It is an easy way to get the system quickly set-up, test for correct execution, and query or materialize as needed. 

* [Setup](#setup-ontop-cli)
* [ontop endpoint](#ontop-endpoint)
* [ontop materialize](#ontop-materialize)
* [ontop mapping](#ontop-mapping)
* [ontop bootstrap](#ontop-bootstrap)
* [ontop query](#ontop-query)
* [ontop extract-db-metadata](#ontop-extract-db-metadata)

## Setup Ontop CLI

First, you have to download Ontop latest CLI zip from our download pages ([Github](https://github.com/ontop/ontop/releases) or [Sourceforge](https://sourceforge.net/projects/ontop4obda/files/)).
Unzip it in a folder. Open the command line terminal and cd to that folder.
For Windows use the `ontop.bat` file, for Linux and OS X use the `ontop` file.

```
$ ./ontop help
usage: ontop <command> [ <args> ]

Commands are:
    --version             Show version of ontop
    bootstrap             Bootstrap ontology and mapping from the database
    endpoint              Start a SPARQL endpoint powered by Ontop
    extract-db-metadata   Extract the DB metadata and serialize it into an output JSON file
    help                  Display help information
    materialize           Materialize the RDF graph exposed by the mapping and the OWL ontology
    query                 Query the RDF graph exposed by the mapping and the OWL ontology
    validate              Validate Ontology and Mappings
    mapping               Manipulate mapping files
```

### JDBC configuration

JDBC drivers are software implemented by third parties (often the same developers of the database system) that handle interaction with the database in their own proprietary protocols.
You will need to manually download the JDBC drivers for your database management system (e.g., [PostgreSQL JDBC drivers](https://jdbc.postgresql.org/)) and put them into the `jdbc` directory.

### PATH

Consider putting the directory of ontop to your `PATH`.

### Property file
Most commands below require or accept as input a property file.
This is where you will specify the JDBC connection parameters.
A basic property file template can be found [here](/properties/basic.properties).

## `ontop endpoint`
`ontop endpoint` deploys a SPARQL endpoint locally at the address `/sparql` and by default on the port 8080. It powers [our official Docker](https://hub.docker.com/r/ontop/ontop-endpoint), so feel free to use the Docker image instead of the CLI command if it is more convenient for you.

It offers several advanced options:
 * *Lazy initialization:* Ontop offline tasks (such as DB metadata extraction and mapping processing) are triggered after receiving the first SPARQL query. This is useful when using a Docker-Compose with Ontop and a DB image that needs to be initialized first.
 * *Development mode (since 4.0-beta-1):* restarts the endpoint every time the configuration files are changed. It also exposes a GET/POST method `/ontop/reformulate` accepting a SPARQL query as param as any SPARQL endpoint but returning the reformulated SQL query as result.
 * *Portal (since 4.0-beta-1):* Includes groups of pre-defined SPARQL queries into the welcome page. See the following [example of portal file](/examples/example-portal.toml) in the TOML format.
 * *[Predefined query endpoint](/guide/advanced/predefined) (since 4.1.0)*
 * *Ontology made downloadable (since 4.2.0)*.

```
$ ./ontop help endpoint
NAME
        ontop endpoint - Start a SPARQL endpoint powered by Ontop

SYNOPSIS
        ontop endpoint [ {-c | --constraint} <constraint file> ]
                [ --contexts <JSON-LD context file for predefined queries> ]
                [ --cors-allowed-origins <origins> ]
                [ {-d | --db-metadata} <db-metadata file> ]
                [ --db-driver <DB driver> ]
                [ --db-password <DB password> ] [ --db-url <DB URL> ] [ --dev ]
                [ --disable-portal-page ]
                [ --enable-annotations ] [ --enable-download-ontology ]
                [ --lazy ] {-m | --mapping} <mapping file>
                [ {-o | --output} <output> ]
                [ {-p | --properties} <properties file> ] [ --port <port> ]
                [ --portal <endpoint portal file> ]
                [ --predefined-config <predefined query JSON config file> ]
                [ --predefined-queries <predefined query TOML file> ]
                [ {-t | --ontology} <ontology file> ]
                [ {-u | --db-user} <DB user> ]
                [ {-v | --ontop-views} <Ontop view file> ]
                [ {-x | --xml-catalog} <xml catalog file> ]

OPTIONS
        -c <constraint file>, --constraint <constraint file>
            user supplied DB constraint file

        --contexts <JSON-LD context file for predefined queries>
            File containing JSON-LD contexts for predefined queries

        --cors-allowed-origins <origins>
            CORS allowed origins

        -d <db-metadata file>, --db-metadata <db-metadata file>
            User-supplied db-metadata file

        --db-driver <DB driver>
            DB driver (overrides the properties)

        --db-password <DB password>
            DB password (overrides the properties)

        --db-url <DB URL>
            DB URL (overrides the properties)

        --dev
            development mode

        --disable-portal-page
            Disable the portal page (/index.html) of the SPARQL endpoint.

        --disable-reasoning
            disable OWL reasoning. Default: false

        --enable-annotations
            enable annotation properties defined in the ontology. Default:
            false

        --enable-download-ontology
            Allow to download the ontology as a plain text file (/ontology).
            Default: false

        --lazy
            lazy initialization

        -m <mapping file>, --mapping <mapping file>
            Mapping file in R2RML (.ttl) or in Ontop native format (.obda)

        -o <output>, --output <output>
            output file (default)

        -p <properties file>, --properties <properties file>
            Properties file

        --port <port>
            port of the SPARQL endpoint

        --portal <endpoint portal file>
            endpoint portal file (including title and queries)

        --predefined-config <predefined query JSON config file>
            predefined query config file

            This option is required if any of the following options are
            specified: --predefined-queries


        --predefined-queries <predefined query TOML file>
            predefined SPARQL queries file

            This option is required if any of the following options are
            specified: --predefined-config


        -t <ontology file>, --ontology <ontology file>
            OWL ontology file

        -u <DB user>, --db-user <DB user>
            DB user (overrides the properties)

        -v <Ontop view file>, --ontop-views <Ontop view file>
            User-supplied view file

        -x <xml catalog file>, --xml-catalog <xml catalog file>
            XML Catalog file (e.g. catalog-v001.xml generated by Protege) for
            redirecting ontologies imported by owl:imports
```

### Example

```
$ ./ontop endpoint -m university-complete.obda \
                   -t university-complete.ttl \
                   -p university-complete.properties \
                   --cors-allowed-origins=*
```

## `ontop materialize`

This command provides a "materialization utility". Materialization is helpful when you want to generate RDF data out of your database, using the provided mappings. This utility will take all the triples that the mapping can produce from the data source, and write them to the output. `ontop materialize` does not need any query file, but instead, needs the user to specify a format in which he/she wants the output (either to terminal or output file). The user can choose between three output formats: [Turtle](https://www.w3.org/TR/2014/REC-turtle-20140225/), [N-triples](https://www.w3.org/TR/2014/REC-n-triples-20140225/) or [RDF/XML](https://www.w3.org/TR/2014/REC-rdf-syntax-grammar-20140225/). For very large datasets, producing the output might take some time. 

```
$ ./ontop help materialize
NAME
        ontop materialize - Materialize the RDF graph exposed by the mapping
        and the OWL ontology

SYNOPSIS
        ontop materialize [ {-c | --constraint} <constraint file> ]
                [ {-d | --db-metadata} <db-metadata file> ]
                [ --db-driver <DB driver> ]
                [ --db-password <DB password> ] [ --db-url <DB URL> ]
                [ --disable-reasoning ] [ --enable-annotations ]
                [ {-f | --format} <outputFormat> ]
                {-m | --mapping} <mapping file> [ --no-streaming ]
                [ {-o | --output} <output> ]
                [ {-p | --properties} <properties file> ] [ --separate-files ]
                [ {-t | --ontology} <ontology file> ]
                [ {-u | --db-user} <DB user> ]
                [ {-v | --ontop-views} <Ontop view file> ]
                [ {-x | --xml-catalog} <xml catalog file> ]

OPTIONS
        -c <constraint file>, --constraint <constraint file>
            user supplied DB constraint file

        -d <db-metadata file>, --db-metadata <db-metadata file>
            User-supplied db-metadata file

        --db-driver <DB driver>
            DB driver (overrides the properties)

        --db-password <DB password>
            DB password (overrides the properties)

        --db-url <DB URL>
            DB URL (overrides the properties)

        --disable-reasoning
            disable OWL reasoning. Default: false

        --enable-annotations
            enable annotation properties defined in the ontology. Default:
            false

        -f <outputFormat>, --format <outputFormat>
            The format of the materialized ontology. Default: rdfxml

            This options value is restricted to the following set of values:
                rdfxml
                turtle
                ntriples
                nquads
                trig
                jsonld

        -m <mapping file>, --mapping <mapping file>
            Mapping file in R2RML (.ttl) or in Ontop native format (.obda)

        --no-streaming
            All the SQL results of one big query will be stored in memory. Not
            recommended. Default: false.

        -o <output>, --output <output>
            output file (default) or prefix (only for --separate-files)

        -p <properties file>, --properties <properties file>
            Properties file

        --separate-files
            generating separate files for different classes/properties. This is
            useful for materializing large OBDA setting. Default: false.

        -t <ontology file>, --ontology <ontology file>
            OWL ontology file

        -u <DB user>, --db-user <DB user>
            DB user (overrides the properties)

        -v <Ontop view file>, --ontop-views <Ontop view file>
            User-supplied view file

        -x <xml catalog file>, --xml-catalog <xml catalog file>
            XML Catalog file (e.g. catalog-v001.xml generated by Protege) for
            redirecting ontologies imported by owl:imports
```

Example:

```
$ ./ontop materialize -m university-complete.obda \
                      -t university-complete.ttl \
                      -p university-complete.properties \
                      -f turtle \
                      -o materialized-triples.ttl
```

## `ontop mapping`

This command collects several useful sub-commands for dealing with mappings files.

```
$ ./ontop help mapping
NAME
        ontop mapping - Manipulate mapping files

SYNOPSIS
        ontop mapping { pretty-r2rml | to-obda | to-r2rml | v1-to-v3 } [--]
                [cmd-options]

        Where command-specific options [cmd-options] are:
            pretty-r2rml: {-i | --input} <input.ttl> {-o | --output}
                    <pretty.ttl>
            to-obda: {-i | --input} <mapping.ttl> [ {-o | --output} <mapping.obda> ]
            to-r2rml: [ {-v | --ontop-views} <Ontop view file> ] [ {-t | --ontology} <ontology.owl> ]
                    {-i | --input} <mapping.obda> [ {-o | --output} <mapping.ttl> ]
                    [ {-p | --properties} <properties file> ] [ {-d | --db-metadata} <db-metadata file> ]
                    [ --force ]
            v1-to-v3: [ --simplify-projection ] {-m | --mapping} <mapping file>
                    [ --overwrite ] [ {-o | --output} <mapping.obda> ]

        See 'ontop help mapping <command>' for more information on a specific command.
```

###  `ontop mapping to-r2rml`

Supports automatically converting mappings from Ontop native format (`.obda`) to the [R2RML](http://www.w3.org/TR/2012/REC-r2rml-20120927/) standard format. Since 4.1.0, by default, it expects DB credentials (for extracting the DB metadata) or a DB metadata file. This requirement can be bypassed using the option `--force`.
```
$ ./ontop help mapping to-r2rml
NAME
        ontop mapping to-r2rml - Convert ontop native mapping format (.obda) to
        R2RML format

SYNOPSIS
        ontop mapping to-r2rml [ {-d | --db-metadata} <db-metadata file> ]
                [ --force ] {-i | --input} <mapping.obda>
                [ {-o | --output} <mapping.ttl> ]
                [ {-p | --properties} <properties file> ]
                [ {-t | --ontology} <ontology.owl> ]
                [ {-v | --ontop-views} <Ontop view file> ]

OPTIONS
        -d <db-metadata file>, --db-metadata <db-metadata file>
            User-supplied db-metadata file

        --force
            Force the conversion in the absence of DB metadata

        -i <mapping.obda>, --input <mapping.obda>
            Input mapping file in Ontop native format (.obda)

        -o <mapping.ttl>, --output <mapping.ttl>
            Output mapping file in R2RML format (.ttl)

        -p <properties file>, --properties <properties file>
            Properties file

        -t <ontology.owl>, --ontology <ontology.owl>
            OWL ontology file

        -v <Ontop view file>, --ontop-views <Ontop view file>
            User-supplied view file
```
### `ontop mapping to-obda`
Supports automatically converting mappings from [R2RML](http://www.w3.org/TR/2012/REC-r2rml-20120927/) standard format to Ontop native format (`.obda`):

```
$ ./ontop help mapping to-obda
NAME
        ontop mapping to-obda - Convert R2RML format to ontop native mapping
        format (.obda)

SYNOPSIS
        ontop mapping to-obda {-i | --input} <mapping.ttl>
                [ {-o | --output} <mapping.obda> ]

OPTIONS
        -i <mapping.ttl>, --input <mapping.ttl>
            Input mapping file in R2RML format (.ttl)

        -o <mapping.obda>, --output <mapping.obda>
            Output mapping file in Ontop native format (.obda)
```

###  `ontop mapping pretty-r2rml`
Provides automatic formatting and prettifying facilities for mappings files:

```
$ ./ontop help mapping pretty-r2rml
NAME
        ontop mapping pretty-r2rml - prettify R2RML file using Jena

SYNOPSIS
        ontop mapping pretty-r2rml {-i | --input} <input.ttl>
                {-o | --output} <pretty.ttl>

OPTIONS
        -i <input.ttl>, --input <input.ttl>
            Input mapping file in the turtle R2RML format (.ttl)

        -o <pretty.ttl>, --output <pretty.ttl>
            Output mapping file in the turtle R2RML format (.ttl)
```

## `ontop bootstrap`
This command allows the automatic generation of mappings and ontology starting from a database schema. The generated output can be used as-is or further customized manually (e.g., to used different ontological modeling choices and corresponding mappings). In both cases, it helps substantially reducing the user effort involved in setting up the ontology and mappings of a VKG specification.

```
$ ./ontop help bootstrap
NAME
        ontop bootstrap - Bootstrap ontology and mapping from the database

SYNOPSIS
        ontop bootstrap {-b | --base-iri} <base IRI>
                [ --db-driver <DB driver> ]
                [ --db-password <DB password> ] [ --db-url <DB URL> ]
                {-m | --mapping} <mapping file>
                [ {-p | --properties} <properties file> ]
                {-t | --ontology} <ontology file>
                [ {-u | --db-user} <DB user> ]

OPTIONS
        -b <base IRI>, --base-iri <base IRI>
            Base IRI of the generated mapping

        --db-driver <DB driver>
            DB driver (overrides the properties)

        --db-password <DB password>
            DB password (overrides the properties)

        --db-url <DB URL>
            DB URL (overrides the properties)

        -m <mapping file>, --mapping <mapping file>
            Output mapping file in the Ontop native format (.obda)

        -p <properties file>, --properties <properties file>
            Properties file

        -t <ontology file>, --ontology <ontology file>
            Output OWL ontology file

        -u <DB user>, --db-user <DB user>
            DB user (overrides the properties)
```

## `ontop query`

The `ontop query` command is designed for helping users to test their system quickly using the command line utilities. 
You can use this command if you already have a scenario test case including:
* the ontology (RDFS or OWL) and the mappings (obda or R2RML) files,
* a working database to connect to,
* a SPARQL query file

The `ontop query` command helps you to set up the system, runs the query from the query string file over it, and gets the results either in output file or terminal output. What the script actually does is to set up Ontop using the ontology and the mapping files, parse the query from the file and execute it over the created instance of Ontop.

Note that `ontop query` is NOT intended to be used in production and for benchmarking purposes. Most of its execution time is dedicated to offline tasks like DB metadata extraction and mapping processing. Query answering (i.e. answering the SPARQL query) takes usually much less time. For production and benchmarking purposes, please consider [deploying Ontop as a SPARQL endpoint](#ontop-endpoint).

The results are turned in the CSV format.

 ::: warning
At the moment only SELECT queries are supported by this command. See [#222](https://github.com/ontop/ontop/issues/222).
:::

```
$ ./ontop help query
NAME
        ontop query - Query the RDF graph exposed by the mapping and the OWL
        ontology

SYNOPSIS
        ontop query [ {-c | --constraint} <constraint file> ]
                [ {-d | --db-metadata} <db-metadata file> ]
                [ --db-driver <DB driver> ]
                [ --db-password <DB password> ] [ --db-url <DB URL> ]
                [ --disable-reasoning ] [ --enable-annotations ]
                {-m | --mapping} <mapping file> [ {-o | --output} <output> ]
                [ {-p | --properties} <properties file> ]
                {-q | --query} <queryFile>
                [ {-t | --ontology} <ontology file> ]
                [ {-u | --db-user} <DB user> ]
                [ {-v | --ontop-views} <Ontop view file> ]
                [ {-x | --xml-catalog} <xml catalog file> ]

OPTIONS
        -c <constraint file>, --constraint <constraint file>
            user supplied DB constraint file

        -d <db-metadata file>, --db-metadata <db-metadata file>
            User-supplied db-metadata file

        --db-driver <DB driver>
            DB driver (overrides the properties)

        --db-password <DB password>
            DB password (overrides the properties)

        --db-url <DB URL>
            DB URL (overrides the properties)

        --disable-reasoning
            disable OWL reasoning. Default: false

        --enable-annotations
            enable annotation properties defined in the ontology. Default:
            false

        -m <mapping file>, --mapping <mapping file>
            Mapping file in R2RML (.ttl) or in Ontop native format (.obda)

        -o <output>, --output <output>
            output file (default)

        -p <properties file>, --properties <properties file>
            Properties file

        -q <queryFile>, --query <queryFile>
            SPARQL SELECT query file

        -t <ontology file>, --ontology <ontology file>
            OWL ontology file

        -u <DB user>, --db-user <DB user>
            DB user (overrides the properties)

        -v <Ontop view file>, --ontop-views <Ontop view file>
            User-supplied view file

        -x <xml catalog file>, --xml-catalog <xml catalog file>
            XML Catalog file (e.g. catalog-v001.xml generated by Protege) for
            redirecting ontologies imported by owl:imports
```

### Example 1

Execute a SPARQL query using Ontop mappings.

```
$  ./ontop query -m university-complete.obda \
                 -t university-complete.owl \
                 -p university-complete.properties \
                 -q q1.txt

x
http://www.Department0.University0.edu/GraduateStudent44
http://www.Department0.University0.edu/GraduateStudent101
http://www.Department0.University0.edu/GraduateStudent124
http://www.Department0.University0.edu/GraduateStudent142
```
where `q1.txt` contains the SPARQL query, e.g.:
```sparql
PREFIX : <http://example.org/voc#>
SELECT ?x { ?x a :GraduateStudent . }
```

### Example 2

Execute a SPARQL query using R2RML mappings and output the query result to a file.
```
$ ./ontop query -m university-complete.ttl \
                -t university-complete.owl \
                -p university-complete.properties \
                -q q1.txt \
                -o q1.csv

$ cat q1.csv
x
http://www.Department0.University0.edu/GraduateStudent44
http://www.Department0.University0.edu/GraduateStudent101
http://www.Department0.University0.edu/GraduateStudent124
http://www.Department0.University0.edu/GraduateStudent142
```

## `ontop extract-db-metadata`
*Stable since 4.1.0*.

This command extracts the metadata from the database and serializes it into a JSON file.
This file can later on be passed as an argument to many other commands.

```
$ ./ontop help extract-db-metadata
NAME
        ontop extract-db-metadata - Extract the DB metadata and serialize it
        into an output JSON file

SYNOPSIS
        ontop extract-db-metadata [ {-o | --output} <output> ]
                {-p | --properties} <properties file>

OPTIONS
        -o <output>, --output <output>
            output file

        -p <properties file>, --properties <properties file>
            Properties file
```

### Example

```sh
$ ./ontop extract-db-metadata -p mobility.properties -o db-metadata.json
```

```json
{
  "relations" : [ {
    "uniqueConstraints" : [ {
      "name" : "metadata_pkey",
      "determinants" : [ "\"id\"" ],
      "isPrimaryKey" : true
    } ],
    "foreignKeys" : [ {
      "name" : "fk_metadata_station_id_station_pk",
      "from" : {
        "relation" : [ "\"mobility\"", "\"metadata\"" ],
        "columns" : [ "\"station_id\"" ]
      },
      "to" : {
        "relation" : [ "\"mobility\"", "\"station\"" ],
        "columns" : [ "\"id\"" ]
      }
    } ],
    "columns" : [ {
      "name" : "\"id\"",
      "isNullable" : false,
      "datatype" : "bigserial"
    }, {
      "name" : "\"created_on\"",
      "isNullable" : true,
      "datatype" : "timestamp"
    }, {
      "name" : "\"json\"",
      "isNullable" : true,
      "datatype" : "jsonb"
    }, {
      "name" : "\"station_id\"",
      "isNullable" : true,
      "datatype" : "int8"
    } ],
    "name" : [ "\"mobility\"", "\"metadata\"" ]
  },
  {
    "uniqueConstraints" : [ {
      "name" : "station_pkey",
      "determinants" : [ "\"id\"" ],
      "isPrimaryKey" : true
    }, {
      "name" : "uc_station_stationcode_stationtype",
      "determinants" : [ "\"stationcode\"", "\"stationtype\"" ],
      "isPrimaryKey" : false
    } ],
    "columns" : [ {
      "name" : "\"id\"",
      "isNullable" : false,
      "datatype" : "bigserial"
    }, {
      "name" : "\"name\"",
      "isNullable" : false,
      "datatype" : "varchar(255)"
    }, {
      "name" : "\"stationtype\"",
      "isNullable" : false,
      "datatype" : "varchar(255)"
    } ],
    "name" : [ "\"mobility\"", "\"station\"" ]
  } ],
  "metadata" : {
    "dbmsProductName" : "PostgreSQL",
    "dbmsVersion" : "13.1",
    "driverName" : "PostgreSQL JDBC Driver",
    "driverVersion" : "42.2.8",
    "quotationString" : "\"",
    "extractionTime" : "2021-02-25T15:56:09",
    "idFactoryType" : "POSTGRESQL"
  }
}
```
