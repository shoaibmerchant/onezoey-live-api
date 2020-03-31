const elasticsearch = {
  local: {
    host: process.env.ELASTICSEARCH_URL,
    port: process.env.ELASTICSEARCH_PORT,
    index: process.env.ELASTICSEARCH_INDEX
  },
  development: {
    host: process.env.ELASTICSEARCH_URL,
    port: process.env.ELASTICSEARCH_PORT,
    index: process.env.ELASTICSEARCH_INDEX
  },
  production: {
    host: process.env.ELASTICSEARCH_URL,
    port: process.env.ELASTICSEARCH_PORT,
    index: process.env.ELASTICSEARCH_INDEX
  }
};

export default elasticsearch;
