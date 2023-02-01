# Setting up an Ontop SPARQL endpoint with Ontop CLI

1. Download [Ontop CLI](https://github.com/ontop/ontop/releases) and unzip it to a directory, which is denoted as `$ONTOP_CLI_DIR` below.
2. Copy the H2 jdbc driver to `$ONTOP_CLI_DIR/jdbc` (if not done yet)
    * Mac/Linux: `cp jdbc/h2-1.4.196.jar $ONTOP_CLI_IDR/jdbc`
3. Start the h2 database.
4. Go to the `endpoint/` directory. Alternatively, if you don't have already the tutorial files, you can download [this OWL ontology file](input/university-complete.ttl), [this mapping file](input/university-complete.obda), [this properties file](input/university-complete.properties) and paste them in `input/`.
5. Start the Ontop endpoint. On Mac/Linux:

```console
$ONTOP_CLI_DIR/ontop endpoint \
    --ontology=input/university-complete.ttl \
    --mapping=input/university-complete.obda \
    --properties=input/university-complete.properties \
    --cors-allowed-origins=http://yasgui.org # if needed
```

On Windows:

```console
ontop endpoint ^
    --ontology=input/university-complete.ttl ^
    --mapping=input/university-complete.obda ^
    --properties=input/university-complete.properties ^
    --cors-allowed-origins=http://yasgui.org 
```

6. Open the web interface of the SPARQL endpoint to try some queries: 
   http://localhost:8080/
