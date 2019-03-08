// Hey Emacs, this is -*- coding: utf-8 -*-

import 'reflect-metadata';

import { gqlGetExpandedNodes } from './index';

// import { buildTypeDefsAndResolvers } from "type-graphql";
// import { emitSchemaDefinitionFile } from 'type-graphql';

import { buildSchemaSync } from 'type-graphql';
// import { createResolversMap } from 'type-graphql';
import { printSchema } from 'graphql';

// import { buildSchemaSync } from 'type-graphql';
import { Field,
         ObjectType,
         Resolver,
         // ResolverInterface,
         Mutation,
         Arg, Ctx } from 'type-graphql';

@ObjectType()
class ProcessTreeItem {
  @Field(type => [String])
  path: string[];

  @Field(type => Boolean)
  expanded: boolean;
}

@Resolver(of => ProcessTreeItem)
// export class RecipeResolver implements ResolverInterface<ProcessTreeItem> {
class ProcessTreeItemResolver {
  @Mutation(returns => ProcessTreeItem)
  setProcessTreeItem(
    @Arg('path') path: string[],
    @Arg('expanded') expanded: boolean,
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

const schema = buildSchemaSync({
  resolvers: [ProcessTreeItemResolver],
  emitSchemaFile: false,
});

// const resolvers = createResolversMap(schema);
const resolvers = null;

console.log(printSchema(schema));

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
