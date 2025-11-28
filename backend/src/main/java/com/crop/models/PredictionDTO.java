package com.crop.models;

public class PredictionDTO {
    private int code;
    private String label;

    public PredictionDTO() {}

    public PredictionDTO(int code, String label) {
        this.code = code;
        this.label = label;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
