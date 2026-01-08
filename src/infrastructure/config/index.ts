export interface Config {
  server: {
    port: number;
  };
  mongo: {
    uri: string;
    dbName: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGO_DB_NAME || 'todo_ddd',
  },
};

export default config;
