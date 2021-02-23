# Query logging

*Since 4.1.0.*

Query logging, disabled by default, prints one-line JSON objects into the standard output.

Its JSON format follows some ElasticSearch conventions and works nicely with the corresponding stack (FileBeat, ES, Kibana).

## Example
```json
{
  "@timestamp": "2021-02-23T14:02:05.973Z",
  "message": "query:all",
  "application": "ontop-odh",
  "payload": {
    "queryId": "36ade6c6-f091-4af2-9828-ee6316e191f4",
    "classesUsedInQuery": [
      "http://schema.org/Hotel"
    ],
    "propertiesUsedInQuery": [
      "http://schema.org/name"
    ],
    "tables": [
      "\"v_accommodationsopen\""
    ],
    "reformulationDuration": 50,
    "reformulationCacheHit": false,
    "httpHeaders": {
      "referer": "http://localhost:8080/"
    },
    "sparqlQuery": "PREFIX schema: <http://schema.org/>\nSELECT * WHERE {\n  ?h a schema:Hotel ; schema:name ?name .\n  FILTER (langMatches(lang(?name), 'en'))\n} \nLIMIT 10",
    "reformulatedQuery": "ans1(h,name)\nCONSTRUCT [h, name] [name/RDF(VARCHARToTEXT(AccoDetail-en-Name1m51),@en), h/RDF(http://noi.example.org/data/accommodation/{}(VARCHARToTEXT(Id1m148)),IRI)]\n   NATIVE [AccoDetail-en-Name1m51, Id1m148]\nSELECT v1.\"AccoDetail-en-Name\" AS \"AccoDetail-en-Name1m51\", v1.\"Id\" AS \"Id1m148\"\nFROM \"v_accommodationsopen\" v1\nWHERE (v1.\"AccoDetail-en-Name\" IS NOT NULL AND 'HotelPension' = v1.\"AccoTypeId\")\nLIMIT 10\n",
    "executionBeforeUnblockingDuration": 8,
    "executionAndFetchingDuration": 30,
    "totalDuration": 80,
    "resultCount": 10
  }
}
```


## Entries

| Key                | Type  | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `@timestamp`       | Timestamp |                                                 |
| `message`          | String    | Type of the message. It always start with the prefix `query:`. Its default value is `query:all`. In case of an exception, the value starts with `query:exception-`.    |
| `application`      | String    | Controlled by the property `ontop.applicationName`. |
| `payload`  | JSON object      | Gathers the entries below.                 |
| `queryId`  | UUID      | Unique to each query.                 |
| `classesUsedInQuery` | Array of IRIs | IRIs of the classes appearing in the SPARQL query. |
| `propertiesUsedInQuery` | Array of IRIs | IRIs of the properties appearing in the SPARQL query. |
| `tables` | Array of Strings | Names of the relations appearing in the SQL query. |
| `reformulationDuration` | Integer | Query reformulation duration (in ms). |
| `reformulationCacheHit` | Boolean | True if the reformulated query cache has been used |
| `httpHeaders` | JSON object | Values of a specific list of HTTP headers. By default, this list is empty. To track for instance the referer, set the property `ontop.queryLogging.includeHttpHeader.referer` to true. |
| `sparqlQuery` | String | SPARQL query. |
| `reformulatedQuery` | String | Includes the SQL query and the post-processing. |
| `executionBefore` `UnblockingDuration` | Integer | Duration between the moments where the SQL query is sent and the result set is unblocked (in ms). |
| `executionAndFetching` `Duration` | Integer | Duration between the moments where the SQL query is sent and the last result is fetched (in ms). |
| `totalDuration` | Integer | Total duration (in ms). |
| `resultCount` | Integer | Number of results returned. |



## Default settings

```properties
# Query logging is disabled by default
ontop.queryLogging=false

# Application name (needed for logging)
ontop.applicationName=Ontop

# Includes the SPARQL query string into the query log
ontop.queryLogging.includeSparqlQuery=true
# Includes the reformulated query into the query log
ontop.queryLogging.includeReformulatedQuery=false
# Includes classes and properties into the query log
ontop.queryLogging.includeClassesAndProperties=true
# Includes DB tables/views into the query log
ontop.queryLogging.includeTables=true
# Provides separated message at different phases (after reformulation, result set unblocked, last result fetched)
ontop.queryLogging.decomposition=false
# Sets that merged messages are only inserted when decomposition is disabled
ontop.queryLogging.decompositionAndMergingMutuallyExclusive=true
```