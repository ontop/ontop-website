# Ontop mapping language

While Ontop is compatible with the W3C standard mapping language [R2RML](https://www.w3.org/TR/2012/REC-r2rml-20120927/), it also provides its own native mapping language (**OBDA**).

An OBDA mapping file is a text file with extension `.obda` and it is made up of two main sections:

- `PrefixDeclaration`: a list of prefix definitions used in the mapping file. Each prefix is declared by a pair of its identifier (or name) and its IRI definition.
- `MappingDeclaration`: collection of **mapping axioms** where each mapping axiom consists of three fields: `mappingId`, `source` and `target`. The mappingId is any string identifying the axiom, the source is an arbitrary SQL query over the database, and the target is a [triple template](#target-triple-template) that contains placeholders that reference column names mentioned in the source query.

The following is an example of a valid OBDA mapping file:

```text
[PrefixDeclaration]
:		http://www.example.org/library#
xsd:	http://www.w3.org/2001/XMLSchema#
rdf:	http://www.w3.org/1999/02/22-rdf-syntax-ns#

[MappingDeclaration] @collection [[
mappingId     Book collection
target        :BID_{id} a :Book .
source        SELECT id FROM books

mappingId     Book title
target        :BID_{id} :title {title} .
source        SELECT id, title FROM books
]]
```

where the empty lines between the two sections and between the mappings are mandatory.

## Source Query

The `source` query in a mapping axiom is an SQL query over the underlying relational database and as such it uses the SQL syntax of that specific database dialect.
So things like quotes conventions may vary depending on the database system used. For example, in PostgreSQL double quotes are used for tables and column identifiers, while in MySQL backticks are used.

::: warning
The Ontop SQL parser only parses simple SQL queries without unions, aggregations, order by, etc.. Non parsed queries are treated as black-box views and sent directly to the database so the optimizations that Ontop can apply are limited.
:::

## Target triple template

Here we explain the syntax of IRI and literal templates used in the `target` of mapping axioms which is an adaptation of the [Turtle](http://www.w3.or/TR/turtle) syntax. The **target triple template** is written like an RDF subject-predicate-object (SPO) graph.

```
target  <http://www.example.org/library#BID_{id}> rdf:type :Book .
                       [S]                          [P]     [O]

target  <http://www.example.org/library#BID_{id}> :title {title} .
                       [S]                          [P]     [O]
```

Each triple must be separated by space followed by a period (`s p o .`) and it is composed of three nodes:

- **Subject node**. The subject node can be one of the following terms:

  1. IRI constant: e.g. `<http://www.example.org/library#BID_FF125>`
  2. [IRI template](#iri-template): e.g. `<http://www.example.org/library#BID_{id}>`

- **Predicate node**. The predicate node only accept IRI constants (e.g. `http://www.example.org/library#title>`).

- **Object node**. The object node can be one of the following terms:

  1. IRI constant: e.g. `<http://www.example.org/library#Book>`
  2. [IRI template](#iri-template): e.g. `<http://www.example.org/Author-{pid}>`
  3. Literal: either a plain literal (e.g. `"John"`, `123`), a typed literal (e.g. `"John"^^xsd:string`, `"123"^^xsd:int`) or a literal with language (e.g. `"Il Trono di Spade"@it`).
     <!-- Note that adding a language tag or a type are mutually exclusive. -->
  4. [Literal template](#literal-template): just like literals, literal templates can also be typed or have a language tag (e.g. `{id}^^xsd:integer`, `{id}`).

::: warning
Literals and literal templates can either be typed or have a language tag, but the two cannot be combined. For example the following mapping is invalid:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books where lang='ITALIAN'
target        :BID_{id} :title {title}^^xsd:string@it .
```

:::

### IRI Template

IRI templates are used in the target of mapping axioms for identification of generated objects. An IRI template is an arbitrary string with placeholders (e.g. `<http://www.example.org/library#BID_{id}>`). More than one placeholder can appear in a IRI template, which allows to construct complex IRI paths. For example:

```
mappingId     Spare parts
source        SELECT product, part, vendor FROM product
target        <http://example.org/{vendor}/{product}/{part}> a :Part .
```

#### Prefixes in IRI Templates

Prefixes can be used when writing a IRI template and are replaced by their definition when Ontop parses the mappings.

_Example_. Assume that the following prefixes are defined:

```
PREFIX   :	http://www.example.org/ontology1#
PREFIX   p:	http://www.example.org/ontology2#
```

Then this mapping axiom:

```
mappingId     Example
source        SELECT col1, col2 FROM table
target        <http://www.example.org/ontology1#{col1}> :property <http://www.example.org/ontology2#{col2}>
```

is equivalent to this mapping axiom:

```
mappingId     Example
source        SELECT col1, col2 FROM table
target        :{col1} :title p:{col2}
```

### Literal Template

The simplest literal template is merely a placeholder (e.g. `{name}`). Since in an RDF graph literals can be typed and have language tags, a literal template can also be typed and tagged.

#### Literal Typing

It is possible to create typed literals by specifying the type in the mapping. For example:

```
mappingId     Book titles
source        SELECT id, title, edition, comment FROM books
target        :BID_{id} :title {title}^^xsd:string; :edition {edition}^^xsd:int; :description {comment} .
```

The type used in the mapping has to agree with the type in the ontology (if specified).
If the type is not specified (for example, for the `description` property in the previous mapping), the system will look at the SQL type of the SQL column used in the mapping and will use the [**Natural Mapping of SQL values**](http://www.w3.org/TR/r2rml/#natural-mapping) as defined by [R2RML standard](http://www.w3.org/TR/r2rml/).

#### Language tags

Language for a literal can be specified directly using `@` symbol, for example:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books where lang='ITALIAN'
target        :BID_{id} :title {title}@it .
```

::: warning
Language tags can only be constants, it is not possible to obtain them dynamically from the database. So for example the following mapping is invalid:

```
mappingId     Book titles in Italian
source        SELECT id, title, lang FROM books
target        :BID_{id} :title {title}@{lang} .
```

:::

### Named Graphs

By default, triples generated by a triple pattern are added to the default graph. However, it is also possible to specify a named graph by using the keyword `GRAPH` followed by an IRI constant or template and then the triple pattern in curly braces. For example:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books where lang='ITALIAN'
target        GRAPH <http://www.example.org/graphs/italian> { :BID_{id} :title {title}@it . }
```

or, using a template for the graph name:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books where lang='ITALIAN'
target        GRAPH <http://www.example.org/graphs/{lang}> { :BID_{id} :title {title}@it . }
```

### Compact form

Following [Turtle](http://www.w3.org/TR/turtle/) syntax, Ontop native mapping format allows writing down an RDF graph in a compact textual form. A set of triples sharing the same subject can be written as a **predicate list**, where the pairs predicate-object are separated using semicolons, while a set of triples sharing the same subject and predicate can be written as an **object list**, where objects are separated using commas.

**Predicate list**: These two examples are equivalent ways of writing the triple template about Author.

```
:Author-{ID} a :Author .
:Author-{ID} :firstName {FNAME} .
:Author-{ID} :lastName {LNAME} .
:Author-{ID} :writes :Book-{ID} .
```

```
:Author-{ID} a :Author; :firstName {FNAME}; :lastName {LNAME}; :writes :Book-{ID} .
```

**Object list**: These two examples are equivalent ways of writing the triple template about _A Game of Thrones_ book.

```
:A_Game_of_Thrones :title "A Game of Thrones"@en-US .
:A_Game_of_Thrones :title "Il Trono di Spade"@it .
```

```
:A_Game_of_Thrones :title "A Game of Thrones"@en-US, "Il Trono di Spade"@it .
```

## Meta mappings

Meta Mappings are syntactically the same as normal mappings but they allow users to put variables in the target of mappings without restriction. This implies that class and property names can be constructed dynamically from the database.

_Example_. Consider the following mappings:

```
mappingId	mapping1
target	<{iri}> a :{value}_{code} .
source	SELECT value, iri, code FROM table1 where code > 0
```

```
mappingId	mapping2
target	<{iri}> :{role}_{code} {value} .
source	SELECT value, iri, code, role FROM table1 where code > 0
```

Suppose we also have a table named `table1` that the mappings are referring to:

| iri    | value | code | role |
| ------ | ----- | ---- | ---- |
| iri1   |  A    |  1   |  P   |
| iri2   |  B    |  2   |  P   |
| iri3   |  A    |  2   |  Q   |
| iri4   |  B    |  2   |  Q   |

Then `mapping1` will generate triples:

```
iri1 a :A_1 . iri2 a :B_2. iri3 a :A_2 . iri4 a :B_2 .
```

And `mapping2` will generate triples:

```
iri1 :P_1 A . iri2 :P_2 B . iri3 :Q_2 A . iri4 :Q_2 B .
```

<!--Still to add somewhere:
- RDFS and OWL vocabulary are not allowed in mappings, with the exception of rdf:type
- multischema
-->
