// Hey Emacs, this is -*- coding: utf-8 -*-

import 'reflect-metadata';

import { gqlGetExpandedNodes } from './index';

// import { buildTypeDefsAndResolvers } from "type-graphql";
// import { createResolversMap } from "type-graphql/dist/utils/createResolversMap";
// import { printSchema } from 'graphql'
// import { emitSchemaDefinitionFile } from 'type-graphql';

// import { buildSchemaSync } from 'type-graphql';
import { Field,
         ObjectType,
         Resolver,
         // ResolverInterface,
         Mutation,
         Arg, Ctx } from 'type-graphql';

@ObjectType()
export class ProcessTreeItem {
  @Field(type => [String])
  path: string[];

  @Field(type => Boolean)
  expanded: boolean;
}

@Resolver(of => ProcessTreeItem)
// export class RecipeResolver implements ResolverInterface<ProcessTreeItem> {
export class RecipeResolver {
  @Mutation(returns => ProcessTreeItem)
  setProcessTreeItem(
    @Arg("path") path: string[],
    @Arg("expanded") expanded: boolean,
    @Ctx() context: any,
  ): ProcessTreeItem {
    const processTreeItem = {
      __typename: 'ProcessTreeItem',
      path,
      expanded,
    };

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

    return processTreeItem;
  }
}

// const resolvers = {
//   Mutation: {
//     setProcessTreeItem: (
//       // @ts-ignore
//       obj,
//       // @ts-ignore
//       args,
//       // @ts-ignore
//       context,
//       // @ts-ignore
//       info
//     ) => {
//       const processTreeItem = {
//         __typename: 'ProcessTreeItem',
//         path: args.path,
//         // expanded: args.expanded
//       };

//       // context.cache.writeData({
//       //   data: {
//       //     treeItems: [treeItem]
//       //   }
//       // });

//       // const id = context.getCacheKey({
//       //   __typename: 'ProcessTreeItem',
//       //   path: args.path,
//       // });

//       const { processTreeItems } = context.cache.readQuery({
//         query: gqlGetExpandedNodes,
//       });

//        console.log('xxxxxx',  processTreeItems);

//       context.cache.writeQuery({
//         query: gqlGetExpandedNodes,
//         data: {
//           processTreeItems: [processTreeItem],
//         }
//       });

//       // const fragment = gql`
//       //   fragment expandedState on ProcessTreeItem {
//       //     expanded
//       //   }
//       // `;
//       // const expandedState = context.cache.readFragment({ fragment, id });
//       // const data = { ...expandedState, expanded: args.expanded };
//       // context.cache.writeData({ id, data });
//       return null;
//     },
//   },
// };

// const defaults = {
//   // treeItems: [{
//   //     __typename: 'ProcessTreeItem',
//   //     path: [],
//   //     expanded: false
//   // }],
//   processTreeItems: [],
//   selectedRadioButton: 1
// };

// export {
//   resolvers,
//   defaults
// };
