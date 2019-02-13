package me.glucky.todoapi;

public class ResultSet {
	
	private int returnCode;
	
	private String returnMessage;
	
	private Object result;

	public ResultSet() {
		super();
	}

	public ResultSet(int returnCode, String returnMessage) {
		super();
		this.returnCode = returnCode;
		this.returnMessage = returnMessage;
	}



	public ResultSet(int returnCode, String returnMessage, Object result) {
		super();
		this.returnCode = returnCode;
		this.returnMessage = returnMessage;
		this.result = result;
	}



	public int getReturnCode() {
		return returnCode;
	}

	public void setReturnCode(int returnCode) {
		this.returnCode = returnCode;
	}

	public String getReturnMessage() {
		return returnMessage;
	}

	public void setReturnMessage(String returnMessage) {
		this.returnMessage = returnMessage;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}
	
	
}
