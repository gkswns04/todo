const serverUri = 'http://192.168.0.5:8080';
// const serverUri = 'http://192.168.0.11:8080';

const apiPath = {
  addTodo: `${serverUri}/todo`,
  todoList: `${serverUri}/todo`,
  getTodo: `${serverUri}/todo`,
  updateTodo: `${serverUri}/todo`,
  deleteTodo: `${serverUri}/todo`,
};

export default {
  apiPath
};
