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

function arraysEqual<T>(a: Array<T>, b: Array<T>): boolean {
  if(a === b) return true;
  if(a == null || b == null) return false;
  if(a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

import { observable } from 'mobx';
// import { autorun, observable } from 'mobx';
// import { computed, observable } from 'mobx';
import { Observer } from 'mobx-react-lite';
// import { observer } from 'mobx-react';
// import DevTools from 'mobx-react-devtools';

interface TreeState extends FullTree {}

class ProcessItem {
  collection: string;
  id: string;
  title: string;
}

type ProcessTreeNodePath = Array<string | number>;

class AppState {
  @observable processTreeExpandedNodePaths: ProcessTreeNodePath[] = [];
  @observable processTreeSelectedItem: ProcessItem | null = null;
  @observable test = 0;
}

class ProcessQuery extends Query<GetProcess, GetProcessVariables> {}
type ProcessQueryResult = QueryResult<GetProcess, GetProcessVariables>;

interface ProcessTreeProps extends GetProcessVariables {
  appState: AppState;
}

class ProcessTree extends Component<ProcessTreeProps, TreeState> {
  constructor(props: ProcessTreeProps) {
    super(props);

    this.state = {
      treeData: []
    };

    // computed(() => this.render());
    // autorun(() => this.render());
  }

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

    const expandedNodePaths = this.props.appState.processTreeExpandedNodePaths;
    for(const expandedNodePath of expandedNodePaths) {
      const nodeInfo = rst.getNodeAtPath({
        treeData: this.state.treeData,
        getNodeKey,
        path: expandedNodePath,
        ignoreCollapsed: false,
      });

      if(nodeInfo) {
        nodeInfo.node.expanded = true;
      }
    }

    return (
      <div style={{ height: 600 }}>
        {this.props.appState.test}
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => {
            return this.setState({treeData});
          }}
          getNodeKey={getNodeKey}
          onVisibilityToggle={
            (toggleData: rst.OnVisibilityToggleData & rst.TreePath) => {
              const appState = this.props.appState;
              const paths = appState.processTreeExpandedNodePaths;

              let newPaths =
                paths.filter(path => !arraysEqual(path, toggleData.path));

              if(newPaths.length === paths.length) {
                newPaths.push(toggleData.path);
              }

              appState.processTreeExpandedNodePaths = newPaths;

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
                  // this.appState.processTreeSelectedNode = rowInfo.node as ProcessItem;
                  this.setProcessTreeSelectedNode(rowInfo.node as ProcessItem);
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
      <ProcessQuery query={gqlGetProcess} variables={{ id: this.props.id }}>{
        (processQueryResult) => (
          <Observer>{
            () => this.renderLandQuery(processQueryResult)
          }</Observer>
        )
      }</ProcessQuery>
    );
  }

 setProcessTreeSelectedNode = (processItem: ProcessItem) => {
   // this.props.appState.processTreeSelectedItem = {
   //   collection: processItem.collection,
   //   id: processItem.id,
   //   title: processItem.title,
   // };
   this.props.appState.test = this.props.appState.test + 1;
   console.log(this.props.appState.test);
   // console.log('yyyyyyyy');
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
  appState = new AppState();

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
        <ProcessTree id="0000" appState={this.appState} />
        <RadioButtons />
        <SelectedButtonIndicator />
      </div>
    );
  }
}

export default App;
