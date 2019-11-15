import { createConnection } from "typeorm";
import config from "./ormconfig";

class DatabaseManager {
    public connect() {
        (async () => {
            try {
                console.log("Connecting to database....");
                
              const connect = await createConnection(config);
              console.log("Successfully connected to database");
              
              await connect.runMigrations();
            } catch (error) {
              console.error("Error while connecting to the database", error);
            }
        })();
    }
}

export default new DatabaseManager();
