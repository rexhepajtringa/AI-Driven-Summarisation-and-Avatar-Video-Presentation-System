declare module "config" {
    interface Config {
      API_GATEWAY_URL: string;
    }
  
    const config: Config;
    export default config;
  }
  