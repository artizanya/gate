// Hey Emacs, this is -*- coding: utf-8 -*-

// import gql from 'graphql-tag';
// import * as _ from 'lodash';

import * as React from 'react';
import { Component } from 'react';
import { Query, QueryResult } from 'react-apollo';

import { gqlGetElement } from './graphql/land';
import { GetElement, GetElementVariables } from './graphql/land';

import { gqlGetProcess } from './graphql/land';
import {
  GetProcess,
  GetProcess_process,
  GetProcessVariables
} from './graphql/land';

import { gqlGetSelectedRadioButton } from './graphql/local';
import { GetSelectedRadioButton } from './graphql/local';

import * as rst from 'react-sortable-tree';

import SortableTree,
       { FullTree } from 'react-sortable-tree';

// import * as treeUtils from 'react-sortable-tree/utils/tree-data-utils';
// treeUtils.walk

import { Button, ButtonGroup } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-sortable-tree/style.css';
import './App.css';
import { ApolloClient } from 'apollo-client';

// type TreeProps = ReactSortableTreeProps;
// type TreeProps = GetElements & ReactSortableTreeProps;

function getNodeKey({node}: rst.TreeNode & rst.TreeIndex): string {
  return node.collection + '/' + node.id;
}

// type NumberOrStringArray = Array<string | number>;

// interface OnVisibilityToggleData extends rst.OnVisibilityToggleData {
//   path: NumberOrStringArray;
// }

// import {observable} from 'mobx';
// import {observer} from 'mobx-react';
// import DevTools from 'mobx-react-devtools';
//
// class AppState {
//   @observable timer = 0;
//
//   constructor() {
//     setInterval(() => {
//       this.timer += 1;
//     }, 1000);
//   }
//
//   resetTimer() {
//     this.timer = 0;
//   }
// }

interface TreeState extends FullTree {}

class ProcessQuery extends Query<GetProcess, GetProcessVariables> {}
type ProcessQueryResult = QueryResult<GetProcess, GetProcessVariables>;

class ProcessTree extends Component<GetProcessVariables, TreeState> {

  constructor(props: GetProcessVariables) {
    super(props);

    this.state = {
      treeData: []
    };
  }

  // constructor() {
  //   super({treeData: [], onChange: treeData => {}});
  // }

  // constructor(props: TreeProps) {
  //   super(props);
  //
  //   this.state = {
  //     treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
  //   };
  // }

  // renderProcessQuery = (queryResult: QueryResult) => {
  // }

  renderWithOperations(processQueryResult: ProcessQueryResult) {
    if(processQueryResult.loading) {
      return <div>Loading</div>;
    }

    if(processQueryResult.error) {
      return <div>Error</div>;
    }

    const processData = processQueryResult.data as GetProcess;
    const process = processData.process as GetProcess_process;

    // const expandedNodesData = getExpandedNodesResult.data!;
    // const processTreeItems = expandedNodesData.processTreeItems;

    // console.log(expandedNodesData);

    this.state = {
      treeData: []
    };

    this.state.treeData.push({
      collection: process.collection,
      id: process.id,
      title: process.name,
      children: [{
        collection: 'output',
        id: process.id,
        title: 'Output Components',
        children: [],
      }, {
        collection: 'input',
        id: process.id,
        title: 'Input Components',
        children: [],
      }],
    });

    let outComponents = this.state.treeData[0].children![0].children!;

    for(let component of process.outComponents) {
      outComponents.push({
        collection: component.collection,
        id: component.id,
        title: component.name,
      });
    }

    let inComponents = this.state.treeData[0].children![1].children!;

    for(let component of process.inComponents) {
      inComponents.push({
        collection: component.collection,
        id: component.id,
        title: component.name,
      });
    }

    // for(let treeItem of processTreeItems) {
    //   const nodeInfo = rst.getNodeAtPath({
    //     treeData: this.state.treeData,
    //     getNodeKey,
    //     path: treeItem.path,
    //     ignoreCollapsed: false,
    //   });
    //
    //   if(nodeInfo) {
    //     nodeInfo.node.expanded = true;
    //   }
    // }

    return (
      <div style={{ height: 600 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => {
            return this.setState({treeData});
          }}
          getNodeKey={getNodeKey}
          onVisibilityToggle={
            (toggleData: rst.OnVisibilityToggleData & rst.TreePath) => {
              // setExpandedNodes({
              //   variables: {
              //     path: toggleData.path as string[],
              //     expanded: toggleData.expanded
              //   } as SetExpandedNodesVariables
              // });

              // const client = getExpandedNodesResult.client;

              // let data = getExpandedNodesResult.data as GetExpandedNodes;
              // data.treeItem.path = toggleData.path as string[];
              // client.writeData({data});

              // const treeItem = {
              //   __typename: 'ProcessTreeItem',
              //   path: toggleData.path as string[],
              //   expanded: toggleData.expanded
              // };

              // client.writeData({
              //   data: {
              //     treeItems: [treeItem]
              //   }
              // });

              console.log(toggleData.path, toggleData.expanded);
              // this.nodesExpansion.set(
              //   toggleData.path, toggleData.expanded);
              // console.log(toggleData.path, toggleData.expanded);
            }
          }
          generateNodeProps={rowInfo => ({
            onClick: (event: Event) => {
              if(event) {
                let el = event.target as HTMLElement;
                let rowContents = el.closest('.rst__rowContents');
                if(rowContents) {
                  // rowContents.classList.add('selected');
                  console.log(rowInfo.path, rowInfo.node, el.className);
                }
              }
            },
          })}
        />
      </div>
    );
  }

  renderLandQuery(processQueryResult: ProcessQueryResult) {
    return this.renderWithOperations(processQueryResult);
  }

  render() {
    return (
      <ProcessQuery query={gqlGetProcess} variables={{ id: this.props.id }}>
        {(processQueryResult) => {
           return this.renderLandQuery(processQueryResult);
        }}
      </ProcessQuery>
    );
  }
}

// Render prop example for stateless functional component
// see https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc
// see https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce

class ElementQuery extends Query<GetElement, GetElementVariables> {}

const ElementX = ({ id }: GetElementVariables) => (
  <ElementQuery query={gqlGetElement} variables={{ id }}>
    {({ loading, error, data }) => {
       if (loading) { return <div>Loading</div>; }
       if (error) { return <div>Error</div>; }
       return <div>{data!.element!.name}</div>;
    }}
  </ElementQuery>
);

// Render prop example for class component

class ElementY extends Component<GetElementVariables, {}> {
  constructor(props: GetElementVariables) {
    super(props);

    // this.state = {
    //   treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
    // };
  }

  render() {
    return (
      <ElementQuery query={gqlGetElement} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
           if (loading) { return <div>Loading</div>; }
           if (error) { return <div>Error</div>; }
           return <div>{data!.element!.name}</div>;
        }}
      </ElementQuery>
    );
  }
}

// const getSelectedRadioButtonGql = gql`
// {
//   selectedRadioButton @client
// }
// `;
//
// interface GetSelectedRadioButton {
//   selectedRadioButton: number;
// }

class SelectedRadioButtonQuery extends Query<GetSelectedRadioButton, {}> {}

class RadioButtons extends Component {
  onRadioButtonClick(selected: number, client: ApolloClient<any>) {
    client.writeData({ data: { selectedRadioButton : selected } });
  }

  render() {
    return (
      <SelectedRadioButtonQuery query={gqlGetSelectedRadioButton}>
        {({ loading, error, data, client }) => {
           if (loading) { return <div>Loading</div>; }
           if (error) { return <div>Error</div>; }
           data = data as GetSelectedRadioButton;

           return (
             <div>
               <ButtonGroup>
                 <Button
                   color="primary"
                   onClick={() => this.onRadioButtonClick(1, client)}
                   active={data.selectedRadioButton === 1}
                 >
                   One
                 </Button>
                 <Button
                   color="primary"
                   onClick={() => this.onRadioButtonClick(2, client)}
                   active={data.selectedRadioButton === 2}
                 >
                   Two
                 </Button>
                 <Button
                   color="primary"
                   onClick={() => this.onRadioButtonClick(3, client)}
                   active={data.selectedRadioButton === 3}
                 >
                   Three
                 </Button>
               </ButtonGroup>
             </div>
           );
        }}
      </SelectedRadioButtonQuery>
    );
  }
}

class SelectedButtonIndicator extends Component {
  // constructor(props: {}) {
  //   super(props);
  //
  //   this.state = { selected: 1 };
  // }

  render() {
    return (
      <SelectedRadioButtonQuery query={gqlGetSelectedRadioButton}>
        {({ loading, error, data }) => {
           data = data as GetSelectedRadioButton;
           return (
             <div>
               <p>Selected: {data.selectedRadioButton}</p>
             </div>
           );
        }}
      </SelectedRadioButtonQuery>
    );
  }

}

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.ts</code> and save to reload.
        </p>
        <ElementX id="0002" />
        <ElementY id="0001" />
        <ProcessTree id="0000" />
        <RadioButtons />
        <SelectedButtonIndicator />
      </div>
    );
  }
}

export default App;
