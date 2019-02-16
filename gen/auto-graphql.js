#!/usr/bin/env node
// Hey Emacs, this is -*- coding: utf-8 -*-

const { generateTypesForDir } = require('./gqlt');

console.log('');
console.log('Generating typescript types for graphql files...');
generateTypesForDir('../src',
                    './schema/land.json',
                    '../src/graphql/local/schema.graphql',
                    'npx --no-install apollo');
