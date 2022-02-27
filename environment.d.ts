declare global {
  namespace NodeJS {
    interface ProcessEnv {
      token: string;
      guildId: string;
      clientId: string;
      env: 'dev' | 'prod' | 'debug';
    }
  }
}

// Otherwise the interface is not registered
export {};
