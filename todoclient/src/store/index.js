import { observable } from 'mobx';

class RootStore {
  @observable todos = [
    {
      id: 0,
      description: 'todo1',
      state: 0,
      relatedIds: null
    },
    {
      id: 1,
      description: 'todo2',
      state: 0,
      relatedIds: null
    },
    {
      id: 2,
      description: 'todo3',
      state: 0,
      relatedIds: '0,1'
    },
  ];

  @observable modalIsOpen = false;
  @observable selectedTodo = {};
}

export default new RootStore();
