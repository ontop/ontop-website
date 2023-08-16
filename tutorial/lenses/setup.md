# Database and Ontop Setup

In this tutorial, we run a [*DuckDB*](duckdb.org) database of museums that includes information about the museums themselves, their employees and their exhibits.

## Database setup

Procedure to set up the datebase for the following exercises:

1. Unzip the archive of DuckDB [*(duckdb.zip)*](../duckdb.zip).
2. That's it! The *data* directory contains the already prepared databases, compatible with *DuckDB version 0.7.1*.
     - If you want to have a first look at the database, you can open it with the DuckDB client application that can be downloaded from the [official site](https://duckdb.org/#quickinstall).

## Ontop SPARQL endpoint setup

For this tutorial, we use a SPARQL endpoint provided by ontop to test our mappings and lenses. Here, we walk through the preparation of the endpoint via *Ontop CLI*, but a docker-image-based endpoint can be created in a similar fashion, as explained in the [endpoint tutorial](../endpoint/endpoint-docker.md).

1. Download [Ontop CLI](https://github.com/ontop/ontop/releases) and unzip it to a directory, which is denoted as `$ONTOP_CLI_DIR` below.
2. Copy the DuckDB jdbc driver to `$ONTOP_CLI_DIR/jdbc` from the *duckdb.zip* archive.
3. Copy the directory `data` containing the database file `data/tutorial.db` into `$ONTOP_CLI_DIR`.
4. Paste your *mapping* and *lenses* files, as well as the *ontology* and *properties* files into a new directory called `input` inside of `$ONTOP_CLI`.
     - You will create the *mapping* and *lenses* files throughout the course of this tutorial. Alternatively, the *duckdb.zip* archive contains one directory for each of the lens tutorials, with sample mappings and lenses already pre-made.
     - The *ontology* and *properties* files will be the same throughout all tutorials. They are already provided in the *duckdb.zip* archive.
4. Start the Ontop endpoint. On Mac/Linux:

```bash
$ONTOP_CLI_DIR/ontop endpoint \
    --ontology=input/ontology.ttl \
    --mapping=input/mapping.obda \
    --lenses=input/lenses.json \
    --properties=input/duckdb.properties \
    --cors-allowed-origins=http://yasgui.org # if needed
```

On Windows:

```batch
ontop endpoint ^
    --ontology=input/ontology.ttl ^
    --mapping=input/mapping.obda ^
    --lenses=input/lenses.json ^
    --properties=input/duckdb.properties ^
    --cors-allowed-origins=http://yasgui.org 
```

6. Open the web interface of the SPARQL endpoint to try some queries: 
   [http://localhost:8080/](http://localhost:8080/)
