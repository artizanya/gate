// Hey Emacs, this is -*- coding: utf-8 -*-
// @ts-check

// /b/{ Local GraphQL Schema and Defaults

import codegen from 'codegen.macro';

// const schema = gqlLoader('./schema.graphql');
// The above does not work yet with local state in apollo, so using codegen
const schema = codegen`
  const fs = require('fs');
  const sch = fs.readFileSync(require.resolve('./schema.graphql'), 'utf8');
  const schLiteral = '\\\`\\n' + sch + '\\n\\\`';
  module.exports = schLiteral;
`;

import { resolvers, defaults } from './resolvers';

export {
  schema,
  resolvers,
  defaults
};

// /b/} Local GraphQL Schema and Defaults
