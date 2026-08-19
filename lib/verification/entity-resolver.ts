/**
 * Entity Resolution Engine for Alibi & HydraDB
 * 
 * Hack Hydra Track 03 Requirement:
 * "same evidence referenced differently across sessions
 *  (e.g. 'the ADR about GraphQL' vs 'ADR-17' vs 'GraphQL Spec')
 *  must resolve to the same canonical node."
 */

export interface EntityAliasMap {
  canonical_id: string;
  canonical_title: string;
  aliases: string[];
  keywords: string[];
}

export class EntityResolver {
  private aliasRegistry: Map<string, EntityAliasMap> = new Map();

  constructor() {
    this.seedDefaultAliases();
  }

  private seedDefaultAliases() {
    this.registerEntity({
      canonical_id: 'entity:adr-17-api-arch',
      canonical_title: 'ADR-17: API Gateway Protocol (GraphQL)',
      aliases: [
        'ADR-17',
        'ADR 17',
        'adr-17',
        'the ADR about GraphQL',
        'the GraphQL doc',
        'GraphQL Architecture Spec',
        'API Architecture v1.0',
        'GraphQL Decision Record',
        'ADR-017',
      ],
      keywords: ['graphql', 'adr-17', 'query', 'resolvers', 'apollo', 'schema']
    });

    this.registerEntity({
      canonical_id: 'entity:adr-24-api-arch-supersession',
      canonical_title: 'ADR-24: REST Migration and GraphQL Deprecation',
      aliases: [
        'ADR-24',
        'ADR 24',
        'adr-24',
        'REST Migration ADR',
        'the new REST spec',
        'REST Gateway Decision',
        'API Architecture v2.0',
        'ADR-024',
      ],
      keywords: ['rest', 'adr-24', 'http', 'endpoints', 'json-api', 'openapi', 'restful']
    });

    this.registerEntity({
      canonical_id: 'entity:sec-auth-spec-09',
      canonical_title: 'SEC-09: Token Header Authentication Standard',
      aliases: [
        'SEC-09',
        'SEC 09',
        'Security Spec 09',
        'Auth Header Spec',
        'Bearer Token Requirement',
        'RFC-Security-09',
      ],
      keywords: ['authorization', 'bearer', 'sec-09', 'jwt', 'header', 'token']
    });

    this.registerEntity({
      canonical_id: 'entity:deploy-pipeline-spec',
      canonical_title: 'CI/CD-04: Production Deployment Pipeline and Artifact Verification',
      aliases: [
        'CI/CD-04',
        'Deployment Pipeline Spec',
        'Prod Release Criteria',
        'Deploy Spec v4',
      ],
      keywords: ['deployment', 'ci/cd', 'artifact', 'sha256', 'release', 'production']
    });
  }

  public registerEntity(entry: EntityAliasMap) {
    this.aliasRegistry.set(entry.canonical_id, entry);
  }

  /**
   * Resolves an arbitrary string reference or query to its canonical Entity ID
   */
  public resolve(query: string): { canonical_id: string; title: string; confidence: number } | null {
    const cleanQuery = query.trim().toLowerCase();
    const entries = Array.from(this.aliasRegistry.entries());

    // 1. Direct exact alias match
    for (const [canonical_id, entry] of entries) {
      for (const alias of entry.aliases) {
        if (alias.toLowerCase() === cleanQuery) {
          return { canonical_id, title: entry.canonical_title, confidence: 1.0 };
        }
      }
    }

    // 2. Substring & normalized regex match
    for (const [canonical_id, entry] of entries) {
      for (const alias of entry.aliases) {
        const normAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normQuery = cleanQuery.replace(/[^a-z0-9]/g, '');
        if (normQuery.includes(normAlias) || normAlias.includes(normQuery)) {
          return { canonical_id, title: entry.canonical_title, confidence: 0.92 };
        }
      }
    }

    // 3. Keyword density match
    let bestMatch: { canonical_id: string; title: string; score: number } | null = null;
    for (const [canonical_id, entry] of entries) {
      let hits = 0;
      for (const kw of entry.keywords) {
        if (cleanQuery.includes(kw)) {
          hits++;
        }
      }
      const score = hits / Math.max(entry.keywords.length, 1);
      if (score > 0.25 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { canonical_id, title: entry.canonical_title, score };
      }
    }

    if (bestMatch) {
      return {
        canonical_id: bestMatch.canonical_id,
        title: bestMatch.title,
        confidence: Math.min(0.85, 0.5 + bestMatch.score * 0.5),
      };
    }

    return null;
  }
}

export const globalEntityResolver = new EntityResolver();
