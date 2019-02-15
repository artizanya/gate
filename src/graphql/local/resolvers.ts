// Hey Emacs, this is -*- coding: utf-8 -*-

const resolvers = {
  // Mutation: {
  //   toggleTodo: (_, variables, { cache, getCacheKey }) => {
  //     const id = getCacheKey({ __typename: 'TodoItem', id: variables.id });
  //     const fragment = gql`
  //       fragment completeTodo on TodoItem {
  //         completed
  //       }
  //     `;
  //     const todo = cache.readFragment({ fragment, id });
  //     const data = { ...todo, completed: !todo.completed };
  //     cache.writeData({ id, data });
  //     return null;
  //   },
  // },
};

const defaults = {
  treeItem: {
    __typename: 'ProcessTreeItemLocalState',
    path: [],
    expanded: false
  },
  selectedRadioButton: 1
};

export {
  resolvers,
  defaults
};
