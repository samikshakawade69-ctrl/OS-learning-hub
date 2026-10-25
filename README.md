# OS Learning Hub – Operating System Simulator

> **An interactive, student-friendly web application for mastering Operating Systems through visual simulations, step-by-step algorithms, diagrams, and exam revision guides.**

---

## 🌟 Overview

**OS Learning Hub** is designed for computer science and engineering students preparing for university exams, GATE, and lab practicals. Rather than reading static text, students can experiment with real algorithms, step through state transitions, inspect live registers/semaphores, and generate animated Gantt charts.

---

## 🚀 Key Features

### 1. Four Core OS Modules
- **Memory Management**: First Fit, Best Fit, Worst Fit, Paging, TLB, Segmentation, Internal/External Fragmentation, Compaction, FIFO, LRU, Optimal Page Replacement, Belady's Anomaly, and Thrashing.
- **Process Management**: Process States, PCB, Context Switching, Inter-Process Communication (IPC), CPU Scheduling Criteria, and full multi-algorithm scheduling.
- **Deadlock Management**: 4 Coffman Conditions, Deadlock Prevention, Avoidance, Detection & Recovery, Banker's Algorithm with Safe Sequences, Resource Allocation Graph (RAG) with cycle detection, and Starvation vs Livelock.
- **Process Synchronization**: Race Conditions, Critical Section Problem, Mutex Locks, Counting & Binary Semaphores, Monitors, Producer-Consumer (Bounded Buffer), Readers-Writers, Dining Philosophers, and Peterson's Algorithm.

### 2. Standard 10-Section Layout for Every Topic
Every subtopic follows a structured pedagogical format:
1. **Introduction**: Simple, beginner-friendly explanation.
2. **Why Is It Used?**: Real-world purpose and system rationale.
3. **How It Works**: Numbered step-by-step algorithm breakdown.
4. **Diagram**: ASCII/architectural flow diagram.
5. **Example**: Concrete scenario with worked-out numerical solution.
6. **Interactive Simulation**: Hands-on simulator with controls, step navigation, and live state visualization.
7. **Advantages & Disadvantages**: High-contrast pros and cons comparison.
8. **High-Yield Exam Notes**: Crucial formulas, exam traps, and definitions.
9. **Practice Questions**: Conceptual and numerical questions with expandable solutions.
10. **Quick Quiz**: Interactive multiple-choice questions with instant scoring and explanations.

### 3. Suite of Interactive Simulators
1. **CPU Scheduling Simulator**:
   - Algorithms: FCFS, SJF (Non-Preemptive), SRTF (Preemptive SJF), Priority (Non-Preemptive & Preemptive), Round Robin.
   - Animated Gantt chart with sweeping time needle and idle period markers.
   - Dynamic process queue: add/edit/delete Process ID, Arrival Time, Burst Time, Priority, and Time Quantum.
   - Comprehensive execution table: Completion Time (CT), Turnaround Time (TAT = CT - AT), Waiting Time (WT = TAT - BT), Response Time (RT).
   - Summary metrics: Average TAT, Average WT, CPU Utilization %, and Throughput.
   - Step-by-step execution log.
2. **Memory Allocation Simulator**:
   - Algorithms: First Fit, Best Fit, Worst Fit.
   - Configurable memory partition blocks (KB) and incoming process queue.
   - Visual physical memory layout showing allocated blocks, leftover holes, and internal/external fragmentation.
   - Step-by-step allocation tracking.
3. **Page Replacement Simulator**:
   - Algorithms: FIFO, Least Recently Used (LRU), and Optimal.
   - Configurable reference strings with presets (Textbook, Belady's Anomaly demo).
   - Frame selection (3, 4, 5 frames).
   - 2D grid matrix of frame states over time, Hit/Miss indicators, Hit Ratio %, and eviction reasoning.
4. **Banker's Algorithm & Safe Sequences**:
   - Configurable Allocation Matrix, Maximum Claim Matrix, and Available Resource Vector.
   - Real-time computation of the Need Matrix (`Need = Max - Allocation`).
   - Dijkstra's Safety Algorithm step-by-step trace yielding safe sequence `<P1, P3, ...>` or flagging unsafe state.
   - Interactive Resource-Request test tool.
5. **Resource Allocation Graph (RAG) Visualizer**:
   - Directed graph with Process circles and Resource rectangles (with instance dots).
   - Assignment edges (R → P) and Request edges (P → R).
   - Cycle detection highlighting single-instance vs multi-instance deadlock conditions.
6. **Producer-Consumer Problem (Bounded Buffer)**:
   - 5-slot circular buffer animation.
   - Live semaphore values: `mutex`, `empty`, and `full`.
   - Manual produce/consume buttons plus automated playback.
7. **Dining Philosophers Problem**:
   - Round table with 5 philosophers and 5 chopsticks.
   - States: Thinking, Hungry, Eating.
   - Naive Deadlock Demonstration mode vs Asymmetric/Resource Hierarchy deadlock-free solution.
8. **Readers-Writers Problem**:
   - Shared database access manager with active readers count, `read_count`, `rw_mutex`, and waiting queues.
   - Demonstrates concurrent reader access and writer exclusivity.
9. **Peterson's Algorithm Trace**:
   - 2-process critical section solution with `flag[0]`, `flag[1]`, and `turn`.
   - Step-by-step execution trace showing how mutual exclusion is preserved under contention.
10. **Paging & Address Translation Calculator**:
    - Converts CPU logical address to physical RAM address using page size (1KB, 2KB, 4KB), page table mapping, and TLB hit/miss check.

### 4. Student Learning Dashboard
- Tracks overall syllabus completion percentage.
- Tracks quiz performance and scores.
- Local bookmarking for quick exam revision.
- Full Light Mode and Dark Mode support.
- Responsive design across desktop, tablet, and mobile with collapsible navigation drawer.

---

## 🛠️ Project Structure

```
├── index.html                   # HTML entry point with metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Master application orchestrator
    ├── index.css                # Tailwind CSS v4 styling & dark theme
    ├── types/
    │   └── os.ts                # TypeScript interfaces and domain models
    ├── data/
    │   ├── categories.ts        # Category index and aggregations
    │   ├── memoryData.ts        # Memory Management subtopics dataset
    │   ├── processData.ts       # Process Management subtopics dataset
    │   ├── deadlockData.ts      # Deadlock Management subtopics dataset
    │   └── syncData.ts          # Process Synchronization subtopics dataset
    └── components/
        ├── common/
        │   ├── Navbar.tsx       # Search, bookmarks, theme toggle, stats
        │   ├── Sidebar.tsx      # Grouped category accordion & syllabus navigation
        │   ├── Breadcrumb.tsx   # Breadcrumb trail (Home > Category > Topic)
        │   └── TopicLayout.tsx  # Standard 10-section student topic layout
        ├── dashboard/
        │   ├── HomeDashboard.tsx          # 4 colorful category cards & quick links
        │   ├── CategoryView.tsx           # Category subtopics grouped by section
        │   └── LearningDashboardModal.tsx # Progress stats & bookmarked topics
        └── simulators/
            ├── CpuSchedulingSimulator.tsx     # FCFS, SJF, SRTF, Priority, RR with Gantt
            ├── MemoryAllocationSimulator.tsx  # First Fit, Best Fit, Worst Fit
            ├── PageReplacementSimulator.tsx   # FIFO, LRU, Optimal with 2D grid
            ├── BankersSimulator.tsx           # Banker's safe sequence & request tester
            ├── RagSimulator.tsx               # Resource Allocation Graph visualizer
            ├── ProducerConsumerSimulator.tsx  # Bounded buffer & semaphores
            ├── DiningPhilosophersSimulator.tsx# 5 philosophers table & deadlock demo
            ├── ReadersWritersSimulator.tsx    # Shared database reader/writer lock
            ├── PetersonAlgorithmSimulator.tsx # 2-process flag & turn trace
            └── PagingAddressSimulator.tsx     # Logical to physical MMU translator
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm (version 9+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the application.

### 3. Build for Production
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Run Type Checking / Linting
```bash
npm run lint
```

---

## 📜 License
Apache-2.0
