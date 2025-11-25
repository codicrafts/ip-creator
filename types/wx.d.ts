// 微信小程序类型声明
declare namespace wx {
  interface Cloud {
    callFunction(options: {
      name: string;
      data?: any;
      config?: {
        env?: string;
      };
    }): Promise<{
      result?: any;
      errMsg?: string;
    }>;
  }
  
  const cloud: Cloud;
}

