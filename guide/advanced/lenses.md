# Lenses
*Since 4.2.0 (was experimental in 4.1.x)*

*Prior to 5.0.0, lenses were named Ontop views*.

Lenses are relational views defined at the level of Ontop and unknown to the underlying database. Lenses can be defined from database relations and from other lenses.

As database relations, lenses have a name which can be used in the source part of the mapping entries. They are specified in a separate file that can be provided to Ontop through a dedicated parameter (`--lenses` for the [CLI commands](/guide/cli) that support it, `ONTOP_LENSES_FILE` for the [Docker image](https://hub.docker.com/r/ontop/ontop)).

At the moment, 5 types of lenses are available:
 1. [Basic lenses](#basiclens) (defined over one base relation)
 2. [Join lenses](#joinlens) (defined over multiple base relations)
 3. [SQL lenses](#sqllens) (defined from an arbitrary SQL query)
 4. [Union lenses](#unionlens) (defined as a union of multiple base relations)
 4. [Flatten lenses](#flattenlens) (defined as an unnest operation over one base relation)

::: warning Don't use lenses in complex source SQL queries
The Ontop mapping SQL parser only parses simple forms of SQL queries (without unions, aggregations, limits, order by, etc.). Non-parsed queries are treated as black-box views, that is as strings that are injected into the final SQL queries sent to the database. If some lenses appear in these black-box views, the resulting SQL queries will be rejected by the database because they refer to relations it does not know.
:::

 One interesting feature of lenses is that you can specify additional [constraints](#constraints) holding on them (in addition to the ones that can be inferred from base relations). The constraints can be:
   - [Unique constraints](#uniqueconstraint)
   - [Other functional dependencies](#otherfunctionaldependency)
   - [Foreign keys](#foreignkey)
   - Non-null constraints (columns that do no include null values)
   - IRI-safe constraints (columns on which the R2RML safe encoding has no effect). *Since 5.0.2*.


## Example

```json
{
    "relations": [
        {
            "name": ["\"lenses\"","\"hr\"","\"persons\""],
            "baseRelation": ["\"hr\"","\"persons\""],
            "filterExpression": "\"firstName\" IS NOT NULL AND \"lastName\" IS NOT NULL", 
            "columns": {
                "added": [
                    {
                        "name": "\"fullName\"",
                        "expression": "CONCAT(UPPER(\"firstName\"),' ',\"lastName\")"
                    }
                ],
                "hidden": [
                    "\"firstName\"",
                    "\"lastName\""
                ]
            },
            "uniqueConstraints": {
                "added": [
                    {
                        "name": "uc2",
                        "determinants": ["\"ssn\""]
                    }
                ]
            },
            "otherFunctionalDependencies": {
                "added": [
                    {
                        "determinants": ["\"regionOfResidence\""],
                        "dependents": ["\"countryOfResidence\""]
                    }
                ] 
            },
            "foreignKeys": {
                "added": [
                    {
                        "name": "fk1",
                        "from": ["\"regionOfResidence\""],
                        "to": {
                            "relation": ["\"geo\"","\"regions\""],
                            "columns": ["\"reg_id\""]
                        }
                    }
                ]
            },
            "nonNullConstraints": {
                "added": [
                    "\"email\""
                ]
            },
            "iriSafeConstraints": {
                "added": [
                    "\"ssn\""
                ]
            },
            "type": "BasicLens"
        },
        {
        "name": [
            "\"lenses\"",
            "\"rooms\""
        ],
        "join": {
            "relations": [
            ["\"rooms\""],
            ["\"lenses\", \"hotels\""]
            ],
            "columnPrefixes": [
            "r_",
            "h_"
            ]
        },
        "filterExpression": "\"r_hotel_id\"=\"h_id\" AND (\"h_stars\" = '***' OR \"h_price\" = '€€€') AND \"r_guests\" = 2",
        "columns": {
            "added": [
            ],
            "hidden": [
            ]
        },
        "type": "JoinLens"
        },
        {
            "name": ["\"lenses\"","\"geo\"","\"top_region\""],
            "query": "SELECT \"regionOfResidence\" AS \"region\", COUNT(*) FROM \"hr\".\"persons\" GROUP BY \"regionOfResidence\" ORDER BY COUNT(*) DESC LIMIT 1",
            "type": "SQLLens"
        }
    ]
}

```


## Document root

The lenses document has the following JSON structure:

```json
{ 
    "relations": [Lens]
}
```

| Key                | Type      |
| ------------------ | --------- |
| `relations`          | Array of `Lens`-s |

## `Lens`

### Common fields

All the lenses accept the following fields (most of them are optional):
```json
{
    "name": [String],
    "uniqueConstraints": {
        "added": [UniqueConstraint]
    },
    "otherFunctionalDependencies": {
        "added": [OtherFunctionalDependency]
    },
    "foreignKeys": {
        "added": [ForeignKey]
    },
    "nonNullConstraints": {
        "added": [String]
    },
    "iriSafeConstraints": {
        "added": [String]
    },
    "type": String
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name`          | Array of Strings | View name components (with correct quoting) |
| `uniqueConstraints` | JSON Object | Optional
| `uniqueConstraints.added` | Array of `UniqueConstraint`-s | |
| `otherFunctionalDependencies` | JSON Object | Optional |
| `otherFunctionalDependencies.` `added` | Array of `OtherFunctionalDependency`-s | |
| `foreignKeys` | JSON Object | Optional
| `foreignKeys.added` | Array of `ForeignKey`-s | |
| `nonNullConstraints` | JSON Object | Optional
| `nonNullConstraints.added` | Array of Strings | Names of non-null columns (with correct quoting). One string per column |
| `iriSafeConstraints` | JSON Object | Optional
| `iriSafeConstraints.added` | Array of Strings | Names of IRI-safe columns (with correct quoting). One string per column |
| `type` | String | Either `BasicLens`, `JoinLens` or `SQLLens`

### `BasicLens`

A basic lens is defined from one base (parent) relation, over which it can apply a filter, an extended projection and additional constraints.

In addition to the [common fields](#common-fields), basic lenses accept the following ones:
```json
{
    "baseRelation": [String],
    "columns": {
        "added": [AddedColumn],
        "hidden": [String]
    },
    "filterExpression": String,
    "type": "BasicLens"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `baseRelation`          | Array of Strings | Name components of the base relation (with correct quoting) |
| `columns` | JSON Object | Optional (since 5.0.2)
| `columns.added` | Array of `AddedColumn`-s | |
| `columns.hidden` | Array of Strings | Names of the columns from the base relation to be projected away (with correct quoting) |
| `filterExpression` | String | Expression expressed in the SQL dialect of the data source. Can only refer to columns from the base relation, not to added columns. Can be empty. Optional |

#### `AddedColumn`

Added columns have the following definition:

```json
{
    "name": String,
    "expression": String
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name`          | String | New column name (with correct quoting) |
| `expression` | String | SQL expression defining the column. Can only refer to columns from the base relations, not to added columns |

### `JoinLens`

A join lens is defined from multiple base relations, over which it can apply a filter (joining condition), an extended projection and additional constraints.

A prefix is assigned to each base relation and is added as a prefix to their column names. This allows to avoid conflicts due to columns with the same names in base relations.

In addition to the [common fields](#common-fields), join lenses accept the following ones:
```json
{
    "join": {
        "relations": [[String]],
        "columnPrefixes": [String]
    },
    "columns": {
        "added": [AddedColumn],
        "hidden": [String]
    },
    "filterExpression": String,
    "type": "JoinLens"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `join`          | JSON Object | |
| `join.relations`          | Array of arrays of Strings | Arrays of the name components of each base relation (with correct quoting)|
| `join.columnPrefixes`       | Array of Strings | Prefix for each base relation to be applied on its column names. Follows the same order as `join.relations`. |
| `columns` | JSON Object | Optional (since 5.0.2) |
| `columns.added` | Array of `AddedColumn`-s | |
| `columns.hidden` | Array of Strings | Names of the columns from the base relations to be projected away (with correct quoting) |
| `filterExpression` | String | Expression expressed in the SQL dialect of the data source. Can only refer to prefixed columns from the base relations, not to added columns. Can be empty. Optional |


### `SQLLens` 

A SQL lens is defined from an arbitrary SQL query. While expressive, it also comes with important restrictions. When applicable, other types of lenses should be used instead.

::: warning Avoid referring to lenses in the SQL query
As Ontop uses the same parser as from the mapping source queries, the same restriction apply: non-parsed queries will be treated internally as black-box views and will fail. Please consider using other types of lenses if possible.
:::

::: warning No unique constraint and foreign key inferred from the base relations
Please consider using other types of lenses if possible.
:::

In addition to the [common fields](#common-fields), SQL lenses accept the following ones:
```json
{
    "query": String,
    "type": "SQLLens"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `query` | String | SQL query |


### `UnionLens`

*Union lenses will be supported starting with version 5.1.0*.


A union lens is defined from multiple base relations that share attributes with exactly the same names and types. The relations will be merged with each other, concatenating their contents.

When defining a union lens, a "_provenance column_" can be determined to hold, for each data entry, the name of the base relation it originates from.

In addition to the [common fields](#common-fields), union lenses accept the following ones:
```json
{
    "unionRelations": [[String]],
    "makeDistinct": boolean,
    "provenanceColumn": String,
    "type": "UnionLens"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `unionRelations` | Array of arrays of Strings | Arrays of the name components of each base relation (with correct quoting).  |
| `makeDistinct` | boolean | Determines, if the final resulting union should be made distinct.  |
| `unionRelations` | String | The name of the column that should contain the base relation each entry originates from. If not provided, provenance information will not be included in the result.  |


### `FlattenLens`

*Flatten lenses will be supported starting with version 5.1.0*.

A flatten lens is defined from one base (parent) relation that contains an array-like data structure in one of its fields. The array is flattened into multiple rows, where each row contains a single item from the flattened array in the `new` column. Columns of the base relation not included in the `kept` list will be discarded when flattening the array.

In addition, a `position` column can be included in the lens, providing a unique index for each flattened row in its parent relation.

::: tip NOTE
The flatten operation is only performed on the "outer-most" array layer. Multi-dimensional arrays will have their dimensionality reduced by 1.
:::

In addition to the [common fields](#common-fields), flatten lenses accept the following ones:
```json
{
    "flattenedColumn": {
        "name": String,
        "datatype": String
    },
    "columns": {
        "kept": [String],
        "new": String,
        "position": String
    },
    "type": "FlattenLens"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `flattenedColumn` | JSON Object | Identifies the column that is to be flattened.  |
| `flattenedColumn.name` | String | The name of the column that is to be flattened.  |
| `flattenedColumn.datatype` | String | The type of the column that is to be flattened.  |
| `columns` | JSON Object | Defines the columns of the output relation.  |
| `columns.kept` | Array of Strings | The names of the columns from the base relation that should be included in the output.  |
| `columns.new` | String | The name of the newly created column that should hold the elements of the flattened array.  |
| `columns.position` | String | The name of the newly created column that should hold the index of each flattened element in its source list. If not provided, no position column will be included.  |

Due to various limitations in the language definitions, the FlattenLens is currently not equally supported for all dialects. The table below lists, in detail, the level of support for each dialect. *"Flatten"* defines if the flatten lens is supported by the dialect, *"position"* defines if the `position` column can be provided, and *"Infer base type"* indicates if Ontop is able to infer the type of the flattened output column if the input is an array type. *"Array Type"* and *"JSON Type"* indicate if the flatten lens is supported over array-like types (`ARRAY`, `ARRAY<T>`, `LIST`, `T[]` etc.) and JSON-arrays (either as `JSON` type or as `VARCHAR`) respectively.

| Dialect | Flatten | Position | Infer base type | Array Type | JSON Type |
| ------------------ | --------- | ---------------------------------------------   | ------ | ------ | -------- |
| AWS Athena | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![NO][no] |
| AWS Redshift | ![YES][yes] | ![YES][yes]  | ![NO][no] | ![YES][yes] | ![NO][no] |
| BigQuery | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![NO][no] |
| DB2 | ![NO][no] | ![NO][no]  | ![NO][no] | ![YES][yes] | ![NO][no] |
| Databricks | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![YES][yes] |
| Denodo | ![NO][no] | ![NO][no]  | ![NO][no] | ![YES][yes] | ![NO][no] |
| Dremio | ![YES][yes] | ![NO][no]  | ![NO][no] | ![YES][yes] | ![NO][no] |
| DuckDB | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![NO][no] |
| MariaDB | ![YES][yes] | ![YES][yes]  | ![NO][no] | ![NO][no] | ![YES][yes] |
| MS SQLServer | ![YES][yes] | ![NO][no]  | ![NO][no] | ![NO][no] | ![YES][yes] |
| MySQL | ![YES][yes] | ![YES][yes]  | ![NO][no] | ![NO][no] | ![YES][yes] |
| Oracle | ![YES][yes] | ![YES][yes]  | ![NO][no] | ![NO][no] | ![YES][yes] |
| PostgreSQL | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![YES][yes] |
| Presto | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![NO][no] |
| Snowflake | ![YES][yes] | ![YES][yes]  | ![NO][no] | ![YES][yes] | ![NO][no] |
| SparkSQL | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![YES][yes] |
| Trino | ![YES][yes] | ![YES][yes]  | ![YES][yes] | ![YES][yes] | ![NO][no] |


## Constraints

### `UniqueConstraint`

```json
{
    "name": String,
    "determinants": [String]
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name` | String | Name of the unique constraint |
| `determinants` | Array of Strings | Column names (with correct quoting) |

### `OtherFunctionalDependency`

Useful for dealing with denormalized data, where unique constraints cannot be applied.

```json
{
    "determinants": [String],
    "dependents": [String]
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `determinants` | Array of Strings | Column names (with correct quoting) that determine the values of dependent columns |
| `dependents` | Array of Strings | Column names (with correct quoting) whose values are determined by determinant columns |


### `ForeignKey`

```json
{
    "name": String,
    "from": [String],
    "to": {
        "relation": [String],
        "columns": [String]
    }
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name` | String | Name of the foreign key |
| `from` | Array of Strings | Source columns (with correct quoting) |
| `to`   | JSON Object | |
| `to.relation` | Array of Strings | Name components of the target relation (with correct quoting) |
| `to.columns` | Array of Strings | Target columns (with correct quoting). Same order as for the source columns |

<!-- Images -->
[yes]: ./img/check.png
[no]: ./img/cross.png
