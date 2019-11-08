import { createConnection } from 'typeorm';
import config from './ormconfig'

class DatabaseManager {
    connect() {
        console.log("Connecting to DB");
        
        (async () => {
            try {
              await createConnection(config);
              console.log("CONNECTED TO DB!");
              
            } catch (error) {
              console.log('Error while connecting to the database', error);
            }
        })();
    }
}

export default new DatabaseManager();