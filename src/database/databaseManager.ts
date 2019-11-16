import { createConnection } from "typeorm";
import config from "./ormconfig";

class DatabaseManager {
    public connect() {
        (async () => {
            try {
                await createConnection(config);
                console.log("Successfully connected to database");
            } catch (error) {
              console.error("Error while connecting to the database", error);
            }
        })();
    }
}

export default new DatabaseManager();
