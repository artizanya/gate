// Hey Emacs, this is -*- coding: utf-8 -*-
// @ts-check

import { loader as gqlLoader } from 'graphql.macro';

export const gqlGetExpandedNodes =
  gqlLoader('./GetExpandedNodes.graphql');

export const gqlGetSelectedRadioButton =
  gqlLoader('./GetSelectedRadioButton.graphql');

export const gqlSetExpandedNodes =
  gqlLoader('./SetExpandedNodes.graphql');
