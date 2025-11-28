package com.crop.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.crop.services.PredictionService;
import com.fasterxml.jackson.databind.JsonNode;

@Path("/predict")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PredictionResource {

    private PredictionService predictionService = new PredictionService();

    @GET
    public Response health() {
        String response = "{\"status\": \"healthy\", \"service\": \"Crop Predictor Backend\"}";
        return Response.ok(response).build();
    }

    @POST
    public Response predict(JsonNode request) {
        try {
            // Forward to ML service and handle response
            String result = predictionService.predictCrop(request);
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}
