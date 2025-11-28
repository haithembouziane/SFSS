package org.example.utils;

public class CropPredictionResult {
   private int N,P,K;
   private double humidity,ph,rainfall,temperature;

    private String pred_label;

    public CropPredictionResult(int p, int n, int k, double temperature ,double humidity,double ph, double rainfall, String pred_labe) {
        this.humidity = humidity;
        this.temperature = temperature;
        this.pred_label = pred_labe;
        this.rainfall = rainfall;
        this.ph = ph;
        P = p;
        N = n;
        K = k;
    }

    public String getPred_label() {
        return pred_label;
    }

    public void setPred_label(String pred_label) {
        this.pred_label = pred_label;
    }
    public CropPredictionResult(){

    }

    public int getK() {
        return K;
    }

    public void setK(int k) {
        K = k;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public int getN() {
        return N;
    }

    public void setN(int n) {
        N = n;
    }

    public double getPh() {
        return ph;
    }

    public void setPh(double ph) {
        this.ph = ph;
    }

    public int getP() {
        return P;
    }

    public void setP(int p) {
        P = p;
    }

    public double getRainfall() {
        return rainfall;
    }

    public void setRainfall(double rainfall) {
        this.rainfall = rainfall;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
}
