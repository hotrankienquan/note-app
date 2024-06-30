const redis = require("redis");

let client = {},
  statusConnectClient = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  };

const handleEventConnection = ({ connectionRedis }) => {
  // console.log(connectionRedis);
  connectionRedis.on("connect", () => {
    console.log("connection redis connected");
  });
  connectionRedis.on(statusConnectClient.END, () => {
    console.log("connect redis end");
  });
  connectionRedis.on(statusConnectClient.RECONNECT, () => {
    console.log("connect redis reconnecting");
  });
  connectionRedis.on(statusConnectClient.ERROR, () => {
    console.log("connect redis error");
  });
};

const initRedis = () => {
  // const instance = redis.createClient({
  //     socket: {
  //       port: 6379,
  //       host: '127.0.0.1',
  //     }
  //   });

  let instance = redis.createClient({
    socket: {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || "localhost",
    },
  });
  console.log("run to redis init func");
  client.instanceConnect = instance;
  handleEventConnection({ connectionRedis: instance });
};

const getRedis = () => {
  return client;
};

const closeRedis = () => {};


class RedisManager {
  constructor() {
    this.client = redis.createClient({
      socket: {
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASSWORD
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.on('ready', () => {
      console.log('Connected to Redis');
    });

    this.connectClient();
  }

  async connectClient() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }

  async ensureConnected() {
    if (!this.client.isOpen) {
      await this.connectClient();
    }
  }

  async setKeyValue(key, value, options = {}) {
    await this.ensureConnected();
    await this.client.set(key, value, options);
  }

  async getValueByKey(key) {
    await this.ensureConnected();
    return await this.client.get(key);
  }
}
module.exports = {
  redisInstance: new RedisManager()
};
