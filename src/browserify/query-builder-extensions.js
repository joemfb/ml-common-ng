'use strict';

var mlutil = require('marklogic/lib/mlutil.js');

/**
 * Builds a [`range-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_38268)
 * @memberof! MLQueryBuilder
 * @method ext.rangeConstraint
 *
 * @param {String} name - constraint name
 * @param {Array} values - the values the constraint should equal (logical OR)
 * @return {Object} [range-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_38268)
 */
function rangeConstraint(name, values) {
  values = mlutil.asArray.apply(null, [values]);
  return {
    'range-constraint-query': {
      'constraint-name': name,
      'value': values
    }
  };
}

/**
 * Builds a [`collection-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_30776)
 * @memberof! MLQueryBuilder
 * @method ext.collectionConstraint
 *
 * @param {String} name - constraint name
 * @param {Array} values - the values the constraint should equal (logical OR)
 * @return {Object} [collection-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_30776)
 */
function collectionConstraint(name, values) {
  values = mlutil.asArray.apply(null, [values]);
  return {
    'collection-constraint-query': {
      'constraint-name': name,
      'uri': values
    }
  };
}

/**
 * Builds a [`custom-constraint-query`](http://docs.marklogic.com/guide/search-dev/structured-query#id_28778)
 * @memberof! MLQueryBuilder
 * @method ext.customConstraint
 *
 * @param {String} name - constraint name
 * @param {Array} values - the values the constraint should equal (logical OR)
 * @return {Object} [custom-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_28778)
 */
function customConstraint(name, values) {
  values = mlutil.asArray.apply(null, [values]);
  return {
    'custom-constraint-query': {
      'constraint-name': name,
      'value': values
    }
  };
}

/**
 * constraint query function factory
 * @memberof! MLQueryBuilder
 * @method ext.constraint
 *
 * @param {String} type - constraint type (`'collection' | 'custom' | '*'`)
 * @return {Function} a constraint query builder function, one of:
 *   - {@link MLQueryBuilder.ext.rangeConstraint}
 *   - {@link MLQueryBuilder.ext.collectionConstraint}
 *   - {@link MLQueryBuilder.ext.customConstraint}
 */
function constraint(type) {
  switch(type) {
    case 'custom':
      return customConstraint;
    case 'collection':
      return collectionConstraint;
    default:
      return rangeConstraint;
  }
}

/**
 * Builds an [`operator-state` query component](http://docs.marklogic.com/guide/search-dev/structured-query#id_45570)
 * @memberof! MLQueryBuilder
 * @method ext.operator
 *
 * @param {String} name - operator name
 * @param {String} stateName - operator-state name
 * @return {Object} [operator-state component](http://docs.marklogic.com/guide/search-dev/structured-query#id_45570)
 */
function operator(name, stateName) {
  return {
    'operator-state': {
      'operator-name': name,
      'state-name': stateName
    }
  };
}

// superceded

// and: function and() {
//   var args = asArray.apply(null, arguments);
//   return {
//     'and-query': {
//       'queries': args
//     }
//   };
// },

// or: function or() {
//   var args = asArray.apply(null, arguments);
//   return {
//     'or-query': {
//       'queries': args
//     }
//   };
// },

// not: function properties(query) {
//   return {
//     'not-query': query
//   };
// },

// document: function document() {
//   var args = asArray.apply(null, arguments);
//   return {
//     'document-query': {
//       'uri': args
//     }
//   };
// },

// boost: function boost(matching, boosting) {
//   return {
//     'boost-query': {
//       'matching-query': matching,
//       'boosting-query': boosting
//     }
//   };
// },

// (propertiesFragment)
// properties: function properties(query) {
//   return { 'properties-query': query };
// },

// query: function query() {
//   var args = asArray.apply(null, arguments);
//   return {
//     'query': {
//       'queries': args
//     }
//   };
// },

// text: function text(qtext) {
//   return {
//     'qtext': qtext
//   };
// },

module.exports = {
  rangeConstraint: rangeConstraint,
  collectionConstraint: collectionConstraint,
  customConstraint: customConstraint,
  constraint: constraint,
  operator: operator
};
