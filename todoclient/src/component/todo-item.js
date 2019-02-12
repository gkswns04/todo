import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { check, closeB } from '../assets';
import { color, constant, util } from '../common';

@inject('store')
@observer
class TodoItem extends Component {
  handleToggle = async () => {
    const { id, state } = this.props.item;
    const { todos } = this.props.store;
    const toggledState = state === 1 ? 0 : 1;

    const response = await util.fetch({
      uri: `${constant.apiPath.updateTodo}/${id}`,
      method: 'PUT',
      formData: {
        state: toggledState
      }
    });

    if (response.returnCode !== 1) {
      return alert(response.returnMessage);
    }

    this.props.store.todos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          state: toggledState
        };
      }
      return todo;
    });
  }

  handleDelete = async (e) => {
    e.stopPropagation();

    const { id } = this.props.item;
    const { todos } = this.props.store;

    const response = await util.fetch({
      uri: constant.apiPath.deleteTodo,
      method: 'DELETE',
      formData: {
        id
      }
    });

    console.log(response.return_message);

    this.props.store.todos = todos.filter((todo) => todo.id !== id);
  }

  onClickContent = () => {
    this.props.store.selectedTodo = this.props.item;
    this.props.store.modalIsOpen = true;
  }

  render() {
    const { item } = this.props;
    let relatedIds = [];
    if (item.relatedIds) {
      relatedIds = item.relatedIds.split(',');
    }
    return (
      <TodoItemWrapper>
        <Container>
          <CheckButton isChecked={item.state === 1} onClick={this.handleToggle} />
          <ContentWrapper onClick={this.onClickContent}>
            <DescriptionWrapper>
              <Description state={item.state}>{item.description}</Description>
              {relatedIds.map((id) => `@${id} `)}
            </DescriptionWrapper>
            <RightWrapper>
              <CreatedDate>2019-02-08</CreatedDate>
              <DeleteButton src={closeB} onClick={this.handleDelete} />
            </RightWrapper>
          </ContentWrapper>
        </Container>
      </TodoItemWrapper>
    );
  }
}

const CheckButton = ({ isChecked, onClick }) => {
  if (isChecked) {
    return <Check src={check} onClick={onClick} />;
  } else {
    return <UnCheck onClick={onClick} />;
  }
};

const TodoItemWrapper = styled.div`
  width: 80%;
  border: 1px solid ${color.borderGray};
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 20px;
  padding-left: 10px;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const RightWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

const CreatedDate = styled.span`
  font-size: 13px;
  color: ${color.gray};
  margin-right: 10px;
`;

const Check = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const DeleteButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const UnCheck = styled.span`
  width: 25px;
  height: 25px;
  border: 2px solid black;
  border-radius: 25px;
  box-sizing: border-box;
  cursor: pointer;
`;

const Description = styled.div`
  ${props => props.state === 1 && `
    text-decoration-line: line-through
  `}
  font-size: 18px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  word-break:break-all;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
`;

export default TodoItem;
