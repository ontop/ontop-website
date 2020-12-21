# Interact with an Ontop SPARQL Endpoint

An Ontop Endpoint is accessible by the standard [SPARQL HTTP protocol](https://www.w3.org/TR/sparql11-protocol/)

### URL of the Ontop SPARQL Endpoint

When the endpoint is created by the Ontop CLI or Docker, the URL looks like
`http://localhost:8080/sparql`.

### Sending HTTP Requests

You can use POST or GET requests carrying the SPARQL query to evaluate (as per SPARQL HTTP protocol).

For example, with POST:

```http
POST http://localhost:8080/sparql
Content-Type: application/sparql-query
Accept: application/json

PREFIX : <http://example.org/voc#>
SELECT DISTINCT ?teacher {
  ?teacher a :Teacher .
}
```

### Using cURL from the command line

The above request can be sent with the `cURL` command:

```console
curl --request POST \
     --url http://localhost:8080/sparql \
     --header 'accept: application/json' \
     --header 'content-type: application/sparql-query' \
     --data 'PREFIX : <http://example.org/voc#> SELECT DISTINCT ?teacher {?teacher a :Teacher .}'
```

### Using a SPARQL client library

Alternatively, you may use one of the many [SPARQL clients](https://www.w3.org/wiki/SparqlImplementations) available for many programming and data analysis environments, as we demonstrate next [using the `SPARQLWrapper` library within a Python Jupyter Notebook](tutorial/interact/jupyter).
