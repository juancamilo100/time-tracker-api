import { createConnection } from "typeorm";
import config from "./ormconfig";

class DatabaseManager {
    public connect() {
        (async () => {
            try {
              const connect = await createConnection(config);
              console.log("*********STARTING MIGRATION BROOO!!");
              
              await connect.runMigrations();
              console.log("*********FINISHED MIGRATION");
            } catch (error) {
              console.error("Error while connecting to the database", error);
            }
        })();
    }
}

export default new DatabaseManager();
