// Hey Emacs, this is -*- coding: utf-8 -*-

// import gql from 'graphql-tag';

import { gqlGetExpandedNodes } from './index';


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
      const processTreeItem = {
        __typename: 'ProcessTreeItem',
        path: args.path,
        // expanded: args.expanded
      };

      // context.cache.writeData({
      //   data: {
      //     treeItems: [treeItem]
      //   }
      // });

      // const id = context.getCacheKey({
      //   __typename: 'ProcessTreeItem',
      //   path: args.path,
      // });

      const { processTreeItems } = context.cache.readQuery({
        query: gqlGetExpandedNodes,
      });

      console.log('xxxxxx',  processTreeItems);

      context.cache.writeQuery({
        query: gqlGetExpandedNodes,
        data: {
          processTreeItems: [processTreeItem],
        }
      });

      // const fragment = gql`
      //   fragment expandedState on ProcessTreeItem {
      //     expanded
      //   }
      // `;
      // const expandedState = context.cache.readFragment({ fragment, id });
      // const data = { ...expandedState, expanded: args.expanded };
      // context.cache.writeData({ id, data });
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
  processTreeItems: [],
  selectedRadioButton: 1
};

export {
  resolvers,
  defaults
};
