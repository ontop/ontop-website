# Ontop views
*Since 4.2.0 (was experimental in 4.1.x)*

Ontop views are relational views defined at the level of Ontop and unknown to the underlying database. Ontop views can be defined from database relations and from other Ontop views.

As database relations, Ontop views have a name which can be used in the source part of the mapping entries. They are specified in a separate file that can be provided to Ontop through a dedicated parameter (`--ontop-views` for the [CLI commands](/guide/cli) that support it, `ONTOP_VIEW_FILE` for the [Docker image](https://hub.docker.com/r/ontop/ontop-endpoint)).

::: warning Don't use Ontop views in complex source SQL queries
The Ontop mapping SQL parser only parses simple forms of SQL queries (without unions, aggregations, limits, order by, etc.). Non-parsed queries are treated as black-box views, that is as strings that are injected into the final SQL queries sent to the database. If some Ontop views appear in these black-box views, the resulting SQL queries will be rejected by the database because they refer to relations it does not know.
:::

At the moment, 3 types of Ontop views are available:
 1. [Basic views](#basicviewdefinition) (defined over one base relation)
 2. [Join views](#joinviewdefinition) (defined over multiple base relations)
 3. [SQL views](#joinviewdefinition) (defined from an arbitrary SQL query).


 One interesting feature of Ontop views is that you can specify additional [constraints](#constraints) holding on them (in addition to the ones that can be inferred from base relations). The constraints can be:
   - [Unique constraints](#uniqueconstraint)
   - [Other functional dependencies](#otherfunctionaldependency)
   - [Foreign keys](#foreignkey)
   - Non-null constraints (columns that do no include null values).


## Example

```json
{
    "relations": [
        {
            "name": ["\"views\"","\"hr\"","\"persons\""],
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
                        "determinants": "\"ssn\""
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
                            "relation": ["\"geo\",\"regions\""],
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
            "type": "BasicViewDefinition"
        },
        {
        "name": [
            "\"views\"",
            "\"rooms\""
        ],
        "join": {
            "relations": [
            ["\"rooms\""],
            ["\"views\", \"hotels\""]
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
        "type": "JoinViewDefinition"
        },
        {
            "name": ["\"views\"","\"geo\"","\"top_region\""],
            "query": "SELECT \"regionOfResidence\" AS \"region\", COUNT(*) FROM \"hr\".\"persons\" GROUP BY \"regionOfResidence\" ORDER BY COUNT(*) DESC LIMIT 1",
            "type": "SQLViewDefinition"
        }
    ]
}

```


## Document root

The Ontop view document has the following JSON structure:

```json
{ 
    "relations": [ViewDefinition]
}
```

| Key                | Type      |
| ------------------ | --------- |
| `relations`          | Array of `ViewDefinition`-s |

## `ViewDefinition`

### Common fields

All the view definitions accept the following fields (most of them are optional):
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
| `type` | String | Either `BasicViewDefinition`, `JoinViewDefinition` or `SQLViewDefinition`

### `BasicViewDefinition`

A basic view is defined from one base (parent) relation, over which it can apply a filter, an extended projection and additional constraints.

In addition to the [common fields](#common-fields), basic view definitions accept the following ones:
```json
{
    "baseRelation": [String],
    "columns": {
        "added": [AddedColumn],
        "hidden": [String]
    },
    "filterExpression": String,
    "type": "BasicViewDefinition"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `baseRelation`          | Array of Strings | Name components of the base relation (with correct quoting) |
| `columns` | JSON Object |
| `columns.added` | Array of `AddedColumn`-s | |
| `columns.hidden` | Array of Strings | Names of the columns from the base relation to be projected away (with correct quoting) |
| `filterExpression` | String | Expression expressed in the SQL dialect of the data source. Can only refer to columns from the base relation, not to added columns. Can be empty |

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

### `JoinViewDefinition`

A join view is defined from multiple base relations, over which it can apply a filter (joining condition), an extended projection and additional constraints.

A prefix is assigned to each base relation and is added as a prefix to their column names. This allows to avoid conflicts due to columns with the same names in base relations.

In addition to the [common fields](#common-fields), join view definitions accept the following ones:
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
    "type": "JoinViewDefinition"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `join`          | JSON Object | |
| `join.relations`          | Array of arrays of Strings | Arrays of the name components of each base relation (with correct quoting)|
| `join.columnPrefixes`       | Array of Strings | Prefix for each base relation to be applied on its column names. Follows the same order as `join.relations`. |
| `columns` | JSON Object |
| `columns.added` | Array of `AddedColumn`-s | |
| `columns.hidden` | Array of Strings | Names of the columns from the base relations to be projected away (with correct quoting) |
| `filterExpression` | String | Expression expressed in the SQL dialect of the data source. Can only refer to prefixed columns from the base relations, not to added columns. Can be empty |


### `SQLViewDefinition` 

A SQL view is defined from an arbitrary SQL query. While expressive, it also comes with important restrictions. When applicable, other types of Ontop views should be used instead.

::: warning Avoid referring to Ontop views in the SQL query
As Ontop uses the same parser as from the mapping source queries, the same restriction apply: non-parsed queries will be treated internally as black-box views and will fail. Please consider using other types of Ontop views if possible.
:::

::: warning No unique constraint and foreign key inferred from the base relations
Please consider using other types of Ontop views if possible.
:::

In addition to the [common fields](#common-fields), SQL view definitions accept the following ones:
```json
{
    "query": String,
    "type": "JoinViewDefinition"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `query` | String | SQL query |



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
