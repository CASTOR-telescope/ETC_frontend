/**
 * ApiService.tsx
 *
 * Description of this file here.
 * <https://github.com/CARTAvis/carta-frontend/blob/dev/src/services/ApiService.ts>
 *
 * @author Isaac Cheng
 */

// import axios, { AxiosInstance } from "axios";

export interface RuntimeConfig {
  apiAddress?: string;
}

export default class ApiService {
  private static staticInstance: ApiService;

  static get Instance(): ApiService {
    if (!ApiService.staticInstance) {
      ApiService.staticInstance = new ApiService();
    }
    return ApiService.staticInstance;
  }

  public static RuntimeConfig: RuntimeConfig;

  public static SetRuntimeConfig(data: any): void {
    console.log("Setting runtime config");
    if (typeof data === "object") {
      if (typeof data.apiAddress === "string") {
        // Grab the port from the socketUrl argument if it exists
        const url: URL = new URL(window.location.href);
        const socketUrl: string | null = url.searchParams.get("socketUrl");
        const socketRegex = /^wss?:\/\/.*:(\d+)/;
        const socketPort: string = socketUrl?.match(socketRegex)?.[1] ?? "";
        data.apiAddress = data.apiAddress.replace("{port}", socketPort);
      }
      ApiService.RuntimeConfig = data as RuntimeConfig;
    } else {
      ApiService.RuntimeConfig = {};
    }
  }
}
