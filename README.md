### ml-common-ng

An angular module for interacting with the MarkLogic REST API (and some basic utilities components). Based on components from ealier versions of [https://github.com/marklogic/slush-marklogic-node](https://github.com/marklogic/slush-marklogic-node).

#### getting started

    bower install ml-common-ng

#### services

- `MLRest`: thin wrapper around the MarkLogic REST API
- `MLQueryBuilder`: builds JSON structured queries

#### filters

- `truncate`: truncate strings
- `object2Array`: convert an object to an array of the object values

#### directives

- `compile`: compile HTML strings into the DOM

See [https://joemfb.github.io/ml-common-ng/](https://joemfb.github.io/ml-common-ng/) for API docs and directive examples. 

See [https://github.com/marklogic/slush-marklogic-node](https://github.com/marklogic/slush-marklogic-node) for a quick way to get started with an angular search application on top of the MarkLogic REST API.
