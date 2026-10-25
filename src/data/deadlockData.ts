import { SubTopic } from '../types/os';

export const deadlockSubtopics: SubTopic[] = [
  // A. Deadlock Basics
  {
    id: 'deadlock-basics-coffman-conditions',
    title: 'Deadlock Basics & 4 Necessary Conditions',
    section: 'A. Deadlock Basics',
    categoryId: 'deadlock-management',
    shortDescription: 'Understand what deadlock is, real-life analogies (traffic gridlock), and Coffman’s 4 necessary conditions.',
    badge: 'Core Theory',
    simulatorType: 'rag',
    content: {
      introduction: 'A Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process. None can proceed, and the system freezes indefinitely.',
      whyUsed: 'Understanding deadlock conditions is crucial for writing robust multi-threaded server software, databases, and operating systems that manage shared hardware/software resources.',
      howItWorks: [
        'Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time).',
        'Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources that are held by other processes.',
        'No Preemption: Resources cannot be forcibly taken away from a process; a resource can only be released voluntarily by the holding process.',
        'Circular Wait: A closed chain of processes exists: P0 waits for a resource held by P1, P1 waits for P2, ..., Pn waits for P0.'
      ],
      diagramDescription: 'Two vehicles meeting on a single-lane narrow bridge from opposite directions. Neither can move forward without the other backing up!',
      example: {
        title: 'Real-Life Traffic Gridlock',
        scenario: 'Four cars arrive at a four-way intersection simultaneously. Each car moves slightly forward and occupies its quarter of the crossing.',
        solution: 'Car 1 needs the lane blocked by Car 2. Car 2 needs Car 3\'s lane. Car 3 needs Car 4\'s lane. Car 4 needs Car 1\'s lane. None can move: Circular Wait, Mutual Exclusion, Hold & Wait, No Preemption are all met -> Deadlock!'
      },
      advantages: [
        'Knowing the 4 conditions provides four distinct avenues to prevent deadlock by invalidating at least one condition.'
      ],
      disadvantages: [
        'Undetected deadlocks freeze systems, waste battery and memory, and force cold reboots or process termination.'
      ],
      examNotes: [
        'All 4 Coffman conditions MUST hold simultaneously for a deadlock to occur.',
        'If you break even ONE condition, deadlock becomes mathematically IMPOSSIBLE.',
        'Most modern general-purpose OSes (Linux, Windows) use the "Ostrich Algorithm" (ignore deadlocks and assume they are rare) due to high runtime detection overhead.'
      ],
      practiceQuestions: [
        {
          question: 'List Coffman’s 4 necessary conditions for deadlock.',
          answer: '1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'How many of Coffman\'s conditions must hold simultaneously for a deadlock to exist?',
          options: ['Only 1', 'Any 2', 'At least 3', 'All 4'],
          correctAnswer: 3,
          explanation: 'Deadlock can arise if and only if all four conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) hold concurrently.'
        },
        {
          id: 'q2',
          question: 'Which method invalidates Circular Wait?',
          options: [
            'Imposing a strict global numerical ordering on all resource types and requiring processes to request in increasing order',
            'Preempting CPU every 10 milliseconds',
            'Allowing infinite memory allocations',
            'Using FIFO scheduling'
          ],
          correctAnswer: 0,
          explanation: 'Assigning a global integer index F(R) to every resource and requiring requests in strictly ascending order prevents cyclic dependencies.'
        }
      ]
    }
  },

  // B. Deadlock Handling
  {
    id: 'deadlock-handling-strategies',
    title: 'Deadlock Handling Strategies',
    section: 'B. Deadlock Handling',
    categoryId: 'deadlock-management',
    shortDescription: 'Compare the 4 primary approaches: Prevention, Avoidance, Detection & Recovery, and the Ostrich algorithm.',
    badge: 'Comparison',
    content: {
      introduction: 'Operating systems manage deadlocks using one of four strategies: Deadlock Prevention (ensure condition never holds), Deadlock Avoidance (dynamic safety checks like Banker\'s), Deadlock Detection & Recovery (let it happen, then fix it), or Deadlock Ignorance (Ostrich).',
      whyUsed: 'Provides trade-offs between system throughput, computational overhead, and resource utilization.',
      howItWorks: [
        '1. Deadlock Prevention: Eliminates at least one of the four Coffman conditions statically at design time.',
        '2. Deadlock Avoidance: The OS dynamically examines resource-allocation state before granting requests to ensure the system never enters an "Unsafe State" (Banker\'s Algorithm).',
        '3. Deadlock Detection: Periodically runs cycle detection on Resource Allocation Graphs or Wait-for Graphs.',
        '4. Deadlock Recovery: Terminate all deadlocked processes, abort one process at a time until cycle breaks, or preempt resources with rollback.',
        '5. Ostrich Algorithm: Stick your head in the sand! Used when deadlocks occur so rarely that prevention cost outweighs reboot cost.'
      ],
      diagramDescription: 'Prevention (Strict Rules) -> Avoidance (Dynamic Safety Check) -> Detection (Find Cycles) -> Recovery (Kill / Rollback)',
      example: {
        title: 'Prevention vs Avoidance',
        scenario: 'A process needs Printer and Scanner.',
        solution: '• Prevention: Process must request both Printer and Scanner at the exact same instant before starting.\n• Avoidance: Process requests Printer now. OS checks if granting it leaves enough resources for all processes to finish safely. If yes, granted; if unsafe, wait.'
      },
      advantages: [
        'Prevention: Guarantees no deadlock without runtime tracking.',
        'Avoidance: Better resource utilization than rigid prevention.',
        'Detection: Allows maximal concurrency without conservative restrictions.'
      ],
      disadvantages: [
        'Prevention: Low device utilization; starvation of processes needing many resources.',
        'Avoidance: Requires processes to declare maximum resource claims in advance (unrealistic for general apps).',
        'Recovery: Data loss or rollbacks needed when killing transactions.'
      ],
      examNotes: [
        'Safe State vs Unsafe State: Safe State implies NO DEADLOCK. Unsafe State DOES NOT equal Deadlock, but creates the potential for deadlock!',
        'Banker\'s Algorithm is an Avoidance technique (not prevention!).'
      ],
      practiceQuestions: [
        {
          question: 'Does an unsafe state always result in a deadlock?',
          answer: 'No! An unsafe state is not a deadlock, but an unsafe state may lead to a deadlock if processes request their maximum claims simultaneously.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Which deadlock strategy does Banker’s Algorithm implement?',
          options: ['Deadlock Prevention', 'Deadlock Avoidance', 'Deadlock Detection', 'Deadlock Recovery'],
          correctAnswer: 1,
          explanation: 'Banker’s Algorithm is a dynamic avoidance algorithm that ensures the system remains in a safe state.'
        },
        {
          id: 'q2',
          question: 'What is the "Ostrich Algorithm"?',
          options: [
            'A sorting algorithm for processes',
            'Ignoring the deadlock problem on the assumption that it occurs very rarely',
            'Killing the oldest running process',
            'A hardware interrupt mechanism'
          ],
          correctAnswer: 1,
          explanation: 'The Ostrich algorithm assumes deadlocks are infrequent and that handling them dynamically causes excessive overhead.'
        }
      ]
    }
  },

  // C. Banker's Algorithm & Safe Sequences
  {
    id: 'bankers-algorithm-simulation',
    title: 'Banker’s Algorithm & Safe Sequences',
    section: 'C. Important Algorithms',
    categoryId: 'deadlock-management',
    shortDescription: 'Interactive Banker’s Algorithm solver with Allocation, Max, Available matrices, Need calculation, and step-by-step safe sequence verification.',
    badge: 'Popular Simulator',
    simulatorType: 'bankers',
    content: {
      introduction: 'Banker\'s Algorithm, developed by Edsger Dijkstra, is a classic deadlock avoidance algorithm. Like a small-town banker who never allocates cash in a way that he cannot satisfy the remaining maximum credit lines of all customers, the OS only grants resource requests if the resulting state is Safe.',
      whyUsed: 'Guarantees that a system will never deadlock even if every process eventually requests its maximum declared resources.',
      howItWorks: [
        'Vectors & Matrices: Available[m] (free units), Max[n][m] (maximum demand), Allocation[n][m] (currently held), Need[n][m] = Max - Allocation.',
        'Safety Algorithm: Initialize Work = Available, Finish[i] = false for all processes.',
        'Find an index i such that Finish[i] == false AND Need[i] <= Work.',
        'If such i exists: Simulate completion! Work = Work + Allocation[i], Finish[i] = true. Add process i to Safe Sequence. Repeat.',
        'If all Finish[i] == true, system is in a SAFE STATE with safe sequence <P0, P1, ...>. Otherwise, UNSAFE STATE.'
      ],
      diagramDescription: 'Process Need Matrix vs Available Vector. Process completes -> Releases its Allocation back to Available pool.',
      example: {
        title: 'Step-by-Step Safe Sequence Check',
        scenario: 'P0: Need=(7,4,3), Alloc=(0,1,0). P1: Need=(1,2,2), Alloc=(2,0,0). P2: Need=(6,0,0), Alloc=(3,0,2). Available = (3,3,2).',
        solution: '• Check P0: Need (7,4,3) <= (3,3,2)? No.\n• Check P1: Need (1,2,2) <= (3,3,2)? YES! Finish P1.\n  New Work = (3,3,2) + Alloc(2,0,0) = (5,3,2).\n• Safe sequence continues until all processes terminate successfully!'
      },
      advantages: [
        'Avoids deadlocks completely without unnecessarily restricting concurrency.',
        'Enables processes to acquire resources gradually rather than requesting all upfront.'
      ],
      disadvantages: [
        'Processes must state their maximum resource needs in advance.',
        'Number of processes and resources must remain fixed during operation.',
        'High computational overhead running safety check on every single request.'
      ],
      examNotes: [
        'Fundamental Equation: Need[i][j] = Max[i][j] - Allocation[i][j].',
        'When a process finishes, its resources are released: Available_new = Available_old + Allocation[i].'
      ],
      practiceQuestions: [
        {
          question: 'If Max is [7, 5, 3] and Allocation is [0, 1, 0], what is the Need vector?',
          answer: 'Need = Max - Allocation = [7-0, 5-1, 3-0] = [7, 4, 3].',
          type: 'numerical'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the formula to calculate the Need matrix?',
          options: [
            'Need = Max + Allocation',
            'Need = Max - Allocation',
            'Need = Available - Max',
            'Need = Allocation - Available'
          ],
          correctAnswer: 1,
          explanation: 'Need represents remaining resources a process may request: Need = Max - Allocation.'
        },
        {
          id: 'q2',
          question: 'What happens to a process\'s allocated resources when it executes to completion in Banker’s algorithm?',
          options: [
            'They are permanently destroyed',
            'They are released back to the Available resource pool',
            'They are transferred directly to disk',
            'They remain locked forever'
          ],
          correctAnswer: 1,
          explanation: 'Upon completion, a process releases its held resources, adding its Allocation vector to the current Work/Available pool.'
        }
      ]
    }
  },

  // D. Resource Allocation Graph (RAG)
  {
    id: 'resource-allocation-graph',
    title: 'Resource Allocation Graph (RAG) & Cycles',
    section: 'C. Important Algorithms',
    categoryId: 'deadlock-management',
    shortDescription: 'Interactive directed graph visualizer with process nodes, resource instances, request edges, and cycle detection.',
    badge: 'Interactive Visualizer',
    simulatorType: 'rag',
    content: {
      introduction: 'A Resource Allocation Graph (RAG) is a directed graph used to describe the state of an operating system in terms of processes and resources. It consists of Vertices (Processes and Resources) and Edges (Requests and Assignments).',
      whyUsed: 'Provides visual proof of whether a system is deadlocked or can become deadlocked through cycle detection algorithms.',
      howItWorks: [
        'Process Nodes: Represented as Circles (P1, P2...).',
        'Resource Nodes: Represented as Rectangles (R1, R2...). Dots inside rectangles represent individual instances of that resource.',
        'Request Edge (Pi -> Rj): Directed arrow from Process to Resource indicates process Pi is waiting for an instance of Rj.',
        'Assignment Edge (Rj -> Pi): Directed arrow from Resource dot to Process indicates resource Rj is currently allocated to Pi.',
        'Cycle Rule: If graph contains NO cycles, there is NO deadlock. If single-instance resources have a cycle, DEADLOCK EXISTS. If multi-instance resources have a cycle, deadlock MAY exist.'
      ],
      diagramDescription: 'R1 (1 dot) -> P1 -> R2 (1 dot) -> P2 -> R1 (1 dot). Closed circular arrow chain = Cycle!',
      example: {
        title: 'Single Instance Deadlock Cycle',
        scenario: 'P1 holds R1 and requests R2. P2 holds R2 and requests R1. Both R1 and R2 have only 1 unit.',
        solution: 'Edges: R1 -> P1 -> R2 -> P2 -> R1. A closed cycle exists with single-instance resources. Neither can release until they obtain the other. Deadlock confirmed!'
      },
      advantages: [
        'Intuitive visual inspection of dependencies and locks.',
        'Can be transformed into a Wait-For Graph (collapsing resources) for faster O(V+E) cycle detection in OS kernels.'
      ],
      disadvantages: [
        'Graph size grows rapidly in systems with thousands of threads and file handles.'
      ],
      examNotes: [
        'Single-instance resource graph: Cycle is BOTH Necessary and Sufficient condition for deadlock!',
        'Multi-instance resource graph: Cycle is Necessary, but NOT sufficient (another process outside the cycle might release an instance).'
      ],
      practiceQuestions: [
        {
          question: 'If a Resource Allocation Graph contains a cycle and all resources have exactly one instance, is the system deadlocked?',
          answer: 'Yes, with single-instance resources, a cycle is a necessary and sufficient condition for deadlock.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'An edge directed from Process P to Resource R represents what?',
          options: ['Assignment Edge', 'Request Edge', 'Termination Edge', 'Page Fault'],
          correctAnswer: 1,
          explanation: 'P -> R is a Request Edge, indicating process P is waiting for resource R.'
        },
        {
          id: 'q2',
          question: 'What is a Wait-For Graph (WFG)?',
          options: [
            'A graph showing CPU burst times',
            'A simplified graph obtained by removing resource nodes from a RAG, showing only P_i -> P_j edges',
            'A Gantt chart variant',
            'A virtual memory mapping'
          ],
          correctAnswer: 1,
          explanation: 'A Wait-For Graph collapses resource nodes, drawing direct directed edges between processes waiting on each other.'
        }
      ]
    }
  },

  // E. Deadlock vs Starvation & Livelock
  {
    id: 'deadlock-vs-starvation-livelock',
    title: 'Deadlock vs Starvation vs Livelock',
    section: 'D. Related Concepts',
    categoryId: 'deadlock-management',
    shortDescription: 'Demystify the critical distinctions between Deadlock, Starvation (indefinite waiting), and Livelock (active thrashing).',
    badge: 'Comparison',
    content: {
      introduction: 'Students frequently confuse Deadlock, Starvation, and Livelock on university and technical interview exams. While all three prevent progress, their underlying causes and thread states are completely different.',
      whyUsed: 'Accurate diagnosis is required to apply the correct fix: aging for starvation, break circular wait for deadlock, backoff randomization for livelock.',
      howItWorks: [
        'Deadlock: Two or more processes are blocked waiting for an event that only another blocked process can trigger. CPU utilization is zero for those processes; state is BLOCKED/WAITING.',
        'Starvation: A runnable process is repeatedly bypassed because other higher-priority processes are granted the resource. Process state is READY, but never scheduled.',
        'Livelock: Two or more processes actively change their states in response to each other, but make no actual forward progress. CPU utilization is 100%; state is RUNNING, not blocked!'
      ],
      diagramDescription: 'Deadlock = Frozen (0% CPU). Starvation = Waiting in line forever (Ready). Livelock = Two polite people trying to pass in a hallway continually stepping side to side.',
      example: {
        title: 'Hallway Courtesy Analogy for Livelock',
        scenario: 'Alice and Bob walk towards each other in a narrow corridor. Both step to the left to let the other pass. Then both simultaneously step to the right. Then both left again.',
        solution: 'Both are actively moving (CPU active), neither is blocked, but neither advances down the corridor! This is Livelock. Fixed by adding randomized exponential backoff.'
      },
      advantages: [
        'Starvation can be solved cleanly using Aging.',
        'Livelock can be eliminated using randomized backoff algorithms (like Ethernet CSMA/CD).'
      ],
      disadvantages: [
        'Livelock burns maximum CPU cycles while accomplishing zero work.',
        'Starvation is hard to detect automatically because the system as a whole appears healthy.'
      ],
      examNotes: [
        'Deadlock: Blocked state, no CPU consumed, requires outside intervention.',
        'Starvation: Ready state, system makes progress on other jobs, solved by aging.',
        'Livelock: Running state, 100% CPU consumed, active loop of state changes.'
      ],
      practiceQuestions: [
        {
          question: 'How does Aging prevent starvation in Priority Scheduling?',
          answer: 'Aging gradually increases the priority of a process the longer it waits in the ready queue, ensuring it will eventually achieve the highest priority and run.',
          type: 'concept'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'In which state are threads involved in a Livelock?',
          options: ['Blocked / Waiting', 'Active / Running', 'Terminated', 'Suspended on disk'],
          correctAnswer: 1,
          explanation: 'In livelock, processes are actively running and changing states, but making zero forward progress.'
        },
        {
          id: 'q2',
          question: 'What standard mechanism is used to resolve starvation in priority queues?',
          options: ['Rebooting', 'Aging', 'Virtual Memory', 'Semaphore Inversion'],
          correctAnswer: 1,
          explanation: 'Aging increases process priority proportionally to its waiting time, guaranteeing it eventually executes.'
        }
      ]
    }
  }
];
