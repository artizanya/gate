// Hey Emacs, this is -*- coding: utf-8 -*-

import gql from 'graphql-tag';

// interface SetProcessTreeItemLocalStateArgs {
//   path: string;
//   expanded: boolean;
// };

const resolvers = {
  Mutation: {
    setProcessTreeItem: (
      // @ts-ignore
      obj,
      // @ts-ignore
      args,
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ) => {
      const id = context.getCacheKey({
        __typename: 'ProcessTreeItem',
        path: args.path,
      });
      const fragment = gql`
        fragment expandedState on ProcessTreeItem {
          expanded
        }
      `;
      const expandedState = context.cache.readFragment({ fragment, id });
      const data = { ...expandedState, expanded: args.expanded };
      context.cache.writeData({ id, data });
      return null;
    },
  },
};

const defaults = {
  // treeItems: [{
  //     __typename: 'ProcessTreeItem',
  //     path: [],
  //     expanded: false
  // }],
  treeItems: [],
  selectedRadioButton: 1
};

export {
  resolvers,
  defaults
};
