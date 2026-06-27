# PersonifAI - System Architecture

This document outlines the Three-Tier Architecture of the PersonifAI platform.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph "1. Presentation Tier (Frontend)"
        A[Next.js Client Components] -->|HTTP/JSON| B[API Routes]
        A1[Tailwind CSS 4 & UI Components]
        A2[AI Chat Interface]
    end

    subgraph "2. Logic Tier (Backend / Application)"
        B[Next.js API Routes /src/app/api]
        B -->|Gemini SDK| C[Google Gemini AI API]
        B -->|Prisma Client| D[Prisma ORM]
    end

    subgraph "3. Data Tier (Database)"
        D -->|SQL Queries| E[(PostgreSQL Database)]
        E1[Task Model]
        E2[SubStep Model]
    end

    %% Styling
    style A fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style B fill:#bbf,stroke:#333,stroke-width:2px,color:#000
    style E fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    style C fill:#f96,stroke:#333,stroke-width:2px,color:#000
    style D fill:#6cf,stroke:#333,stroke-width:2px,color:#000
    style A1 fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style A2 fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style B1 fill:#bbf,stroke:#333,stroke-width:2px,color:#000
    style E1 fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    style E2 fill:#bfb,stroke:#333,stroke-width:2px,color:#000
```

---

## 2. Data Flow Diagrams (DFD)

### 2.1 Level 0: System Context Diagram
The Level 0 DFD shows the system as a single process interacting with external entities.

```mermaid
graph LR
    User((User))
    System[("PersonifAI System")]
    Gemini(("Google Gemini AI"))
    DB[(PostgreSQL Database)]

    User -->|Learning Goal / Interaction| System
    System -->|Task Breakdown & Progress| User
    
    System <-->|Prompt & JSON Response| Gemini
    System <-->|CRUD Task Data| DB

    style System fill:#f9f,stroke:#333,stroke-width:4px,color:#000
    style User fill:#fff,stroke:#333,stroke-width:2px,color:#000
    style Gemini fill:#fff,stroke:#333,stroke-width:2px,color:#000
    style DB fill:#fff,stroke:#333,stroke-width:2px,color:#000
```

### 2.2 Level 1: Internal Module Data Flow
The Level 1 DFD breaks down the system into its core functional modules, showcasing the dynamic retrieval of course material via Gemini's File API.

```mermaid
graph TD
    User((User))
    Admin((Admin/Educator))
    
    subgraph "PersonifAI System"
        P1[1.0 Chat & Interaction]
        P2[2.0 AI Processing]
        P3[3.0 Task Management]
        P4[4.0 Dashboard & Reporting]
        P5[5.0 Course Upload Script]
    end

    Gemini(("Google Gemini AI"))
    GF[(Gemini File API Store)]
    D1[("Tasks & SubSteps Store")]
    C1[(Local Course PDFs)]

    User -->|User Query| P1
    P1 -->|Clarification / Preview| User
    
    P1 -->|Refined Request| P2
    P2 <-->|API Call with PDF fileUri| Gemini
    P2 -->|Structured Task Data| P1
    
    Admin -->|Run upload-file.mjs| P5
    P5 -->|Read PDF Syllabi| C1
    P5 -->|Upload & Map URIs| GF
    P2 -.->|Reference File URIs| GF

    P1 -->|Approved Task| P3
    P3 -->|Store Task| D1
    
    P4 <-->|Fetch Progress| D1
    P4 -->|Visualized Metrics| User
    
    User -->|Mark Step Complete| P3
    P3 -->|Update Status| D1

    style P1 fill:#bbf,stroke:#333,color:#000
    style P2 fill:#bbf,stroke:#333,color:#000
    style P3 fill:#bbf,stroke:#333,color:#000
    style P4 fill:#bbf,stroke:#333,color:#000
    style P5 fill:#bbf,stroke:#333,color:#000
    style D1 fill:#bfb,stroke:#333,color:#000
```

---

## 3. Entity-Relationship Diagram (ERD)

The following diagram illustrates the relationship between the core entities, including the planned **User** entity for future implementation.

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    TASK ||--o{ SUBSTEP : contains
    USER {
        string id PK "Primary Key - System ID"
        string email "User Email"
        string name "Full Name"
        datetime createdAt "Join Date"
    }
    TASK {
        string id PK "Primary Key - System ID"
        string userId FK "Foreign Key - Owner Reference"
        string title "Learning Goal"
        json juice "Meta: Subject/Priority"
        datetime createdAt "Generation Date"
    }
    SUBSTEP {
        string id PK "Primary Key - System ID"
        string taskId FK "Foreign Key - Parent Reference"
        string title "Action Title"
        string content "Details or URL"
        boolean isCompleted "Done Status"
        StepType type "Step Category"
    }
```

---

## 4. Tier Breakdown

### 4.1 Presentation Tier (Frontend)
The user interface is built using **Next.js (App Router)** and **TypeScript**, ensuring a type-safe and performant experience.
- **UI Framework:** React with functional components.
- **Styling:** Tailwind CSS 4 for a modern, responsive design with dark mode support.
- **Core Interfaces:** 
    - **Landing Page:** Marketing site with conversion-focused sections.
    - **AI Assistant:** Interactive chat interface for task decomposition.
    - **Dashboard:** Management hub for tracking learning progress.

### 4.2 Logic Tier (Application)
The logic tier handles request routing, business logic, and external API orchestrations.
- **API Framework:** Next.js Route Handlers (Server-side).
- **AI Integration:** 
    - Integration with **Google Gemini AI** (`gemini-2.5-flash`).
    - **Context-Grounded Learning (Gemini File API):** Local course PDF study guides (`/Cources`) are uploaded to the Gemini File API using the helper script `upload-file.mjs`. When a user requests help with a task, the API route handler (`src/app/api/chat/route.ts`) maps the message context to the corresponding uploaded PDF URI and attaches it to the generation request.
    - Specialized system prompting to convert natural language and file context into structured JSON task previews with robust YouTube video URL extractors.
- **ORM:** **Prisma 7** manages the database abstraction, using driver adapters for serverless database compatibility.

### 4.3 Data Tier (Database)
Persistent storage for all user data and generated tasks.
- **Database:** **PostgreSQL (Neon Serverless)**.
- **Database Connection:** Leverages `@prisma/adapter-pg` with a serverless `pg` Connection Pool for high-performance query execution and reliable connection pooling.
- **Data Model:**
    - **Task:** Represents a broad learning goal. Includes a flexible `juice` JSON field for metadata (subject, priority).
    - **SubStep:** Actionable items linked to a task (text instructions, video URLs, or revision notes) supporting custom step categories: `TEXT`, `VIDEO`, `PHYSICAL`, and `REVISION`.
