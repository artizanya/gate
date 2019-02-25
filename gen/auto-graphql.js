#!/usr/bin/env node
// Hey Emacs, this is -*- coding: utf-8 -*-

// https://graphqlmastery.com/blog/generate-javascript-static-types-from-graphql-typescript-and-flow
// https://github.com/dotansimha/graphql-code-generator
// https://github.com/prisma/graphqlgen
// https://github.com/dangcuuson/graphql-schema-typescript
// https://github.com/19majkel94/type-graphql

// https://github.com/typeorm/typeorm

const graphqlGroups = [
  '../src/graphql/land',
  '../src/graphql/local',
];

const { execSync } = require('child_process');

console.log('Generating typescript types for graphql files...');

for(let graphqlGroup of graphqlGroups) {
  console.log(graphqlGroup);
  execSync('npx --no-install apollo client:codegen' +
           ' --outputFlat --addTypename --passthroughCustomScalars' +
           ' --customScalarsPrefix="scalars."' +
           ' --includes="' + graphqlGroup + '/*.graphql"' +
           ' --localSchemaFile="./schema/land.json"' +
           ' --target=typescript' +
           ' "' + graphqlGroup + '/types.ts"',
           { encoding: 'utf8' });
}
