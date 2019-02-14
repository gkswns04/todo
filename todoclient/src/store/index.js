import { observable } from 'mobx';

class RootStore {
  @observable todos = [];
  @observable page = 0;
  @observable modalIsOpen = false;
  @observable selectedTodo = {};
}

export default new RootStore();
