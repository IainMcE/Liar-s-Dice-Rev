package com.example.controller;

import org.springframework.context.ApplicationEvent;

public class ControllerEvent extends ApplicationEvent {
    private final String publishTo;
    private final Object data;

    public ControllerEvent(Object source, String publishTo, Object data) {
        super(source);
        this.publishTo = publishTo;
		this.data = data;
    }

    public String getDestination() {
        return publishTo;
    }

	public Object getData(){
		return data;
	}
}