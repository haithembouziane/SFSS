package org.example.ressources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.example.utils.CropPredictionResult;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Path("/crop-predictions")
public class CropPredictionResource {

    // ---------------------------
    // GET ALL
    // ---------------------------
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<CropPredictionResult> getAllPredictions() {
        List<CropPredictionResult> results = new ArrayList<>();

        try (Connection conn = connectDb()) {

            String sql = "SELECT N, P, K, temperature, humidity, ph, rainfall, pred_label FROM crop_prediction_result";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                CropPredictionResult r = new CropPredictionResult(
                        rs.getInt("N"),
                        rs.getInt("P"),
                        rs.getInt("K"),
                        rs.getDouble("temperature"),
                        rs.getDouble("humidity"),
                        rs.getDouble("ph"),
                        rs.getDouble("rainfall"),
                        rs.getString("pred_label")
                );
                results.add(r);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }

    // ---------------------------
    // INSERT (POST)
    // ---------------------------
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public CropPredictionResult insertPrediction(CropPredictionResult result) {

        try (Connection conn = connectDb()) {

            String sql =
                    "INSERT INTO crop_prediction_result " +
                            "(N, P, K, temperature, humidity, ph, rainfall, pred_label) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setInt(1, result.getN());
            stmt.setInt(2, result.getP());
            stmt.setInt(3, result.getK());
            stmt.setDouble(4, result.getTemperature());
            stmt.setDouble(5, result.getHumidity());
            stmt.setDouble(6, result.getPh());
            stmt.setDouble(7, result.getRainfall());
            stmt.setString(8, result.getPred_label()); // also fixed spelling
            System.out.println("the value of the predictedLabel is : "+ result.getPred_label());

            stmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    private Connection connectDb() throws Exception {
        return UserResource.connectDb();
    }
}
