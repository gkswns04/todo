import React, { Component } from 'react';
import styled from 'styled-components';
import { Provider } from 'mobx-react';

import TodoList from './component/todo-list';
import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Container>
          <TodoList />
        </Container>
      </Provider>
    );
  }
}

const Container = styled.div`
  width: 100%;
  min-width: 600px;
  display: flex;
  justify-content: center;
  padding-top: 80px;
`;

export default App;
