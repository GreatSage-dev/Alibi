# Alibi: Temporal Graph Verification Layer for Autonomous AI Agents

> 🏆 **Hack Hydra 2026** — *Track 03: Memory & Context Retrieval*  
> ⚡ **Best Use of HydraDB** (SuiteSparse-GraphBLAS · SlateDB S3 Storage · Temporal Versioning)

---

## 🎯 Executive Summary: Why Vector Memory Fails Agents

In multi-agent and long-running autonomous workflows, AI agents make high-stakes claims:
- *"I adhered to the current architecture specification."*
- *"I executed the user refund according to active security standards."*
- *"Task complete: Microservice deployed to staging."*

Today, traditional vector databases perform **similarity search without chronology**. 
1. **The Supersession Trap (Beat 1)**: An agent queries for API gateway guidelines on August 14, 2026. The vector database returns `ADR-17` (GraphQL) with 94% cosine similarity, completely blind to the fact that `ADR-24` (REST Migration) superseded `ADR-17` 117 days prior.
2. **Cross-Session Relational Conflict (Beat 2)**: Support Agent #104 approves a $4,500 refund for Customer #4471 (Marcus Vance). Flat replay logs only check Agent #104 against itself, missing that Risk Sentinel #802 flagged Customer #4471 for account takeover 3 hours earlier in a separate session.

**Alibi solves this by intercepting agent decisions and verifying them deterministically across HydraDB temporal knowledge graphs.**

---

## 🏛️ System Architecture

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │               Alibi Verification Engine                │
                                    │    (Query 1: Temporal  ·  Query 2: Relational)          │
                                    └──────────────────────────┬─────────────────────────────┘
                                                               │
                                         ┌─────────────────────┴─────────────────────┐
                                         ▼                                           ▼
                       ┌───────────────────────────────────┐       ┌───────────────────────────────────┐
                       │       HydraDB Graph Layer         │       │       SlateDB Storage Layer       │
                       │   - SuiteSparse GraphBLAS Traversal│       │   - LSM-Tree Object Store (S3)    │
                       │   - Point-in-Time Temporal Slices │       │   - Immutable SST Snapshots       │
                       │   - Multi-Hop Supersession Chains │       │   - Cryptographic Merkle Proofs   │
                       └───────────────────────────────────┘       └───────────────────────────────────┘
```

### 1. The 7 Graph Node Types
- **`Agent`**: Autonomous actor (model, version, session ID).
- **`Entity`**: Shared domain object (`CUSTOMER`, `SERVICE`, `POLICY`, `WALLET`). Connects decisions across agents.
- **`Decision`**: Timestamped choice made by an agent ($t = \text{timestamp}$, intent, rationale).
- **`Evidence`**: Architecture specifications, ADRs, RFCs, compliance policies.
- **`Action`**: Concrete tool calls, code modifications, payment authorizations.
- **`Outcome`**: Execution traces, HTTP diffs, test outputs.
- **`Claim`**: Formal statement of fact made by the agent.

### 2. The 6 Native Relational & Temporal Edges
- **`Decision --[retrieved]--> Evidence`**: Context ingested by agent at runtime.
- **`Evidence --[superseded_by]--> Evidence`**: **Core temporal chain** linking historical standards to their replacements.
- **`Decision --[concerns]--> Entity`**: **Relational bridge** linking disparate agents to the same shared state.
- **`Decision --[led_to]--> Action`**: Causal execution link.
- **`Action --[produced]--> Outcome`**: Concrete verifiable output.
- **`Claim --[verified_against]--> Evidence`**: Target ground truth assertion.

---

## 🔬 Four Deterministic Verification Verdicts

Unlike non-deterministic LLM-as-a-judge evaluators, Alibi produces **100% deterministic mathematical proofs**:

| Verdict | Trigger Condition | Example Scenario |
| :--- | :--- | :--- |
| **`STALE`** | $t_{\text{superseded}} \le t_{\text{decision}}$ along `Evidence --[superseded_by*]--> Evidence` | Agent built GraphQL client on Aug 14; superseded by ADR-24 on Apr 19 (**117-day staleness gap**). |
| **`CONFLICTED`** | Prior decision on shared `Entity` has conflicting tag / fraud lock ($t_{\text{prior}} < t_{\text{decision}}$) | Support Agent approves refund on Customer #4471, contradicting Risk Sentinel's active Fraud Lock. |
| **`UNVERIFIABLE`** | Claim lacks causal `Action` or `Outcome` nodes in the HydraDB graph | Agent claims *"Canary deployed"* with zero execution graph backing (**Strict Abstention Guarantee**). |
| **`CLEAR`** | Active evidence chain validated, no entity conflicts, all causal links verified | Agent retrieves active ADR-24 and generates compliant OpenAPI endpoints. |

---

## ⚡ Core HydraDB & SlateDB Innovations Showcase

### 1. Point-in-Time "Time-Travel" Graph Scrubber
HydraDB enables time-slice state reconstruction via `client.getTemporalSnapshot(timestamp)`.
- **Mar 15, 2026**: `ADR-17` is the active company standard; `ADR-24` does not exist.
- **May 01, 2026**: `ADR-24` is published, creating a `superseded_by` edge.
- **Aug 14, 2026**: Agent action triggers verification; Alibi proves the agent acted on obsolete data.

### 2. SuiteSparse GraphBLAS Multi-Hop Traversal
Alibi runs N-hop recursive traversals:
```cypher
// Query 1: Temporal Multi-Hop Supersession Traversal
MATCH (d:Decision {id: $decision_id})-[r:retrieved]->(e:Evidence)
MATCH path = (e)-[:superseded_by*1..5]->(latest:Evidence)
WHERE latest.timestamp <= d.timestamp
RETURN d.id, e.title AS stale_spec, latest.title AS active_spec,
       duration.between(e.timestamp, latest.timestamp).days AS staleness_gap_days;
```

### 3. Immutable Cryptographic Receipts on SlateDB
Every verification result commits an audit payload pointing to an immutable `.sst` snapshot on cloud object storage, generating a SHA-256 Merkle root for **EU AI Act Article 12 compliance**.

---

## 🚀 Quickstart & Testing

### 1. Clone and Install
```bash
git clone https://github.com/your-username/alibi.git
cd alibi
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
**Test Suite Results (11/11 Passing):**
```
✔ Track 03 Core Test: Detects Stale Context via Temporal Supersession Chain (246.8ms)
✔ Detects Silent Divergence when code actions violate retrieved spec (29.7ms)
✔ Abstains cleanly on False Completion when action trail is missing (12.1ms)
✔ Verifies compliant runs when active evidence and compliant actions align (21.0ms)
✔ Resolves cross-session aliases to canonical entity nodes (3.1ms)
✔ Provides accurate temporal snapshot queries in HydraDB (16.8ms)
✔ Includes SlateDB storage proof in verification result (20.9ms)
✔ Integrates official @hydradb/sdk and Neo4j Bolt connectivity (34.4ms)
✔ Detects circular reference loophole and marks it UNVERIFIABLE (50.6ms)
✔ Detects future-dated evidence causality violation loophole and marks it UNVERIFIABLE (37.0ms)
✔ Detects failed outcomes on TASK_COMPLETION and marks it CONFLICTED (13.6ms)
```

### 3. Launch with Docker Compose (Live HydraDB Server Connection)
To connect to the official HydraDB graph database container and SlateDB volume storage:
```bash
docker compose up -d
```
This runs the official `ghcr.io/hydra-db/hydradb:latest` container exposing Bolt protocol on port `7687` for OpenCypher query execution.

### 4. Launch the Interactive Application
```bash
npm run build
npm run start
```
Open **[http://localhost:3000](http://localhost:3000)** to explore:
* **Landing Page**: Outcrowd clean/light 3D visual language with custom Verification Shield, Temporal Chain, and Proof Seal.
* **Developer Console (`/dashboard`)**:
  * **Temporal Tab (Beat 1)**: Interactive ADR supersession tester.
  * **Relational Tab (Beat 2)**: Cross-decision entity dispute resolver.
  * **Trace DAG**: Interactive ReactFlow canvas with **Point-in-Time Scrubber**, **Live Cypher Query Inspector**, and **1-Click Proof Receipt (.json) Downloader**.
  * **Simulate Tab**: Real-time agent execution pipeline.

---

## 👥 Hack Hydra 2026 Submission Team
* **Project**: Alibi (Temporal Graph Verification Layer)
* **Track**: Track 03 — Memory & Context Retrieval
* **Target Prize**: Grand Champion & Best Use of HydraDB

*Licensed under MIT for Hack Hydra 2026.*
