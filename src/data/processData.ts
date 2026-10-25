import { SubTopic } from '../types/os';

export const processSubtopics: SubTopic[] = [
  // A. Process Basics
  {
    id: 'process-basics-pcb-states',
    title: 'Process Basics, States & PCB',
    section: 'A. Process Basics',
    categoryId: 'process-management',
    shortDescription: 'Discover what a process really is, explore the 5/7-state model, and inspect the fields of a Process Control Block (PCB).',
    badge: 'Fundamental',
    content: {
      introduction: 'A process is simply a "program in execution". While a program is a passive entity stored on disk (like a binary file), a process is an active entity loaded into RAM with its own Program Counter, CPU registers, stack, and heap.',
      whyUsed: 'Processes allow multiple tasks to run concurrently (multitasking), isolate programs from each other for security and stability, and enable efficient hardware utilization.',
      howItWorks: [
        'New: The process is being created and loaded into memory.',
        'Ready: The process is in RAM, waiting to be assigned to a CPU by the scheduler.',
        'Running: CPU instructions are currently being executed for this process.',
        'Waiting / Blocked: The process is waiting for some event (such as I/O completion or signal).',
        'Terminated: The process has finished execution and OS cleans up resources.'
      ],
      diagramDescription: '[New] -> [Ready] <---> [Running] -> [Terminated]\n                ^           |\n                |--[Waiting]<',
      example: {
        title: 'Program vs Process',
        scenario: 'You have Google Chrome installed on your SSD (Program). You double-click the icon 3 times.',
        solution: 'There is only 1 Program on disk, but 3 distinct Processes created in RAM, each with its own PID, PCB, registers, and memory space.'
      },
      advantages: [
        'Memory protection: Each process has its own isolated address space; one crash doesn\'t bring down others.',
        'Concurrency: Maximizes CPU and I/O parallelism.'
      ],
      disadvantages: [
        'Creating and context-switching between processes is heavier than lightweight threads.',
        'Inter-process communication (IPC) requires OS intervention and overhead.'
      ],
      examNotes: [
        'PCB (Process Control Block) contains: PID, Process State, Program Counter, CPU Registers, Scheduling Info, Memory Limits, and Open File Descriptors.',
        'PCB is stored in protected kernel memory.',
        'Context Switching time is pure overhead because the CPU does no useful user work during switching.'
      ],
      practiceQuestions: [
        {
          question: 'What is the primary information stored inside a Process Control Block (PCB)?',
          answer: 'Process ID, Process State (Ready/Running/Waiting), Program Counter (PC), CPU registers, CPU scheduling info, Memory management info (base/limit), and Accounting/I/O status.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the fundamental difference between a program and a process?',
          options: [
            'A program is written in C; a process in Java',
            'A program is a passive file on disk; a process is an active entity executing in memory',
            'A process is stored in BIOS; a program in RAM',
            'They are exact synonyms'
          ],
          correctAnswer: 1,
          explanation: 'A program is passive code residing on storage; once loaded and executing with CPU state, it becomes a dynamic process.'
        },
        {
          id: 'q2',
          question: 'In which process state is a process waiting for an I/O operation to complete?',
          options: ['Ready', 'Running', 'Waiting / Blocked', 'Terminated'],
          correctAnswer: 2,
          explanation: 'The Waiting/Blocked state holds processes that cannot execute until an external event (e.g. keyboard input, disk read) finishes.'
        }
      ]
    }
  },

  // B. Process Scheduling
  {
    id: 'scheduling-basics-criteria',
    title: 'Scheduling Basics & Preemption',
    section: 'B. Process Scheduling',
    categoryId: 'process-management',
    shortDescription: 'Master preemptive vs non-preemptive scheduling, turnaround time, waiting time, and CPU scheduling criteria.',
    badge: 'Core Theory',
    content: {
      introduction: 'CPU Scheduling is the process by which the OS allocates the CPU to ready processes. When multiple processes are eligible to run, the short-term scheduler (CPU scheduler) picks one from the ready queue.',
      whyUsed: 'Maximizes CPU utilization, maximizes throughput, minimizes waiting time and response time, and ensures fair allocation among competing jobs.',
      howItWorks: [
        'Non-Preemptive Scheduling: Once the CPU has been allocated to a process, the process holds the CPU until it terminates or switches to the waiting state (e.g. FCFS, non-preemptive SJF).',
        'Preemptive Scheduling: The CPU can be interrupted and taken away from a running process by the OS scheduler (e.g., when a higher priority process arrives, or timer interrupt in Round Robin).',
        'Five Core Scheduling Criteria: CPU Utilization (%), Throughput (processes/unit time), Turnaround Time (TAT = CT - AT), Waiting Time (WT = TAT - BT), Response Time (RT = First Run Time - AT).'
      ],
      diagramDescription: 'Non-Preemptive: [Process A runs to completion] -> [Process B runs]. Preemptive: [Process A (2ms)] -> [Timer Interrupt: Process B runs (2ms)] -> [Resume A].',
      example: {
        title: 'Turnaround Time vs Waiting Time',
        scenario: 'Process P arrives at Time 0, requires Burst Time 6, and completes at Time 10.',
        solution: '• Completion Time (CT) = 10\n• Turnaround Time (TAT) = CT - Arrival Time = 10 - 0 = 10 ms.\n• Waiting Time (WT) = TAT - Burst Time = 10 - 6 = 4 ms.\n(P was in the ready queue waiting for 4 ms total).'
      },
      advantages: [
        'Preemptive scheduling provides quick response times for interactive user systems.',
        'Non-preemptive is simple and avoids race conditions on shared kernel data structures.'
      ],
      disadvantages: [
        'Preemptive scheduling introduces context-switch overhead and race conditions on shared resources.',
        'Non-preemptive allows buggy or long processes to monopolize the CPU (starvation of short jobs).'
      ],
      examNotes: [
        'Golden Formula 1: TAT = CT - AT (Turnaround Time = Completion Time - Arrival Time)',
        'Golden Formula 2: WT = TAT - BT (Waiting Time = Turnaround Time - Burst Time)',
        'Golden Formula 3: RT = Time of First CPU Allocation - AT'
      ],
      practiceQuestions: [
        {
          question: 'If a process arrives at time 2 with burst time 5, and finishes at time 12, calculate its TAT and WT.',
          answer: 'TAT = CT - AT = 12 - 2 = 10. WT = TAT - BT = 10 - 5 = 5.',
          type: 'numerical'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the formula to calculate Waiting Time (WT)?',
          options: [
            'WT = CT + AT',
            'WT = TAT - Burst Time (BT)',
            'WT = Arrival Time - Burst Time',
            'WT = Completion Time / 2'
          ],
          correctAnswer: 1,
          explanation: 'Waiting Time is the total time spent in the ready queue: WT = Turnaround Time (TAT) - Burst Time (BT).'
        },
        {
          id: 'q2',
          question: 'Under preemptive scheduling, what happens when a timer interrupt occurs?',
          options: [
            'The process is terminated immediately',
            'The CPU scheduler may allocate the CPU to another ready process, moving the current process to the Ready queue',
            'Physical RAM is cleared',
            'The computer restarts'
          ],
          correctAnswer: 1,
          explanation: 'Preemption allows the OS to pause the running process and give CPU time to another process.'
        }
      ]
    }
  },

  // C. CPU Scheduling Algorithms
  {
    id: 'cpu-scheduling-algorithms',
    title: 'CPU Scheduling (FCFS, SJF, SRTF, Priority, RR)',
    section: 'C. CPU Scheduling Algorithms',
    categoryId: 'process-management',
    shortDescription: 'Full interactive simulator with animated Gantt charts, step-by-step calculations, process table, and average metrics.',
    badge: 'Popular Simulator',
    simulatorType: 'cpu-scheduling',
    content: {
      introduction: 'CPU Scheduling Algorithms determine the sequence in which processes in the Ready Queue are granted CPU execution time. Understanding these algorithms is critical for computer engineering exams and operating system design.',
      whyUsed: 'Different workloads require different algorithms: batch systems favor throughput (FCFS/SJF), while interactive desktop and mobile operating systems require responsive time sharing (Round Robin).',
      howItWorks: [
        'FCFS (First-Come, First-Served): Processes are scheduled in strict arrival order (FIFO queue). Non-preemptive. Suffers from the "Convoy Effect" where short jobs wait behind long jobs.',
        'SJF (Shortest Job First): Assigns CPU to the process with the shortest burst time. Provably optimal in giving minimum average waiting time. Non-preemptive.',
        'SRTF (Shortest Remaining Time First): Preemptive version of SJF. If a newly arrived process has a burst time shorter than the remaining burst of the currently running process, preemption occurs.',
        'Priority Scheduling: Each process has a priority integer. CPU is allocated to the highest priority process (can be preemptive or non-preemptive). Risk: Starvation (solved by Aging).',
        'Round Robin (RR): Preemptive algorithm designed for time-sharing. Each process gets a fixed slice of CPU time called a "Time Quantum" (q). When time quantum expires, the process is moved to the tail of the ready queue.'
      ],
      diagramDescription: 'Animated Gantt Chart: | P1 (0-4) | P2 (4-7) | P3 (7-8) | with timeline markers and process color bands.',
      example: {
        title: 'Convoy Effect in FCFS',
        scenario: 'P1 (BT=24, AT=0), P2 (BT=3, AT=0), P3 (BT=3, AT=0).',
        solution: '• Order: P1, P2, P3.\n• Gantt: [P1: 0-24] [P2: 24-27] [P3: 27-30].\n• WT: P1=0, P2=24, P3=27. Average WT = (0 + 24 + 27) / 3 = 17 ms!\n• If SJF had run (P2, P3, P1): WT: P2=0, P3=3, P1=6. Avg WT = 3 ms! (Convoy effect avoided).'
      },
      advantages: [
        'FCFS: Simple, easy to program, zero starvation.',
        'SJF/SRTF: Provably optimal for minimizing Average Waiting Time.',
        'Round Robin: Fair, starvation-free, excellent response time for interactive users.'
      ],
      disadvantages: [
        'FCFS: Poor average waiting time; severe convoy effect.',
        'SJF/SRTF: Impossible to know exact future burst time in real systems; long jobs can starve.',
        'Priority: Low priority jobs can starve indefinitely without aging.',
        'Round Robin: If quantum is too small, context switch overhead dominates; if too large, degenerates to FCFS.'
      ],
      examNotes: [
        'Convoy Effect: Many short processes waiting for one heavy CPU-bound process in FCFS.',
        'SJF has minimum average waiting time among all scheduling algorithms.',
        'Aging: Technique of gradually increasing the priority of processes that wait in the system for a long time to prevent starvation.'
      ],
      practiceQuestions: [
        {
          question: 'Why is SJF considered optimal?',
          answer: 'Because moving a short process before a long process decreases the waiting time of the short process by more than it increases the waiting time of the long process, yielding the lowest mathematical average.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Which scheduling algorithm is provably optimal for minimizing average waiting time?',
          options: ['FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling'],
          correctAnswer: 2,
          explanation: 'SJF gives the theoretical minimum average waiting time for a given set of processes.'
        },
        {
          id: 'q2',
          question: 'What is the "Convoy Effect"?',
          options: [
            'A bug in network protocols',
            'When short processes wait behind a very long CPU-intensive process in FCFS',
            'When two threads access the same variable simultaneously',
            'A cache synchronization protocol'
          ],
          correctAnswer: 1,
          explanation: 'In FCFS, when a long CPU-bound process occupies the CPU, all short processes line up waiting behind it, dragging down device and CPU efficiency.'
        },
        {
          id: 'q3',
          question: 'What happens in Round Robin if the time quantum is chosen to be extremely large?',
          options: [
            'The algorithm behaves identically to FCFS',
            'The system crashes due to context switches',
            'Processes starve',
            'It becomes SJF'
          ],
          correctAnswer: 0,
          explanation: 'If the time quantum exceeds the longest process burst, every process finishes in its first turn, behaving exactly like FCFS.'
        }
      ]
    }
  },

  // D. Process Operations & IPC
  {
    id: 'process-operations-ipc',
    title: 'Process Operations, Context Switch & IPC',
    section: 'D. Process Operations',
    categoryId: 'process-management',
    shortDescription: 'Learn fork(), exec(), wait(), exit(), context switching mechanism, and IPC models (Shared Memory vs Message Passing).',
    badge: 'Core Theory',
    content: {
      introduction: 'Processes are created, executed, coordinated, and terminated throughout system operation. When processes collaborate, they communicate via Inter-Process Communication (IPC).',
      whyUsed: 'Modern applications are modular: browsers use separate processes for tabs, and microservices exchange messages. IPC enables information sharing, computation speedup, and modularity.',
      howItWorks: [
        'fork(): System call in UNIX/Linux that creates a new duplicate child process with a unique PID.',
        'exec(): System call that replaces the process address space with a new program binary.',
        'wait(): Parent process suspends until child process finishes, reading its exit code.',
        'exit(): Process terminates and requests the OS to delete its resources.',
        'Context Switching: The OS saves the state (registers, PC) of the running process in its PCB and loads the saved state of the next ready process from its PCB.',
        'IPC Models: Shared Memory (processes map the same physical RAM page; very fast) vs Message Passing (messages routed via kernel mailboxes/pipes; safer for distributed systems).'
      ],
      diagramDescription: 'Shared Memory: [Process A] <-> [Shared RAM Segment] <-> [Process B]\nMessage Passing: [Process A] -> [Kernel Buffer / Pipe] -> [Process B]',
      example: {
        title: 'fork() Execution Flow',
        scenario: 'int pid = fork(); if (pid == 0) { printf("Child"); } else { printf("Parent"); }',
        solution: 'fork() returns 0 to the newly created child process, and returns the Child\'s PID (a positive integer) to the parent process. Both run concurrently!'
      },
      advantages: [
        'Shared Memory: Maximum communication speed with zero kernel copying once mapping is established.',
        'Message Passing: No conflict over shared variables; easy to implement across distributed computer networks.'
      ],
      disadvantages: [
        'Shared Memory: Programmer must synchronize access (e.g. semaphores) to prevent race conditions.',
        'Message Passing: Involves kernel system call context switches and memory copy overhead.'
      ],
      examNotes: [
        'Zombie Process: A process that has finished execution (exit) but still has an entry in the process table because parent hasn\'t called wait().',
        'Orphan Process: A process whose parent has terminated; adopted by init (PID 1) or systemd.'
      ],
      practiceQuestions: [
        {
          question: 'What is a zombie process in Linux?',
          answer: 'A process that has terminated, but whose exit status has not yet been read by its parent via the wait() system call. It occupies an entry in the OS process table.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What return value does fork() provide to the child process?',
          options: ['-1', '0', 'The parent PID', '1'],
          correctAnswer: 1,
          explanation: 'fork() returns 0 to the child process, and returns the child\'s PID to the parent process.'
        },
        {
          id: 'q2',
          question: 'Which process becomes the adoptive parent of an orphan process in Unix?',
          options: ['Kernel thread 0', 'The init process (PID 1)', 'Cron daemon', 'The shell process'],
          correctAnswer: 1,
          explanation: 'When a parent terminates before its child, the orphan process is adopted by the system init (PID 1).'
        }
      ]
    }
  }
];
