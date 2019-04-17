// Hey Emacs, this is -*- coding: utf-8 -*-
// @ts-check

import { loader as gqlLoader } from 'graphql.macro';

export const gqlGetElement =
  gqlLoader('./GetElement.graphql');

export const gqlGetProcess =
  gqlLoader('./GetProcess.graphql');

export const gqlGetItem =
  gqlLoader('./GetItem.graphql');
