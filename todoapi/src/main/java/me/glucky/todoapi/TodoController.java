package me.glucky.todoapi;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/todo")
public class TodoController {

	private TodoRepository todoRepository;
	
	@Autowired
    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }
	
	// CREATE
    // 사용자 이름을 입력받아 새로운 User를 생성하고 그 결과를 반환
    @PostMapping
    public Todo put(@RequestParam String description) {
    	Todo todo = new Todo();
    	todo.setDescription(description);
    	
        return todoRepository.save(todo);
    }
    // READ
    // 모든 사용자 리스트를 반환
    @GetMapping
    public Iterable<Todo> list() {
        return todoRepository.findAll();
    }
    // READ
    // 해당 ID의 사용자를 반환
    @GetMapping(value = "/{id}")
    public Optional<Todo> findOne(@PathVariable Long id) {
        return todoRepository.findById(id);
    }
    // UPDATE
    // 해당 ID의 사용자 이름을 갱신한 뒤 그 결과를 반환
    @PutMapping(value = "/{id}")
    public String update(
    		@PathVariable Long id,
    		@RequestParam(required=false, defaultValue="-1") int state,
    		String description,
    		String relatedIds) {
        Optional<Todo> todoOfId= todoRepository.findById(id);
        Todo todo;
        if (todoOfId.isPresent()) {
        	todo = todoOfId.get();
    	} else {
    		return this.resultSet(0, "존재하지 않는 할일입니다.");
		}
        
        
        String ids = todo.getRelatedIds();
        if (ids != null) {
        	String[] idArray = ids.split(",");
        	
        	Todo relatedTodo;
        	for (int i = 0; i < idArray.length; i++) {
        		Long relatedId = Long.valueOf(idArray[i]);
        		Optional<Todo> OptionalTodo = todoRepository.findById(relatedId);
        		relatedTodo = OptionalTodo.get();
        		if (relatedTodo.getState() != 1) {
        			return this.resultSet(0, "참조하는 할일중에 완료하지 않은 할일이 있습니다.");
        		}
        	}
        }
        
        
        if (description != null) todo.setDescription(description);
        if (state != -1) todo.setState(state);
        if (relatedIds != null) todo.setRelatedIds(relatedIds);
        todoRepository.save(todo);
        return this.resultSet(1, "수정이 완료되었습니다.");
    }
    // DELETE
    // 해당 ID의 사용자를 삭제
    @DeleteMapping
    public void delete(@RequestParam Long id) {
        todoRepository.deleteById(id);
    }
    
    private String resultSet(int returnCode, String returnMessage) {
    	return "{ \"return_code\": " + returnCode + ", \"return_message\": "
    			+ "\"" + returnMessage + " }"; 
    }
}
