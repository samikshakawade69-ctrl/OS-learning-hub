import { SubTopic } from '../types/os';

export const syncSubtopics: SubTopic[] = [
  // A. Synchronization Basics
  {
    id: 'race-conditions-critical-section',
    title: 'Race Condition & Critical Section Problem',
    section: 'A. Synchronization Basics',
    categoryId: 'process-synchronization',
    shortDescription: 'Understand concurrent execution hazards, race conditions, and the 3 mandatory requirements for any valid solution.',
    badge: 'Core Concept',
    simulatorType: 'peterson',
    content: {
      introduction: 'When multiple concurrent processes access and manipulate shared data concurrently, the outcome of the execution depends on the particular order in which the access takes place. This is called a Race Condition.',
      whyUsed: 'Preventing race conditions guarantees data consistency, prevents bank balance corruption, and maintains system integrity in multi-core systems.',
      howItWorks: [
        'Critical Section (CS): A code segment where shared variables, tables, or files are accessed and updated.',
        'Entry Section: Code requesting permission to enter the Critical Section.',
        'Exit Section: Code releasing permission and signaling waiting processes upon leaving CS.',
        'Remainder Section: Remaining non-critical code executed independently.',
        '3 Mandatory Requirements: 1. Mutual Exclusion (at most 1 process in CS at a time), 2. Progress (selection of who enters next cannot be postponed indefinitely), 3. Bounded Waiting (limit on times other processes can enter before a requesting process enters).'
      ],
      diagramDescription: 'Do { [Entry Section: acquire lock] -> [Critical Section: update shared counter] -> [Exit Section: release lock] -> [Remainder Section] } while(true);',
      example: {
        title: 'The Lost Deposit Race Condition',
        scenario: 'Account balance = $1000. Process 1 deposits $100. Process 2 withdraws $200 concurrently.',
        solution: '• Process 1 reads 1000. Context switch!\n• Process 2 reads 1000, subtracts 200, writes 800. Context switch!\n• Process 1 (still has old 1000) adds 100, writes 1100.\n• Final balance = $1100. The $200 withdrawal was completely lost! Solved by enclosing balance updates in a Critical Section.'
      },
      advantages: [
        'Enforcing Critical Section requirements guarantees deterministic, reliable software execution.'
      ],
      disadvantages: [
        'Synchronization serializes execution, creating bottlenecks and reducing parallel throughput if critical sections are too large.'
      ],
      examNotes: [
        'Any solution to the Critical Section problem MUST satisfy ALL THREE requirements: Mutual Exclusion, Progress, and Bounded Waiting.',
        'Hardware solutions include Test-and-Set and Compare-and-Swap atomic instructions.'
      ],
      practiceQuestions: [
        {
          question: 'What is Bounded Waiting?',
          answer: 'A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted, preventing starvation.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is a Race Condition?',
          options: [
            'Two processes competing for CPU speed',
            'When multiple processes access and manipulate shared data concurrently, and the final result depends on the order of execution',
            'A deadlock condition in network packets',
            'A memory leak in C++'
          ],
          correctAnswer: 1,
          explanation: 'A race condition arises when concurrent updates to shared variables produce indeterminate results based on context switch timing.'
        },
        {
          id: 'q2',
          question: 'Which of the following is NOT one of the 3 required conditions for solving the critical-section problem?',
          options: ['Mutual Exclusion', 'Progress', 'Bounded Waiting', 'High Clock Speed'],
          correctAnswer: 3,
          explanation: 'The three formal requirements are Mutual Exclusion, Progress, and Bounded Waiting.'
        }
      ]
    }
  },

  // B. Synchronization Tools
  {
    id: 'mutex-semaphores-monitors',
    title: 'Mutex, Semaphores & Monitors',
    section: 'B. Synchronization Tools',
    categoryId: 'process-synchronization',
    shortDescription: 'Deep dive into Mutex Locks, Counting & Binary Semaphores (wait/signal operations), Monitors, and Spinlocks.',
    badge: 'Core Tools',
    simulatorType: 'peterson',
    content: {
      introduction: 'Operating systems and programming languages provide synchronization primitives to guard critical sections: Mutex Locks, Semaphores, and high-level Monitors.',
      whyUsed: 'Provides standardized, hardware-accelerated, and easy-to-use abstractions so developers do not have to write low-level assembly synchronization.',
      howItWorks: [
        'Mutex Lock (Mutual Exclusion): A boolean variable with acquire() and release(). Ownership concept: only the thread that locked the mutex can unlock it.',
        'Counting Semaphore: An integer variable (S) accessed only through two atomic operations: wait() [P()] and signal() [V()]. Can control access to a finite resource pool of size N.',
        'wait(S): while (S <= 0); S--; (decrements semaphore count; blocks if count <= 0).',
        'signal(S): S++; (increments count; awakens a blocked thread).',
        'Binary Semaphore: Range is only 0 or 1. Equivalent to a mutex, but can be signaled by any thread (signaling mechanism).',
        'Monitors: High-level language construct with mutual exclusion built into the class/module methods automatically.'
      ],
      diagramDescription: 'Semaphore S = 3. Process A calls wait() -> S=2. Process B calls wait() -> S=1. Process C calls wait() -> S=0. Process D calls wait() -> Blocks in queue!',
      example: {
        title: 'Controlling 3 Printers with a Counting Semaphore',
        scenario: 'An office has 3 identical networked printers. 5 users submit print jobs.',
        solution: '• Initialize Semaphore S = 3.\n• First 3 jobs execute wait(S): S becomes 2, then 1, then 0. All 3 print simultaneously.\n• 4th job calls wait(S): Since S == 0, 4th job sleeps in waiting queue.\n• When printer 1 finishes, it calls signal(S): S increases, awakening the 4th job!'
      },
      advantages: [
        'Semaphores allow fine-grained concurrency control across multiple resource instances.',
        'Monitors eliminate common human mistakes like forgetting to release locks.'
      ],
      disadvantages: [
        'Classic semaphores with busy waiting waste CPU cycles (Spinlocks).',
        'Inverting wait() and signal() calls can cause immediate deadlocks.'
      ],
      examNotes: [
        'wait() is also known as P() (from Dutch "proberen" = to test).',
        'signal() is also known as V() (from Dutch "verhogen" = to increment).',
        'Operations on semaphores MUST be executed atomically.'
      ],
      practiceQuestions: [
        {
          question: 'What is the main difference between a Mutex and a Binary Semaphore?',
          answer: 'A Mutex has an ownership concept: the thread that locked it must unlock it. A Binary Semaphore is a signaling mechanism: one thread can wait() and a completely different thread can signal().',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What does the wait() or P() semaphore operation do when the semaphore integer value is greater than 0?',
          options: [
            'Increments the value and wakes up a process',
            'Decrements the value and allows the process to continue',
            'Puts the process to sleep immediately',
            'Deletes the semaphore'
          ],
          correctAnswer: 1,
          explanation: 'wait() decrements the semaphore value. If the value was > 0, the calling thread proceeds into the critical section.'
        },
        {
          id: 'q2',
          question: 'A semaphore whose integer value can range over an unrestricted domain is called a:',
          options: ['Binary Semaphore', 'Counting Semaphore', 'Spinlock', 'Critical Section'],
          correctAnswer: 1,
          explanation: 'A Counting Semaphore has an unrestricted domain representing available resource units.'
        }
      ]
    }
  },

  // C. Classical Problems: Producer-Consumer
  {
    id: 'producer-consumer-problem',
    title: 'Producer-Consumer Problem (Bounded Buffer)',
    section: 'C. Classical Synchronization Problems',
    categoryId: 'process-synchronization',
    shortDescription: 'Interactive bounded buffer simulation with animated items, full/empty/mutex semaphores, and step-by-step queues.',
    badge: 'Popular Simulator',
    simulatorType: 'producer-consumer',
    content: {
      introduction: 'The Producer-Consumer (Bounded Buffer) problem is a classic multi-process synchronization problem. One or more producers generate data items and put them into a buffer of fixed size N, while one or more consumers remove items from the buffer.',
      whyUsed: 'Mirrors real-world architectures: audio/video streaming buffers, web server request queues, and producer/consumer threads in operating system drivers.',
      howItWorks: [
        'Buffer Size = N slots.',
        'Semaphore mutex = 1 (Provides mutual exclusion for buffer access).',
        'Semaphore empty = N (Counts available empty slots in the buffer).',
        'Semaphore full = 0 (Counts available filled items in the buffer).',
        'Producer: wait(empty); wait(mutex); // insert item; signal(mutex); signal(full);',
        'Consumer: wait(full); wait(mutex); // remove item; signal(mutex); signal(empty);'
      ],
      diagramDescription: 'Producer -> [Buffer Slot 0] [Buffer Slot 1 (Item)] [Buffer Slot 2 (Empty)] ... -> Consumer',
      example: {
        title: 'Buffer Full Scenario',
        scenario: 'Buffer capacity is 3. Producer generates 4 items in rapid succession.',
        solution: '• Items 1, 2, 3 fill slots. empty becomes 0, full becomes 3.\n• When producer attempts item 4, wait(empty) blocks because empty == 0.\n• Producer sleeps until Consumer consumes an item and calls signal(empty)!'
      },
      advantages: [
        'Completely prevents buffer overflow (producing into full buffer) and buffer underflow (consuming from empty buffer).',
        'Decouples producer and consumer production speeds.'
      ],
      disadvantages: [
        'Incorrect ordering of wait(mutex) and wait(empty) causes immediate deadlock.'
      ],
      examNotes: [
        'Deadlock trap: If Producer calls wait(mutex) before wait(empty), and buffer is full, producer holds mutex while sleeping -> Consumer can never enter -> DEADLOCK!',
        'Always check space semaphores (empty/full) BEFORE acquiring the mutex lock.'
      ],
      practiceQuestions: [
        {
          question: 'What initial values are given to semaphores in a Bounded Buffer of size N?',
          answer: 'mutex = 1, empty = N, full = 0.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'In the Producer-Consumer problem with buffer size 5, what is the initial value of semaphore "empty"?',
          options: ['0', '1', '5', '-1'],
          correctAnswer: 2,
          explanation: 'Initially all 5 buffer slots are empty, so the "empty" semaphore is initialized to 5.'
        },
        {
          id: 'q2',
          question: 'What happens if a producer executes wait(mutex) before wait(empty) when the buffer is already full?',
          options: [
            'System throughput triples',
            'A Deadlock occurs because the producer holds mutex while blocked on empty',
            'Items are silently dropped',
            'Memory is automatically compacted'
          ],
          correctAnswer: 1,
          explanation: 'Holding the mutex while waiting prevents the consumer from acquiring the mutex to consume, creating an unbreakable deadlock.'
        }
      ]
    }
  },

  // C. Classical Problems: Readers-Writers
  {
    id: 'readers-writers-problem',
    title: 'Readers-Writers Problem',
    section: 'C. Classical Synchronization Problems',
    categoryId: 'process-synchronization',
    shortDescription: 'Simulate concurrent readers, exclusive writers, readcount tracking, and starvation prevention.',
    badge: 'Popular Simulator',
    simulatorType: 'readers-writers',
    content: {
      introduction: 'In the Readers-Writers problem, a database or shared memory is accessed by two types of processes: Readers (who only read data without modifying it) and Writers (who update data).',
      whyUsed: 'Models relational databases, file systems, and web caches where read operations are safe to perform concurrently, but writes require strict exclusivity.',
      howItWorks: [
        'Rule 1: Multiple readers can read simultaneously without interference.',
        'Rule 2: Only one writer can write at any time.',
        'Rule 3: If a writer is writing, no reader may read, and no other writer may write.',
        'First Readers-Writers Problem (Reader Priority): No reader kept waiting unless a writer has already obtained permission. Risk: Writer Starvation!',
        'Second Readers-Writers Problem (Writer Priority): Once a writer is ready, no new readers may start reading. Risk: Reader Starvation!'
      ],
      diagramDescription: 'Shared Database: [Reader 1] [Reader 2] [Reader 3] reading concurrently. Writer waits outside. When Writer enters, all readers locked out.',
      example: {
        title: 'The First Reader and Last Reader',
        scenario: 'Readers arrive one by one while a file is open.',
        solution: '• 1st reader arrives: increments read_count to 1; locks rw_mutex (blocking all writers).\n• 2nd and 3rd readers arrive: increment read_count to 2, 3; read immediately!\n• 1st and 2nd readers leave: decrement read_count to 2, 1.\n• Last reader leaves: decrements read_count to 0; unlocks rw_mutex (writers can now write)!'
      },
      advantages: [
        'Maximizes read throughput by allowing concurrent read access.'
      ],
      disadvantages: [
        'Reader-preference solution leads to writer starvation if there is a continuous stream of readers.'
      ],
      examNotes: [
        'The variable read_count is protected by semaphore mutex (initialized to 1).',
        'Database access exclusivity is controlled by semaphore rw_mutex (initialized to 1).',
        'The first reader acquires rw_mutex, and the last reader releases rw_mutex.'
      ],
      practiceQuestions: [
        {
          question: 'Why does the first Readers-Writers solution allow writer starvation?',
          answer: 'Because as long as at least one reader is reading, subsequent readers can join in without releasing the lock, keeping writers waiting indefinitely.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'In the first Readers-Writers problem, who locks the exclusive writer semaphore (rw_mutex)?',
          options: ['Every reader', 'The first reader to arrive', 'The OS scheduler', 'The last reader'],
          correctAnswer: 1,
          explanation: 'The first reader (when read_count transitions from 0 to 1) locks rw_mutex on behalf of all readers.'
        },
        {
          id: 'q2',
          question: 'Can two readers read the shared file at the exact same moment in a correct implementation?',
          options: ['No, only one process at a time', 'Yes, concurrent reads do not conflict with each other', 'Only on Sundays', 'Only if writer approves'],
          correctAnswer: 1,
          explanation: 'Multiple readers reading simultaneously do not corrupt data; exclusivity is only needed for writers.'
        }
      ]
    }
  },

  // C. Classical Problems: Dining Philosophers
  {
    id: 'dining-philosophers-problem',
    title: 'Dining Philosophers Problem',
    section: 'C. Classical Synchronization Problems',
    categoryId: 'process-synchronization',
    shortDescription: 'Animated round table with 5 philosophers, 5 chopsticks, thinking/hungry/eating states, deadlock demo & safe solutions.',
    badge: 'Popular Simulator',
    simulatorType: 'dining-philosophers',
    content: {
      introduction: 'Five philosophers sit around a circular table. Each philosopher spends their life alternating between Thinking and Eating. Between each philosopher is a single chopstick (5 total). A philosopher needs BOTH left and right chopsticks to eat.',
      whyUsed: 'A classic metaphor representing resource allocation among multiple processes without deadlock and starvation.',
      howItWorks: [
        'Chopsticks are represented as an array of 5 semaphores: chopstick[5], all initialized to 1.',
        'Naive Algorithm: Philosopher i picks up chopstick[i] (left), then chopstick[(i+1)%5] (right), eats, puts down left, puts down right.',
        'The Deadlock Trap: If all 5 philosophers get hungry at the exact same time and pick up their left chopsticks simultaneously, all chopsticks are taken. Every philosopher is holding one and waiting for the right chopstick -> CIRCULAR WAIT -> SYSTEM DEADLOCK!',
        'Safe Solutions: 1. Allow at most 4 philosophers to sit at the table. 2. An asymmetric philosopher (e.g. odd picks left first, even picks right first). 3. Acquire both chopsticks atomically in a critical section.'
      ],
      diagramDescription: 'Circular table: P0 between C0 and C1; P1 between C1 and C2; P2 between C2 and C3; P3 between C3 and C4; P4 between C4 and C0.',
      example: {
        title: 'Asymmetric Solution',
        scenario: 'Philosopher 4 is designated odd/asymmetric. P0, P1, P2, P3 pick up left first. P4 picks up right first.',
        solution: 'P4 attempts to pick chopstick 0 first, which is the left chopstick of P0. One of them wins chopstick 0, breaking the cyclic dependency! Deadlock is mathematically impossible.'
      },
      advantages: [
        'Teaches students how subtle race conditions and circular waits form in distributed algorithms.'
      ],
      disadvantages: [
        'Improper synchronization leads to starvation where one philosopher is repeatedly denied chopsticks by greedy neighbors.'
      ],
      examNotes: [
        'Naive solution causes deadlock when all pick left chopstick at the same time.',
        'Condition for eating: MUST possess both chopsticks (left: i, right: (i+1)%5).'
      ],
      practiceQuestions: [
        {
          question: 'How many chopsticks are needed in total for 5 philosophers?',
          answer: '5 chopsticks, placed between adjacent philosophers.',
          type: 'concept'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What causes deadlock in the naive Dining Philosophers implementation?',
          options: [
            'All philosophers try to eat without thinking',
            'All 5 philosophers pick up their left chopstick simultaneously, causing circular wait',
            'The food runs out',
            'A philosopher eats too quickly'
          ],
          correctAnswer: 1,
          explanation: 'When each philosopher holds their left chopstick and waits indefinitely for the right, circular wait locks all five.'
        },
        {
          id: 'q2',
          question: 'Which of the following is a valid method to avoid deadlock in the Dining Philosophers problem?',
          options: [
            'Allow at most 4 philosophers to sit at the table simultaneously',
            'Require odd-numbered philosophers to pick left chopstick first, and even-numbered to pick right chopstick first',
            'Pick up both chopsticks only when both are available (using a monitor)',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'All three are classic, mathematically proven strategies to eliminate deadlock in Dining Philosophers.'
        }
      ]
    }
  },

  // D. Peterson's Algorithm
  {
    id: 'petersons-algorithm',
    title: 'Peterson’s Algorithm & Busy Waiting',
    section: 'D. Additional Concepts',
    categoryId: 'process-synchronization',
    shortDescription: 'Interactive step-by-step trace of flag[0], flag[1], and turn variables proving mutual exclusion, progress, and bounded waiting.',
    badge: 'Interactive Visualizer',
    simulatorType: 'peterson',
    content: {
      introduction: 'Peterson\'s Algorithm is a classic software-based solution to the critical-section problem for two processes. It was proposed by Gary Peterson in 1981 and elegantly demonstrates mutual exclusion without special hardware instructions.',
      whyUsed: 'Provides a clean mathematical demonstration that software-only solutions to mutual exclusion exist using two shared variables: flag[] and turn.',
      howItWorks: [
        'Shared Variables: boolean flag[2] (initialized to false; indicates desire to enter CS) and int turn (indicates whose turn it is).',
        'Entry Section for Process i (where j = 1 - i):',
        '1. flag[i] = true; // "I want to enter"',
        '2. turn = j; // "Politeness: I give preference to the other process"',
        '3. while (flag[j] && turn == j); // Busy wait while other process wants to enter and it\'s their turn',
        'Critical Section: Process i safely executes.',
        'Exit Section: flag[i] = false; // "I am done"'
      ],
      diagramDescription: 'P0: flag[0]=true -> turn=1 -> while(flag[1] && turn==1); -> [CS] -> flag[0]=false.\nP1: flag[1]=true -> turn=0 -> while(flag[0] && turn==0); -> [CS] -> flag[1]=false.',
      example: {
        title: 'Why Simultaneous Entry is Impossible',
        scenario: 'Both P0 and P1 set flag[0]=true and flag[1]=true at almost the same time.',
        solution: 'The variable "turn" is a single scalar integer. Whichever process writes to "turn" last will overwrite the other! If P1 writes turn=0 last, then turn == 0. P0 sees turn == 0, exits loop, and enters CS. P1 sees turn == 0 and loops until P0 exits!'
      },
      advantages: [
        'Requires zero specialized hardware primitives (works with pure loads and stores in sequential consistency).',
        'Satisfies all three criteria: Mutual Exclusion, Progress, and Bounded Waiting.'
      ],
      disadvantages: [
        'Limited strictly to two processes (Bakery algorithm needed for N processes).',
        'Modern out-of-order CPUs and memory reordering can break Peterson\'s algorithm without memory barriers (fences).',
        'Uses busy waiting (spin loop), wasting CPU cycles while waiting.'
      ],
      examNotes: [
        'Peterson\'s algorithm proves: Mutual Exclusion (Yes), Progress (Yes), Bounded Waiting (Yes).',
        'Key insight: Politeness rule ("turn = j") resolves ties whenever both processes assert flag = true simultaneously.'
      ],
      practiceQuestions: [
        {
          question: 'What is the purpose of the variable "turn" in Peterson’s algorithm?',
          answer: 'It acts as an arbitration mechanism: if both processes want to enter at the same time, the one whose turn was set last graciously lets the other process enter first.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'How many processes does Peterson’s algorithm support in its classic formulation?',
          options: ['1', '2', '4', 'Unlimited'],
          correctAnswer: 1,
          explanation: 'Classic Peterson’s algorithm is formulated specifically for 2 cooperating processes.'
        },
        {
          id: 'q2',
          question: 'What does "flag[i] = true" mean in Peterson’s algorithm?',
          options: [
            'Process i is terminating',
            'Process i is ready and wants to enter the critical section',
            'Process i has suffered a page fault',
            'Process i is relinquishing the CPU permanently'
          ],
          correctAnswer: 1,
          explanation: 'flag[i] = true signals that process i is requesting entry into the critical section.'
        }
      ]
    }
  }
];
