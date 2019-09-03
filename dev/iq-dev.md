# Intermediate query

::: warning
TODO: UPDATE (2 years old). Datalog has almost been removed.
:::

Input queries for Ontop are expressed in (a fragment of) SPARQL 1.1,
whereas the output of the rewriting and optimization process is expressed in the query language used by the underlying DBMS (prototypically some variant of SQL,
but also the MongoDB aggregate query language,
and possibly other NoSQL DBMS-specific query languages in the future).

Because most query rewriting and optimization steps apply regardless of the underlying DBMS,
a DBMS-independent query representation format is used internally.
More exactly,
two main internal representations of a query are currently used in Ontop:
one is rule-based (Datalog without negation),
whereas the other one has a more algebraic flavour.
A query in the latter format is called an _intermediate query_.

Both formats (Datalog and intermediate query) allow for the representation of queries and mapping assertions.
In the rule-based format,
each mapping assertion is a rule,
and the query together with all mapping assertions for the underlying database form a unique Datalog program.
In the algebraic format,
each mapping assertion is an intermediate query.

Datalog was the main internal query representation format in Version 1 of Ontop,
due in particular to its close similarity with conjunctive queries,
which were the only supported input queries.
The switch to SPARQL input queries increased expressiveness,
making their rule-based representation more complex (due in particular to the the SPARQL OPTIONAL operator,
which,
roughly speaking,
corresponds to the SQL left outer join).
The intermediate query format on the other hand offers a relatively straightforward internal representation,
not only of SPARQL queries,
but also of the queries sent to underlying DBMS (at least the SQL-like ones),
as well as complex mapping assertions (which,
in most scenarios,
contains SQL queries).
This is also why in future versions of Ontop the rule-based internal representation should progressively be abandoned.

The following sections describe each format:

* The (rule-based)  Datalog format (LINK)
* The (more algebraic) intermediate query format (LINK)
