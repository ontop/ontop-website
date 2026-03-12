# Ontop Mapping Language

While Ontop is compatible with the W3C standard mapping language [R2RML](https://www.w3.org/TR/2012/REC-r2rml-20120927/), it also provides its own native mapping language (**OBDA**).

An OBDA mapping file is a text file with the extension `.obda` and consists of two main sections:

- `PrefixDeclaration`: a list of prefix definitions used in the mapping file. Each prefix is declared by a pair of its identifier (or name) and its IRI definition.
- `MappingDeclaration`: collection of **mapping assertions** where each mapping assertion consists of three fields: `mappingId`, `source` and `target`. The mappingId is any string identifying the assertion, the source is an arbitrary SQL query over the database, and the target is a [triple template](#target-triple-template) that contains placeholders that reference column names mentioned in the source query.
- `@collection`: a grouping name for a mapping declaration. You can have mutiple mapping declaration blocks as long as they are wrapped in their own `[MappingDeclaration] [[]]` tags

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

The empty lines between the two sections and between the mappings are mandatory.

::: tip Comments
To comment out a line in an OBDA mapping file, you can use the `;` character at the beginning of the line. Note that you can only comment out entire lines, not parts of them.
:::

In `target`, it is also possible to have mutiple statements on one line, where subjects can be chained by using `;` in between statements and the final statement terminates with a `.`. Multi-line `target` statements are not possible.

```text
[MappingDeclaration] @collection Books [[

mappingId     book-and-author-relationship
target        :BID_{book_id}_Authorship a :Authorship ; :hasBook :BID_{book_id} ; :hasAuthor :AID_{author_id} .
source        SELECT book_id, author_id FROM books_authors

]]

```

## Source Query

The `source` query in a mapping assertion is an SQL query over the underlying relational database and as such it uses the SQL syntax of that specific database dialect.
So things like quotes conventions may vary depending on the database system used. For example, in PostgreSQL double quotes are used for tables and column identifiers, while in MySQL backticks are used.

::: warning
The Ontop SQL parser only parses simple SQL queries without unions, aggregations, order by, etc. Non-parsed queries are treated as black-box views and sent directly to the database so the optimizations that Ontop can apply are limited.
:::

## Target Triple Structure

This section explains the syntax and limitations for the `target` of mapping assertions, which is an adaptation of the [Turtle](http://www.w3.or/TR/turtle) syntax. Each target triple is written like an RDF subject-predicate-object (SPO) graph.

```
target  <http://www.example.org/library#BID_{id}> rdf:type :Book .
                       [S]                          [P]     [O]

target  <http://www.example.org/library#BID_{id}> :title {title} .
                       [S]                          [P]     [O]
```

Each triple must be separated by a space followed by a period (`s p o .`) and is composed of three nodes:

- **Subject node**: The subject node can be one of the following terms:

  1. IRI or blank node constant: e.g. `<http://www.example.org/library#BID_FF125>` or `_:Library1`
  2. [IRI or blank node template](#iri-or-blank-node-template): e.g. `<http://www.example.org/library#BID_{id}>` or `_:{id}`
  3. IRI or blank node column: a column directly from the source query (e.g. `<{iri}>`)

- **Predicate node**: The predicate node can be one of the following terms:

  1. IRI constant: e.g. `<http://www.example.org/library#title>`
  2. IRI template: e.g. `<http://www.example.org/library#{predicate}>`
  3. IRI column: a column from the source query (e.g. `<{predicate_iri}>`)

  Note that the special predicate `a` is a shortcut that stands for `rdf:type` (more precisely, for `<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>`).

- **Object node**: The object node can be one of the following terms:

  1. IRI or blank node constant: e.g., `<http://www.example.org/library#Book>`
  2. [IRI or blank node template](#iri-template): e.g., `<http://www.example.org/Author-{pid}>`
  3. IRI or blank node column: e.g. `<{object_iri}>`
  4. Literal constant: either an implicitly typed literal (e.g., `123` or `true` or `"John"`), an explicitly typed literal (e.g., `"John"^^xsd:string`, `"123"^^xsd:integer`) or a literal with a language tag (e.g., `"Il Trono di Spade"@it`).
  5. Literal column: a column from the source query (e.g., `{title}`). It can also be explicitly typed (e.g., `{title}^^xsd:string`) or have a language tag (e.g., `{title}@en`).
  6. Literal template: just like literal constants, literal templates can also be explicitly typed or have a language tag. Literal templates can be useful to create complex, arbitrary literals by concatenation (e.g. `"POINT ({longitude} {latitude})"^^geo:wktLiteral`).

IRI and blank node templates apply **IRI-safe** encoding to their columns, following the [R2RML standard](https://www.w3.org/TR/r2rml/#dfn-iri-safe). For example, if we have the IRI template `<http://www.example.org/library#BID_{name}>` and suppose that for the `name` column we have the value `"John Library"`, then the generated IRI will be `<http://www.example.org/library#BID_John%20Library>`. Instead, IRI columns are not transformed, so their values are expected to already be valid IRIs.

::: warning
Literal constants, templates, and columns can either be explicitly typed or have a language tag, but the two cannot be combined. For example, the following mapping is *invalid*:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books WHERE lang='ITALIAN'
target        :BID_{id} :title {title}^^xsd:string@it .
```

:::

### IRI or Blank Node Template

IRI or blank node templates are used in the target of mapping assertions for the identification of generated objects. An IRI/blank node template is a string with placeholders (e.g. `<http://www.example.org/library#BID_{id}>`). More than one placeholder can appear in a template, which allows constructing complex paths. For example, as an IRI template:

```
mappingId     Spare parts
source        SELECT product, part, vendor FROM product
target        <http://example.org/{vendor}/{product}/{part}> a :Part .
```

or as a blank node template:

```
mappingId     Spare parts
source        SELECT product, part, vendor FROM product
target        _:{product}/{part} a :Part .
```

#### Prefixes in IRI or Blank Node Templates

Prefixes can be used when writing IRI or blank node templates and are replaced by their definition when Ontop parses the mappings.

*Example*. Assume that the following prefixes are defined:

```
:	http://www.example.org/ontology1#
p:	http://www.example.org/ontology2#
```

Then this mapping assertion:

```
mappingId     Example
source        SELECT col1, col2 FROM table
target        <http://www.example.org/ontology1#{col1}> :property <http://www.example.org/ontology2#{col2}>
```

is equivalent to this mapping assertion:

```
mappingId     Example
source        SELECT col1, col2 FROM table
target        :{col1} :title p:{col2}
```

### Literal

#### Literal Typing

It is possible to explicitly declare the type of a literal by suffixing it with `^^` followed by the IRI of the datatype. For example:

```
mappingId     Book titles
source        SELECT id, title, edition, comment FROM books
target        :BID_{id} :title {title}^^xsd:string; :edition {edition}^^xsd:integer; :description {comment} .
```

The type used in the mapping has to agree with the type in the ontology (if specified).
If the type is not specified (for example, for the `description` property in the previous mapping), the system will look at the SQL type of the SQL column used in the mapping and will use the [**Natural Mapping of SQL values**](https://www.w3.org/TR/r2rml/#natural-mapping) as defined by [R2RML standard](https://www.w3.org/TR/r2rml/).

#### Language Tags
The language for a literal can be specified directly using the `@` symbol followed by the language tag. For example:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books WHERE lang='ITALIAN'
target        :BID_{id} :title {title}@it .
```

::: warning
Language tags can only be constants, it is not possible to obtain them dynamically from the database. So for example, the following mapping is *invalid*:

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
source        SELECT id, title FROM books WHERE lang='ITALIAN'
target        GRAPH <http://www.example.org/graphs/italian> { :BID_{id} :title {title}@it . }
```

or, using a template for the graph name:

```
mappingId     Book titles in Italian
source        SELECT id, title FROM books WHERE lang='ITALIAN'
target        GRAPH <http://www.example.org/graphs/{lang}> { :BID_{id} :title {title}@it . }
```

### Compact Form

Following the [Turtle](https://www.w3.org/TR/turtle/) syntax, Ontop's native mapping format allows writing an RDF graph in a compact textual form. A set of triples sharing the same subject can be written as a **predicate list**, where predicate-object pairs are separated by semicolons. Similarly, a set of triples sharing the same subject and predicate can be written as an **object list**, where objects are separated by commas.

**Predicate List**: These two examples are equivalent ways of writing the triple template for an Author.

```
:Author-{ID} a :Author .
:Author-{ID} :firstName {FNAME} .
:Author-{ID} :lastName {LNAME} .
:Author-{ID} :writes :Book-{ID} .
```

```
:Author-{ID} a :Author; :firstName {FNAME}; :lastName {LNAME}; :writes :Book-{ID} .
```

**Object List**: These two examples are equivalent ways of writing the triple template for the *A Game of Thrones* book.

```
:A_Game_of_Thrones :title "A Game of Thrones"@en-US .
:A_Game_of_Thrones :title "Il Trono di Spade"@it .
```

```
:A_Game_of_Thrones :title "A Game of Thrones"@en-US, "Il Trono di Spade"@it .
```

## Meta-Mapping

Meta-mapping assertions are syntactically the same as normal assertions, but they allow users to include variables in the targets without restrictions. This means that class and property names can be constructed dynamically from the database.

*Example*: Consider the following mapping assertions:

```
mappingId     mapping1
target        <{iri}> a :{value}_{code} .
source        SELECT value, iri, code FROM table1 WHERE code > 0
```

```
mappingId     mapping2
target        <{iri}> :{role}_{code} {value} .
source        SELECT value, iri, code, role FROM table1 WHERE code > 0
```

Suppose we also have a table named `table1` that the mapping assertions refer to:

| iri  | value | code | role |
| ---- | ----- | ---- | ---- |
| iri1 | A     | 1    | P    |
| iri2 | B     | 2    | P    |
| iri3 | A     | 2    | Q    |
| iri4 | B     | 2    | Q    |

Then `mapping1` will generate the following triples:

```
iri1 a :A_1 .
iri2 a :B_2 .
iri3 a :A_2 .
iri4 a :B_2 .
```

And `mapping2` will generate the following triples:

```
iri1 :P_1 A .
iri2 :P_2 B .
iri3 :Q_2 A .
iri4 :Q_2 B .
```
