#!/usr/bin/env node
// Hey Emacs, this is -*- coding: utf-8 -*-

// https://graphqlmastery.com/blog/generate-javascript-static-types-from-graphql-typescript-and-flow
// https://github.com/dotansimha/graphql-code-generator
// https://github.com/prisma/graphqlgen
// https://github.com/dangcuuson/graphql-schema-typescript
// https://github.com/19majkel94/type-graphql


// https://github.com/typeorm/typeorm

const { generateTypesForDir } = require('./gqlt');

console.log('');
console.log('Generating typescript types for graphql files...');
generateTypesForDir('../src',
                    './schema/land.json',
                    '../src/graphql/local/schema.graphql',
                    'npx --no-install apollo');
