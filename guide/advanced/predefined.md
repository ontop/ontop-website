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