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
    input: '',
    totalPages: 0,
    totalElements: 0
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
    const { input, totalElements, totalPages } = this.state;
    const { todos } = this.props.store;

    const response = await util.fetch({
      uri: constant.apiPath.addTodo,
      method: 'POST',
      formData: {
        description: input
      }
    });

    if (response.returnCode !== 1) {
      return alert(response.returnMessage);
    }

    if (todos.length < 4) {
      this.props.store.todos = [...todos, response.result];
    } else {
      if (totalElements % 4 === 0) {
        this.setState(() => ({ totalPages: totalPages + 1 }));
      }
    }

    this.setState(() => ({ input: '', totalElements: totalElements + 1 }));
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleCreate();
    }
  }

  fetchTodos = async () => {
    const { page } = this.props.store;

    const response = await util.fetch({
      uri: constant.apiPath.todoList,
      method: 'GET',
      formData: {
        page,
        size: 4,
        sort: 'id'
      }
    });

    if (response.returnCode !== 1) {
      return alert(response.returnMessage);
    }

    const { totalPages, content, totalElements } = response.result;

    this.props.store.todos = content;
    this.setState(() => ({ totalPages, totalElements }));
  }

  onClickPage = (page) => {
    this.props.store.page = page;
    this.fetchTodos();
  }

  render() {
    const { todos } = this.props.store;
    const { totalPages } = this.state;
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
          todos.map((item) => <TodoItem key={item.id} item={item} fetchTodos={this.fetchTodos} />)
          : <EmptyMessage>Todo list is empty</EmptyMessage>
        }
        <PageWrapper>
          {[...Array(totalPages).keys()].map((page, idx) =>
            <Page key={idx} lastIdx={idx === totalPages - 1} onClick={() => this.onClickPage(page)}>{page + 1}</Page>)}
        </PageWrapper>
        <UpdateModal />
      </TodoListWrapper>
    );
  }
}

const TodoListWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmptyMessage = styled.div`
  font-size: 14px;
  color: ${color.gray}
`;

const PageWrapper = styled.div`
  display: flex;
`;

const Page = styled.div`
  padding: 0 7px;
  font-size: 18px;
  border-right-width: 1px;
  border-right-style: solid;
  cursor: pointer;
  ${props => props.lastIdx && `
    border-right-width: 0;
  `}
`;

export default TodoList;
