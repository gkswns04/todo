import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import TodoItem from './todo-item';
import AddForm from './add-form';
import UpdateModal from './update-modal';
import { constant, util, color } from '../common';

@inject('store')
@observer
class TodoList extends Component {
  state = {
    input: ''
  }

  componentDidMount() {
    this.fetchTodos();
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  handleCreate = async () => {
    const { input } = this.state;
    const { todos } = this.props.store;

    const response = await util.fetch({
      uri: constant.apiPath.addTodo,
      method: 'POST',
      formData: {
        description: input
      }
    });

    console.log('response', response);
    this.props.store.todos = [...todos, response.result];
    this.setState(() => ({ input: '' }));
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleCreate();
    }
  }

  fetchTodos = async () => {
    const response = await util.fetch({
      uri: constant.apiPath.todoList,
      method: 'GET'
    });

    console.log(response);

    this.props.store.todos = response.result;
  }

  render() {
    const { todos } = this.props.store;
    return (
      <TodoListWrapper>
        <AddForm
          value={this.state.input}
          onCreate={this.handleCreate}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          showButton
        />
        {todos.length > 0 ?
          todos.map((item) => <TodoItem key={item.id} item={item} />)
          : <EmptyMessage>Todo list is empty</EmptyMessage>
        }
        <UpdateModal />
      </TodoListWrapper>
    );
  }
}

const TodoListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmptyMessage = styled.div`
  font-size: 14px;
  color: ${color.gray}
`;

export default TodoList;
