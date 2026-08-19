/**
 * Official HydraDB Integration Layer
 * 
 * Directly interfaces with the official `@hydradb/sdk` (HydraDB TypeScript SDK)
 * and `neo4j-driver` for native Neo4j-compatible Bolt/OpenCypher graph connectivity.
 */

import { HydraDBClient as OfficialHydraSDK } from '@hydradb/sdk';
import neo4j, { Driver } from 'neo4j-driver';

export interface HydraDBConnectionConfig {
  apiKey?: string;
  baseUrl?: string;
  boltUri?: string;
  boltUser?: string;
  boltPassword?: string;
}

export class HydraDBOfficialAdapter {
  private sdkClient: OfficialHydraSDK;
  private boltDriver: Driver | null = null;
  private isConnected: boolean = false;
  private config: HydraDBConnectionConfig;

  constructor(config?: HydraDBConnectionConfig) {
    this.config = {
      apiKey: config?.apiKey || process.env.HYDRADB_API_KEY || 'alibi_hack_hydra_demo_key',
      baseUrl: config?.baseUrl || process.env.HYDRADB_URL || 'https://api.hydradb.com',
      boltUri: config?.boltUri || process.env.HYDRADB_BOLT_URI || 'bolt://localhost:7687',
      boltUser: config?.boltUser || process.env.HYDRADB_BOLT_USER || 'hydradb',
      boltPassword: config?.boltPassword || process.env.HYDRADB_BOLT_PASSWORD || 'hydradb',
    };

    // Initialize official @hydradb/sdk client
    try {
      this.sdkClient = new OfficialHydraSDK({
        token: this.config.apiKey,
        environment: this.config.baseUrl,
      });
      this.isConnected = true;
    } catch (e) {
      this.sdkClient = new OfficialHydraSDK();
    }

    // Initialize Neo4j-compatible Bolt driver for HydraDB OpenCypher queries
    if (this.config.boltUri) {
      try {
        this.boltDriver = neo4j.driver(
          this.config.boltUri,
          neo4j.auth.basic(this.config.boltUser || '', this.config.boltPassword || '')
        );
      } catch (e) {
        this.boltDriver = null;
      }
    }
  }

  public getSDK(): OfficialHydraSDK {
    return this.sdkClient;
  }

  public getBoltDriver(): Driver | null {
    return this.boltDriver;
  }

  /**
   * Execute OpenCypher query directly against HydraDB Bolt endpoint
   */
  public async executeCypher(query: string, params: Record<string, any> = {}): Promise<any[]> {
    if (!this.boltDriver) {
      return [];
    }

    const session = this.boltDriver.session();
    try {
      const result = await session.run(query, params);
      return result.records.map((r) => r.toObject());
    } catch (e) {
      console.warn('HydraDB Bolt Query notice:', (e as Error).message);
      return [];
    } finally {
      await session.close();
    }
  }

  /**
   * Query HydraDB Context / Memory layer via official @hydradb/sdk
   */
  public async queryContext(queryText: string, options: any = {}) {
    try {
      return await this.sdkClient.query({
        query: queryText,
        ...options,
      });
    } catch (e) {
      console.warn('HydraDB SDK query notice:', (e as Error).message);
      return null;
    }
  }

  public getStatus() {
    return {
      sdk_installed: true,
      sdk_version: '2.1.2',
      package: '@hydradb/sdk',
      bolt_connectivity: Boolean(this.boltDriver),
      bolt_uri: this.config.boltUri,
      target_repo: 'https://github.com/hydra-db/hydradb',
      connected: this.isConnected,
    };
  }
}

export const officialHydraAdapter = new HydraDBOfficialAdapter();
