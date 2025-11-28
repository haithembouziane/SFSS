module org.example.module {
    requires jakarta.ws.rs;

    requires org.glassfish.jersey.container.servlet;
    requires org.glassfish.jersey.inject.hk2;
    requires java.sql;

    exports org.example;
}