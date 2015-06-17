'use strict';

var mlutil = require('marklogic/lib/mlutil.js');

function rangeConstraint(name, values) {
  values = mlutil.asArray.apply(null, [values]);
  return {
    'range-constraint-query': {
      'constraint-name': name,
      'value': values
    }
  };
}

function collectionConstraint(name, values) {
  values = mlutil.asArray.apply(null, [values]);
  return {
    'collection-constraint-query': {
      'constraint-name': name,
      'uri': values
    }
  };
}

function customConstraint(name, values) {
  values = mlutil.asArray.apply(null, [values]);
  return {
    'custom-constraint-query': {
      'constraint-name': name,
      'value': values
    }
  };
}

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
