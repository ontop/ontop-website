# Using Ontop Lenses

In this tutorial, we cover the use of lenses with Ontop. Lenses allow us to create "virtual views" of specific operations over the data, that can be referenced
in our mapping definitions for a more structured access to the database.

We will go over all lenses currently supported by Ontop:

1. [Basic Lens](basic-lens.md)
2. [Join Lens](join-lens.md)
3. [Union Lens](union-lens.md)
4. [Flatten Lens](flatten-lens.md)
5. [SQL Lens](sql-lens.md)

::: tip NOTE
In this tutorial, we use a different database than in the previous guides. Before running any of the examples, please follow the [setup guide](setup).
:::

## General

Lenses are provided to Ontop as a JSON file of the following structure:
```json
{
    "relations": [Lens]
}
```
where each `Lens` object corresponds to one particular lens, holding a *name* through which it can be referenced in the mapping and a *type* which indicates the specific type of the lens.
We can include any number of lenses in this file, and they can reference database relations as well as each other.

Some more common features of lenses will be discussed in the [Basic Lens](basic-lens.md) tutorial.

In each of these tutorials, we will construct one *mapping* file and one *lenses* file that can be passed to Ontop. To simplify testing, a common template for all mapping files is already included in the tutorial files. You can continue the preparation of the individual mappings from this template.