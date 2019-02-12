import React from 'react';
import styled from 'styled-components';
import { color } from '../common';

const AddForm = ({ inputStyle, value, onChange, onCreate, onKeyPress, showButton }) => {
  return (
    <Container>
      <Input
        inputStyle={inputStyle}
        value={value}
        placeholder="Todo Item"
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      {showButton ?
        <AddButton onClick={onCreate}>
          Add Todo
        </AddButton> : null}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  justify-content: center;
`;

const AddButton = styled.div`
  height: 35px;
  background-color: ${color.lightGreen};
  color: white;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  margin-left: 5px;
  cursor: pointer;
  font-weight: 200;
`;

const Input = styled.input`
  width: 30%;
  height: 35px;
  font-size: 15px;
  box-sizing: border-box;
  border: 1px solid ${color.borderGray};
  padding: 0 7px;
  ${props => props.inputStyle}
`;

export default AddForm;
