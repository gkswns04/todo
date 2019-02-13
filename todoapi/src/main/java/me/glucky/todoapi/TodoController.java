package me.glucky.todoapi;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
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
	@CrossOrigin(origins = "http://localhost:3000")
    @PostMapping
    public ResultSet put(@RequestParam String description) {
    	Todo todo = new Todo();
    	todo.setDescription(description);
    	
    	ResultSet result = new ResultSet(1, "Todo를 생성했습니다.", todoRepository.save(todo));
    	
        return result;
    }
    // READ
    // 모든 사용자 리스트를 반환
	@CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public ResultSet list(Pageable pageable) {
    	ResultSet result = new ResultSet(1, "Todo 목록", todoRepository.findAll(pageable));
    	
        return result;
    }
    // READ
    // 해당 ID의 사용자를 반환
	@CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/{id}")
    public Optional<Todo> findOne(@PathVariable Long id) {
        return todoRepository.findById(id);
    }
    // UPDATE
    // 해당 ID의 사용자 이름을 갱신한 뒤 그 결과를 반환
	@CrossOrigin(origins = "http://localhost:3000")
    @PutMapping(value = "/{id}")
    public ResultSet update(
    		@PathVariable Long id,
    		@RequestParam(required=false, defaultValue="-1") int state,
    		String description,
    		String relatedIds) {
        Optional<Todo> todoOfId= todoRepository.findById(id);
        ResultSet result = new ResultSet();
        Todo todo;
        if (todoOfId.isPresent()) {
        	todo = todoOfId.get();
    	} else {
    		result.setReturnCode(0);
    		result.setReturnMessage("존재하지 않는 할일입니다.");
    		return result;
		}
        
        String ids = todo.getRelatedIds();
        
        if (ids != null && ids != "" && state == 1) {
        	String[] idArray = ids.split(",");
        	
        	Todo relatedTodo;
        	for (int i = 0; i < idArray.length; i++) {
        		Long relatedId = Long.valueOf(idArray[i]);
        		Optional<Todo> OptionalTodo = todoRepository.findById(relatedId);
        		if (OptionalTodo.isPresent()) {
        			relatedTodo = OptionalTodo.get();
        			
        			if (relatedTodo.getState() != 1) {
            			result.setReturnCode(0);
                		result.setReturnMessage("참조하는 할일중에 완료하지 않은 할일이 있습니다.");
                		return result;
            		}
            	}
        	}
        }
        
        
        if (description != null) todo.setDescription(description);
        if (state != -1) todo.setState(state);
        if (relatedIds != null) todo.setRelatedIds(relatedIds);

        result.setReturnCode(1);
		result.setReturnMessage("수정이 완료되었습니다.");
		result.setResult(todoRepository.save(todo));

        return result;
    }
    // DELETE
    // 해당 ID의 사용자를 삭제
	@CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping
    public ResultSet delete(@RequestParam Long id) {
        todoRepository.deleteById(id);
        
        return new ResultSet(1, "Todo를 삭제했습니다.");
    }
}
