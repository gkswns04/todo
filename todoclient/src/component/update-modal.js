import React, { Component } from 'react';
import Modal from 'react-modal';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import moment from 'moment';
import AddForm from './add-form';
import { color, util, constant } from '../common';
import { closeW } from '../assets';

Modal.setAppElement('#root');

@inject('store')
@observer
class UpdateModal extends Component {
  state = {
    state: 0,
    relatedTodos: [],
    input: '',
    id: -1,
    errorMessage: ''
  }

  static getDerivedStateFromProps(props, state) {
    const { selectedTodo, todos, modalIsOpen } = props.store;
    if (!modalIsOpen) {
      return {
        state: 0,
        relatedTodos: [],
        input: '',
        id: -1,
        errorMessage: ''
      };
    }

    if (modalIsOpen && selectedTodo.id !== state.id) {
      let nextState = { id: selectedTodo.id };
      const relatedIds = state.relatedTodos.map((relatedTodo) => relatedTodo.id).join();

      if (selectedTodo.state !== state.state) {
        nextState = { ...nextState, state: selectedTodo.state };
      }

      if (selectedTodo.description !== state.input) {
        nextState = { ...nextState, input: selectedTodo.description };
      }

      if (selectedTodo.relatedIds && selectedTodo.relatedIds !== relatedIds) {
        const ids = selectedTodo.relatedIds.split(',');
        const relatedTodos = todos.filter((todo) => {
          for (let i = 0; i < ids.length; i++) {
            if (Number(ids[i]) === todo.id) {
              return true;
            }
          }
          return false;
        });

        nextState = { ...nextState, relatedTodos };
      }
      return nextState;
    }
    return null;
  }

  closeModal = () => {
    this.props.store.modalIsOpen = false;
  }

  handleChangeStatus = (e) => this.setState({ state: Number(e.target.value) })

  handleSelect = (e) => {
    const { relatedTodos } = this.state;
    const value = JSON.parse(e.target.value);

    for (let i = 0; i < relatedTodos.length; i++) {
      if (relatedTodos[i].id === value.id) {
        return null;
      }
    }

    relatedTodos.push(JSON.parse(e.target.value));

    this.setState({ relatedTodos });
  }

  handleDelete = (relatedTodo) => {
    const { relatedTodos } = this.state;
    this.setState(() => ({ relatedTodos: relatedTodos.filter((todo) => todo.id !== relatedTodo.id) }));
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  onClickUpdate = async () => {
    const { todos } = this.props.store;
    const {
      state,
      input,
      id,
      relatedTodos
    } = this.state;

    const relatedIds = relatedTodos.map((relatedTodo) => relatedTodo.id);
    try {
      const response = await util.fetch({
        uri: `${constant.apiPath.updateTodo}/${id}`,
        method: 'PUT',
        formData: {
          state,
          description: input,
          relatedIds
        }
      });

      this.props.store.todos = todos.map((todo) => {
        if (todo.id === id) {
          return response.result;
        }
        return todo;
      });

      if (response.returnCode !== 1) {
        return this.setState(() => ({ errorMessage: response.returnMessage }));
      }

      this.props.store.modalIsOpen = false;
    } catch (e) {
      this.setState(() => ({ errorMessage: 'server error!' }));
    }
  }

  render() {
    const { todos, selectedTodo } = this.props.store;

    return (
      <Modal
        isOpen={this.props.store.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
        <ContentWrapper>
          <Title>{`Todo #${this.state.id}`}</Title>
          <Label>Description</Label>
          <AddForm
            inputStyle="width: 100%;"
            value={this.state.input}
            onChange={this.handleChange}
          />
          <Label>Status</Label>
          <SelectContainer>
            <Select
              value={this.state.state}
              onChange={this.handleChangeStatus}
            >
              <option value={0}>Active</option>
              <option value={1}>Done</option>
            </Select>
          </SelectContainer>
          <Label>Related Todos</Label>
          <RelatedTodoSelect>
            <Select
              value="default"
              onChange={this.handleSelect}
            >
              <option value="default" disabled>Add related todos</option>
              {todos.map((todo) => {
                if (todo.id !== this.state.id) {
                  return <option key={todo.id} value={JSON.stringify(todo)}>{`${todo.description} (#${todo.id})`}</option>;
                }
                return null;
              })}
            </Select>
          </RelatedTodoSelect>
          <RelatedTodoList>
            {this.state.relatedTodos.map((relatedTodo) => (
              <RelatedTodo
                key={relatedTodo.id}
                todo={relatedTodo}
                onClickDelete={() => this.handleDelete(relatedTodo)}
              />))}
          </RelatedTodoList>
          <DateWrapper>
            <DateInfo>{`Created: ${moment(selectedTodo.createdAt).format('YYYY-MM-DD HH:mm:ss')}`}</DateInfo>
            <DateInfo>{`Last modified: ${moment(selectedTodo.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`}</DateInfo>
          </DateWrapper>
          <ErrorMessage>{this.state.errorMessage}</ErrorMessage>
          <ButtonWrapper>
            <Button color={color.lightGreen} onClick={this.onClickUpdate}>Update</Button>
            <Button onClick={this.closeModal}>Cancel</Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Modal>
    );
  }
}

const RelatedTodo = ({ todo, onClickDelete }) => {
  return (
    <RelatedTodoContainer>
      <div>{todo.description}</div>
      <DeleteButton src={closeW} onClick={onClickDelete} />
    </RelatedTodoContainer>
  );
};

const customStyles = {
  overlay: {
    backgroundColor: `${color.black30}`
  },
  content: {
    width: '35%',
    minWidth: '320px',
    top: '10%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, 0)',
    height: '85%',
    maxHeight: '520px',
    boxSizing: ''
  }
};

const Title = styled.h2`
  text-align: center;
  margin-bottom: 50px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const SelectContainer = styled.div`
  display: flex;
  /* box-sizing: border-box; */
  border: 1px solid ${color.borderGray};
  margin-bottom: 20px;
  height: 35px;
`;

const RelatedTodoSelect = styled(SelectContainer)`
  margin-bottom: 10px;
`;

const Select = styled.select`
  flex: 1;
  height: 35px;
  border: 0;
  background: none;
`;

const RelatedTodoList = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const RelatedTodoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px 10px 20px;
  border-radius: 20px;
  background-color: ${color.lightGreen};
  margin-right: 5px;
  margin-bottom: 5px;
  color: ${color.white}
`;

const DeleteButton = styled.img`
  width: 18px;
  height: 18px;
  margin-left: 5px;
  cursor: pointer;
`;

const DateWrapper = styled.div`
  margin-top: 20px;
`;

const DateInfo = styled.div`
  font-size: 13px;
  margin-bottom: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.div`
  padding: 10px 20px;
  border: 1px solid ${color.borderGray};
  border-radius: 3px;
  margin-left: 5px;
  ${props => props.color && `
    border: 0;
    background-color: ${props.color};
    color: ${color.white}
  `}
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  font-size: 13px;
  color: ${color.highlight};
  margin-top: 10px;
  min-height: 20px;
`;

const ContentWrapper = styled.div`
  height: 520px;
  display: flex;
  flex-direction: column;
`;

export default UpdateModal;
