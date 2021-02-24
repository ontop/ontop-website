# Predefined query endpoint *(beta)*
*Since 4.1.0.*

The predefined query endpoint enables the specification of custom low-latency Web APIs in a declarative manner.
It relies on two main components:
 1. A JSON-based configuration file, describing the API interface, its parameters and optionally [a JSON-LD frame](https://w3c.github.io/json-ld-framing/) for shaping the returned data.
 2. A SPARQL query in charge of retrieving and perhaps transforming the data. The values of the API parameters are plugged as constants into the SPARQL query.

 ::: warning
At the moment only CONSTRUCT queries are supported.
:::

This endpoint brings one important benefit in terms of performance with respect to the SPARQL endpoint: it is able to reuse reformulations from similar queries. This is particularly valuable for "lookup" requests involving many optional triples, and for which latency is critical.

## Syntax

```http
GET /predefined/{queryId}?{param1}={value1}&{param2}={value2}&{param3}={value3}
```


## Example

### Configuration
```json
{
    "queries": {
        "lodging": {
            "queryType": "graph",
            "name": "Lodging businesses",
            "description": "JSON-LD snippets for lodging businesses, based on schema.org.",
            "return404IfEmpty": true,
            "resultStreaming": false,
            "parameters": {
                "id": {
                    "description": "Internal identifier of the lodging business",
                    "type": "xsd:string",
                    "safeForRandomGeneration": true,
                    "required": true
                },
                "language": {
                    "description": "Language (e.g. it, de, en, ru). Default: en",
                    "type": "xsd:string",
                    "safeForRandomGeneration": false,
                    "required": false
                }
            },
            "frame": {
                "@context": "https://schema.org",
                "@type": [
                  "LodgingBusiness"
                ]
            }
        }
    }
}
```

### Predefined queries

```toml
[lodging]
query="""
BASE <http://noi.example.org/data/accommodation/>
PREFIX schema: <http://schema.org/>
PREFIX : <http://noi.example.org/ontology/odh#>
 CONSTRUCT {
   ?h a schema:LodgingBusiness ; schema:name ?nameStr ; schema:priceRange ?priceRange .
 }
 WHERE {
  # Convert incoming parameters
  BIND (IRI(?id) AS ?h)
  BIND (COALESCE(?language, "en") AS ?l)

  ?h a schema:LodgingBusiness .

  OPTIONAL { 
    ?h schema:name ?name .
    BIND(str(?name) AS ?nameStr)
    FILTER(lang(?name) = ?l)
  }
  OPTIONAL {
    ?h schema:priceRange ?priceRange .
  }
}
"""
```

### Cache for the JSON-LD contexts

Optionally, JSON-LD context documents can be stored in a cache and adapted if needed.
When they are not cached, these documents are directly fetched from the Web.

```json
{
  "https://schema.org": {
    "@context": {
      "@vocab": "http://schema.org/"
    }
  }
}
```

### Request

```sh
curl http://localhost:8080/predefined/lodging?id=32E7BE648E7B11D181AB006097B896BA&language=de
```
Results: 
```json
{
  "@context": "https://schema.org",
  "@id": "http://noi.example.org/data/accommodation/32E7BE648E7B11D181AB006097B896BA",
  "@type": "LodgingBusiness",
  "name": "Alpenblick - Gasthaus"
}
```

## Entries

### Top-level key
| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `queries`          | Map of predefined queries | Groups predefined queries by id. |

### Query keys

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `queryType`        | String    | At the moment, only `graph` is supported. Corresponds to CONSTRUCT queries. |
| `name`             | String    | Name of the predefined query. |
| `description`      | String    | Description of the predefined query. |
| `return404IfEmpty` | Boolean   | If true, returns a 404 status code when the result set is empty. |
| `resultStreaming`  | Boolean   | If true, uses the chunked transfer encoding. |
| `parameters`       | Map of parameters | Groups parameters by id. |
| `frame`            | JSON object | [JSON-LD frame](https://w3c.github.io/json-ld-framing/)) for shaping the result set when the JSON-LD format is selected. |


### Parameter keys

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `description`      | String    | Description of the parameter.                   |
| `type`             | String    | Type of the parameter. Can be `iri` for an IRI, any XSD datatype like `xsd:string` with the prefix `xsd:` or the IRI string of an RDF datatype. |
| `safeForRandomGeneration` | Boolean | If true, replacing the parameter value by a random value for generating a "reference" reformulated query can be considered as safe. Replacing afterwards the random value but the real parameter value in the reference reformulated query should produce the expected result. Usually, identifiers are safe while languages are not because the columns to consider differ from a language to another.  |
| `required`         | Boolean | If true, a value must be given for this parameter in the HTTP request. |