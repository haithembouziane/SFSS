package org.example.ressources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.example.utils.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Path("/users")
public class UserResource {

    private static final String USERNAME = "root";
    private static final String PASSWORD = "";
    private static final String URL = "jdbc:mysql://localhost/algeria2.0_db";
    public static Connection connectDb() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            return DriverManager.getConnection(URL, USERNAME, PASSWORD);
        } catch (SQLException | ClassNotFoundException ex) {
            System.out.println("SQLException: " + ex.getMessage());
            return null;
        }
    }

    // -----------------------------------------------------------
    // CREATE USER
    // -----------------------------------------------------------
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User createUser(User u) {

        String sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        try (Connection conn = connectDb()) {

            if (conn == null) return null;

            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setString(1, u.getUsername());
            stmt.setString(2, u.getEmail());
            stmt.setString(3, u.getPassword());

            stmt.executeUpdate();
            System.out.println("CREATING USER IN DB name:"+u.getUsername());
            return u;

        } catch (SQLException e) {
            System.out.println("Database Error: " + e.getMessage());
            return null;
        }
    }

    // -----------------------------------------------------------
    // READ ALL USERS
    // -----------------------------------------------------------
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();

        String sql = "SELECT * FROM users";

        try (Connection conn = connectDb()) {

            if (conn == null) return users;

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);

            while (rs.next()) {
                User u = new User();
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setPassword(rs.getString("password"));
                users.add(u);
            }

        } catch (SQLException e) {
            System.out.println("Database Error: " + e.getMessage());
        }

        return users;
    }

    // -----------------------------------------------------------
    // READ ONE USER BY ID
    // -----------------------------------------------------------
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public User getUserById(@PathParam("id") int id) {
        String sql = "SELECT * FROM users WHERE id = ?";

        try (Connection conn = connectDb()) {

            if (conn == null) return null;
            System.out.println("GETTING USER WITH ID=" + id);

            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                User u = new User();
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setPassword(rs.getString("password"));
                return u;
            }

        } catch (SQLException e) {
e.printStackTrace();        }

        return null;
    }

    // -----------------------------------------------------------
    // UPDATE USER
    // -----------------------------------------------------------
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User updateUser(@PathParam("id") int id, User u) {

        String sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";

        try (Connection conn = connectDb()) {

            if (conn == null) return null;

            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, u.getUsername());
            stmt.setString(2, u.getEmail());
            stmt.setString(3, u.getPassword());
            stmt.setInt(4, id);

            int rows = stmt.executeUpdate();

            if (rows > 0) {
                return u;
            }

        } catch (SQLException e) {
            System.out.println("Database Error: " + e.getMessage());
        }

        return null;
    }

    // -----------------------------------------------------------
    // DELETE USER
    // -----------------------------------------------------------
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public String deleteUser(@PathParam("id") int id) {

        String sql = "DELETE FROM users WHERE id = ?";

        try (Connection conn = connectDb()) {

            if (conn == null) return "Connection error";

            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);

            int rows = stmt.executeUpdate();

            if (rows > 0) {
                return "User deleted";
            } else {
                return "User not found";
            }

        } catch (SQLException e) {
            System.out.println("Database Error: " + e.getMessage());
            return "Error";
        }
    }
}
