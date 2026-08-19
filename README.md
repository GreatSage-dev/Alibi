# Alibi: Temporal Graph Verification Layer for Autonomous AI Agents

<div align="center">
  
  [![Hackathon](https://img.shields.io/badge/Hack%20Hydra-2026-blueviolet?style=for-the-badge&logo=github)](https://github.com/GreatSage-dev/Alibi)
  [![Track](https://img.shields.io/badge/Track%2003-Memory%20%26%20Context-FF6B6B?style=for-the-badge)](https://github.com/GreatSage-dev/Alibi)
  [![Database](https://img.shields.io/badge/Graph%20DB-HydraDB%20%2F%20SlateDB-00C853?style=for-the-badge)](https://github.com/GreatSage-dev/Alibi)
  [![Licence](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://github.com/GreatSage-dev/Alibi)

  <h3><i>"Proving what your AI agents actually knew at the moment of decision."</i></h3>

  <p align="center">
    <a href="#-the-pitch-why-vector-memory-fails-agents">Executive Summary</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-mathematical-verification-models">Formal Spec</a> •
    <a href="#-the-four-deterministic-verdicts">Verdicts</a> •
    <a href="#-interactive-developer-console">UI Walkthrough</a> •
    <a href="#-quickstart--installation">Quickstart</a> •
    <a href="#-loophole-safeguards-suite">Safeguards</a>
  </p>
</div>

---

## 💡 The Pitch: Why Vector Memory Fails Agents

In autonomous agent networks, AI agents make critical, irreversible decisions:
* *"I executed the user refund according to active safety standards."*
* *"I updated the database schema in compliance with our architecture specifications."*
* *"Task complete: Microservice deployed to staging."*

Today, traditional **vector databases** perform similarity search but are **chronologically blind**:

### Scenario A: The Supersession Trap (Beat 1)
An agent queries vector memory for API gateway guidelines on August 14. The vector database returns `ADR-17` (GraphQL Integration) with **94% cosine similarity**. However, `ADR-17` was superseded by `ADR-24` (REST Migration) 117 days prior. 
* **The Catastrophe:** The agent builds an obsolete interface, breaking downstream services. Similarity search was successful, but **chronologically invalid**.

### Scenario B: The Relational Cross-Decision Conflict (Beat 2)
Support Agent #104 approves a $4,500 refund for `Customer #4471` (Marcus Vance). It reviews its own flat log history and sees no issues.
* **The Catastrophe:** It misses that Risk Sentinel #802 (an independent agent in another session) placed an active **Fraud Lock** on `Customer #4471` 3 hours earlier. 

**Alibi resolves this by intercepting agent decisions and validating them deterministically across HydraDB temporal knowledge graphs.**

---

## 🏛️ System Architecture

Alibi tracks state by mapping agent execution trails into a structured directed acyclic graph (DAG) persisted in **HydraDB** (built on SuiteSparse-GraphBLAS and SlateDB S3 storage).

```
                      [ Agent Decision Intercepted ]
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │       Alibi Verification Engine      │
                 │   - Query 1: Temporal Supersession   │
                 │   - Query 2: Relational Conflict     │
                 │   - Safeguard: Causality Check       │
                 └──────────────────┬───────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────────────┐               ┌───────────────────────────────────┐
│     HydraDB (Graph Database)      │               │       SlateDB Storage Layer       │
│  - SuiteSparse GraphBLAS Engine   │               │  - Immutable LSM-Tree (S3)        │
│  - Point-in-Time Temporal Slices  │               │  - Cryptographic Merkle Receipts  │
│  - Multi-Hop Supersession Paths   │               │  - SHA-256 State Verification     │
└───────────────────────────────────┘               └───────────────────────────────────┘
```

### 1. The 7 Graph Node Types
1. **`Agent`**: Represents the autonomous runner (identity, LLM model version, configuration).
2. **`Entity`**: Represents shared domain state (`CUSTOMER`, `SERVICE`, `WALLET`). Links disparate sessions.
3. **`Decision`**: The choice made by an agent ($t = \text{timestamp}$, intent, rationale).
4. **`Evidence`**: Architecture guidelines, specifications, ADRs, compliance constraints.
5. **`Action`**: Tool invocations, code modifications, or database transactions.
6. **`Outcome`**: Concrete execution output (status: `SUCCESS`, `FAILURE`, `FLAGGED`).
7. **`Claim`**: The assertion of correctness or completion made by the agent.

### 2. The 6 Native Relational & Temporal Edges
* **`Decision --[retrieved]--> Evidence`**: Context ingested by agent at runtime.
* **`Evidence --[superseded_by]--> Evidence`**: Links historical standards to their replacements.
* **`Decision --[concerns]--> Entity`**: Relational link mapping agent intents to domain objects.
* **`Decision --[led_to]--> Action`**: Relational chain of intent to execution.
* **`Action --[produced]--> Outcome`**: Verifies if the action succeeded or failed.
* **`Claim --[verified_against]--> Evidence`**: Anchors agent claims to ground truths.

---

## 🧮 Mathematical Verification Models

Alibi replaces loose, hallucination-prone "LLM judges" with strict mathematical proofs evaluated against the HydraDB state:

### 1. Temporal Validity (Query 1)
For a decision $d$ that retrieved evidence $e$, let $S(e)$ be the directed supersession path such that:
$$e \xrightarrow{\text{superseded\_by}^*} e'$$
The retrieved evidence $e$ is **valid** if and only if no superseding node $e'$ was committed prior to or at the decision timestamp $t(d)$:
$$\nexists e' \in S(e) \quad \text{s.t.} \quad t(e') \le t(d)$$
If such an $e'$ exists, the context is flagged as **`STALE`** with a gap delta of:
$$\Delta_{\text{stale}} = t(d) - t(e')$$

> 💡 **Plain English Translation:** An agent cannot act on a document (like a specification) if a newer version was already published before the agent made its decision. If they do, the action is marked **STALE** and the exact delay is calculated (e.g., "117 days out-of-date").

### 2. Relational Consistency (Query 2)
For a decision $d$ concerning entity $E$, let $D_{\text{prior}}(E)$ be the set of decisions such that:
$$d' \xrightarrow{\text{concerns}} E \quad \text{and} \quad t(d') < t(d)$$
The decision $d$ is **conflict-free** if and only if no prior decision $d'$ placed a restrictive lock or fraud flag on $E$:
$$\nexists d' \in D_{\text{prior}}(E) \quad \text{s.t.} \quad \text{tag}(E) = \text{"fraud-watch"} \lor \text{status}(\text{outcome}(d')) = \text{"FLAGGED"}$$
If such a condition exists, the verdict is flagged as **`CONFLICTED`**.

> 💡 **Plain English Translation:** An agent cannot approve a transaction on a customer account or wallet if a prior decision (from another agent or session) has already flagged that specific account for fraud or restricted its access. If they try, the system intercepts and blocks it as **CONFLICTED**.

---

## 🔬 The Four Deterministic Verdicts

| Verdict | Graphical Trigger Condition | Real Scenario Example |
| :--- | :--- | :--- |
| **`CLEAR`** | Valid context retrieved, no entity conflicts, actions verified. | Agent retrieves active `ADR-24` and writes a compliant REST routing module. |
| **`STALE`** | $t(e') \le t(d)$ along `Evidence --[superseded_by*]--> Evidence` | Agent uses GraphQL `ADR-17` on Aug 14, blind to `ADR-24` committed on Apr 19 (**117-day gap**). |
| **`CONFLICTED`** | Prior decision on concerns-entity is flagged or restricted. | Support agent dispatches $4,500 refund, violating Risk Sentinel's active Fraud Lock. |
| **`UNVERIFIABLE`** | Insufficient graph history, causality failure, or circular refs. | Agent claims task completion, but no verifiable actions/outcomes exist. |

---

## 💻 Interactive Developer Console

Alibi provides a high-fidelity visual console built with a modern light-fintech design:

* **Landing Page**: Implements custom, floating 3D canvas modules demonstrating the **Verification Shield**, **Temporal Chains** (with real-time animated node packet flows), and holographic **Proof Seals**.
* **Temporal Tab (Beat 1)**: Allows simulating spec queries to witness the 117-day staleness gap warning.
* **Relational Tab (Beat 2)**: Visualizes wallet dispute resolutions and quarantine overrides.
* **Trace DAG (Beat 3)**: A full-screen canvas powered by `@xyflow/react` featuring:
  * **Point-in-Time Scrubber**: Slide back in time to reconstruct the exact database state at any historic moment.
  * **Live OpenCypher Query Inspector**: View the raw GraphBLAS queries executed against the graph.
  * **1-Click Proof Receipt Downloader**: Export immutable cryptographic JSON validation tokens.

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
Ensure you have Node.js (v18+) and Docker installed.

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/GreatSage-dev/Alibi.git
cd Alibi
npm install
```

### 3. Spin up Official HydraDB Container
Start the official HydraDB image exposing Bolt connection endpoints:
```bash
docker compose up -d
```
This deploys `ghcr.io/hydra-db/hydradb:latest` running Neo4j/Bolt graph services on `bolt://localhost:7687`.

### 4. Run the Verification Tests
Execute the local and integration test suite:
```bash
npm test
```

**Raw Test Suite Diagnostics (11/11 Passing):**
```text
▶ Alibi: Temporal Graph Verification Layer for AI Agents
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

✔ Alibi: Temporal Graph Verification Layer for AI Agents (492.5ms)
ℹ tests 11
ℹ suites 1
ℹ pass 11
ℹ fail 0
```

### 5. Launch the Web Console
Compile the optimized production build and launch the server:
```bash
npm run build
npm run start
```
Navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 🛡️ Loophole Safeguards Suite

Alibi incorporates three state-of-the-art protections against common agent graph hacks:

1. **Cycle Prevention:** Detects and flags cyclic supersession references (`A -> B -> A`), returning `UNVERIFIABLE` to avoid infinite traversal loops.
2. **Causality Check:** Prevents agents from retrieving future-dated evidence relative to the decision timestamp (blocking "time-travel" context exploits).
3. **Outcome Enforcement:** Verifies that agent claims of `TASK_COMPLETION` are backed by successful Outcomes, immediately flagging any `FAILURE` outputs.

---

## 👥 Hack Hydra 2026 Submission Team
* **Project**: Alibi (Temporal Graph Verification Layer)
* **Track**: Track 03 — Memory & Context Retrieval
* **Target Prize**: Grand Champion & Best Use of HydraDB

*Licensed under the MIT License - Hack Hydra 2026.*
