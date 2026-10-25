import { SubTopic } from '../types/os';

export const memorySubtopics: SubTopic[] = [
  // A. Memory Allocation
  {
    id: 'memory-allocation-algorithms',
    title: 'First Fit, Best Fit & Worst Fit',
    section: 'A. Memory Allocation',
    categoryId: 'memory-management',
    shortDescription: 'Compare the three primary contiguous allocation strategies used by OS to place processes in memory blocks.',
    badge: 'Simulator Included',
    simulatorType: 'memory-allocation',
    content: {
      introduction: 'When a new process requests memory in a system with variable partitions, the Operating System must decide which free hole (block of free memory) to assign. The three classic strategies are First Fit, Best Fit, and Worst Fit.',
      whyUsed: 'Memory allocation algorithms maximize memory utilization, minimize internal and external fragmentation, and ensure fast allocation times for processes entering RAM.',
      howItWorks: [
        'First Fit: Scans memory from the beginning and allocates the very first hole that is large enough. Fast because searching stops early.',
        'Best Fit: Scans the entire memory list to find the smallest hole that is large enough for the process. Produces the smallest leftover hole.',
        'Worst Fit: Scans the entire list and allocates the largest available hole. Leaves behind the largest remaining chunk, which might be useful for other processes.'
      ],
      diagramDescription: 'Memory Blocks: [100 KB Free] [500 KB Free] [200 KB Free] [300 KB Free] [600 KB Free]. Process P1 (212 KB) enters.',
      example: {
        title: 'Allocation of 212 KB Process',
        scenario: 'Given free blocks in order: 100 KB, 500 KB, 200 KB, 300 KB, 600 KB. Allocate Process P (212 KB).',
        solution: '• First Fit: Goes to 500 KB block (first hole ≥ 212 KB). Remaining hole = 288 KB.\n• Best Fit: Goes to 300 KB block (smallest hole ≥ 212 KB). Remaining hole = 88 KB.\n• Worst Fit: Goes to 600 KB block (largest hole). Remaining hole = 388 KB.'
      },
      advantages: [
        'First Fit: Fastest execution speed; low overhead since search stops on first match.',
        'Best Fit: Minimizes wasted space inside the chosen block for the current process.',
        'Worst Fit: Leaves larger remnant holes rather than tiny unusable slivers.'
      ],
      disadvantages: [
        'First Fit: Tends to clutter the beginning of the free list with tiny fragments.',
        'Best Fit: Leaves tiny leftover fragments that are too small for any process (high external fragmentation). Requires searching entire list.',
        'Worst Fit: Must search entire list; quickly breaks down large memory blocks needed by larger processes.'
      ],
      examNotes: [
        'GATE/Exam Tip: Both First Fit and Best Fit are better than Worst Fit in terms of time and storage utilization.',
        'First Fit is usually the fastest and most memory-efficient in practical benchmarks.',
        'Best Fit creates the most external fragmentation (lots of tiny unusable holes).'
      ],
      practiceQuestions: [
        {
          question: 'Given memory partitions of 100K, 500K, 200K, 300K, and 600K (in order), how would First-Fit place processes of 212K, 417K, 112K, and 426K?',
          answer: '212K -> 500K block (288K left). 417K -> 600K block (183K left). 112K -> 288K block left over from 500K. 426K must wait (no single block ≥ 426K left).',
          type: 'numerical'
        },
        {
          question: 'Which algorithm produces the smallest leftover fragments?',
          answer: 'Best Fit, because it selects the smallest hole that can accommodate the process.',
          type: 'concept'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Which memory allocation strategy allocates the largest available hole?',
          options: ['First Fit', 'Best Fit', 'Worst Fit', 'Next Fit'],
          correctAnswer: 2,
          explanation: 'Worst Fit searches the whole memory list to locate the largest free block and allocates from it.'
        },
        {
          id: 'q2',
          question: 'In terms of execution speed, which algorithm is generally the fastest?',
          options: ['Best Fit', 'Worst Fit', 'First Fit', 'Optimal Fit'],
          correctAnswer: 2,
          explanation: 'First Fit is generally fastest because it terminates the search as soon as the first sufficient hole is discovered.'
        },
        {
          id: 'q3',
          question: 'Why can Best Fit cause high external fragmentation?',
          options: [
            'It refuses to allocate memory',
            'It creates tiny leftover fragments that no subsequent process can use',
            'It allocates the entire memory to one process',
            'It operates only with fixed partitions'
          ],
          correctAnswer: 1,
          explanation: 'Best Fit leaves behind very small residual holes that are typically too small to satisfy future requests.'
        }
      ]
    }
  },

  // B. Memory Allocation Techniques
  {
    id: 'contiguous-vs-non-contiguous',
    title: 'Contiguous vs Non-Contiguous Allocation',
    section: 'B. Memory Allocation Techniques',
    categoryId: 'memory-management',
    shortDescription: 'Explore Fixed vs Dynamic Partitioning, and understand the revolution from Contiguous to Non-Contiguous Memory (Paging).',
    badge: 'Core Theory',
    simulatorType: 'memory-allocation',
    content: {
      introduction: 'In Contiguous Allocation, a process must occupy a single continuous chunk of physical memory addresses. In Non-Contiguous Allocation, a process can be split across different scattered locations across RAM.',
      whyUsed: 'Contiguous allocation is simple in hardware design (requires only Base and Limit registers). However, non-contiguous allocation (such as paging) completely eliminates external fragmentation by allowing pages to reside in any arbitrary physical frame.',
      howItWorks: [
        'Fixed Partitioning (MFT): Memory is divided into fixed-size partitions at boot time. Each partition holds exactly one process. Causes Internal Fragmentation.',
        'Dynamic Partitioning (MVT): Partitions are created dynamically to match process size exactly. Eliminates internal fragmentation but leads to External Fragmentation over time.',
        'Non-Contiguous Allocation: The logical address space is divided into chunks (pages) and mapped anywhere in physical memory frames using a Page Table.'
      ],
      diagramDescription: 'Contiguous: Process 0-100KB locked in addresses 200-300KB. Non-Contiguous: Process Page 0 at Frame 4, Page 1 at Frame 12, Page 2 at Frame 1.',
      example: {
        title: 'Fixed vs Dynamic Partitioning',
        scenario: 'A process of 35 KB arrives. System A has fixed 64 KB partitions. System B uses dynamic allocation.',
        solution: '• System A (Fixed): Allocates 64 KB partition. Process uses 35 KB, leaving 29 KB wasted inside the partition (Internal Fragmentation).\n• System B (Dynamic): Allocates exactly 35 KB partition. No internal fragmentation!'
      },
      advantages: [
        'Contiguous: Simple hardware translation (Physical = Base + Logical; check Logical < Limit).',
        'Non-Contiguous: Complete elimination of external fragmentation; processes do not need contiguous free memory.'
      ],
      disadvantages: [
        'Contiguous: Suffers from severe internal/external fragmentation and limits process size to available contiguous free blocks.',
        'Non-Contiguous: Requires memory overhead for page tables and extra memory lookups (mitigated by TLB).'
      ],
      examNotes: [
        'Fixed partitioning suffers from Internal Fragmentation.',
        'Dynamic partitioning suffers from External Fragmentation.',
        'Paging is a non-contiguous technique that eliminates external fragmentation but still suffers slight internal fragmentation on the last page.'
      ],
      practiceQuestions: [
        {
          question: 'What is the main difference between internal and external fragmentation?',
          answer: 'Internal fragmentation occurs when allocated memory is larger than requested memory (wasted inside). External fragmentation occurs when total free memory is enough, but it is divided into non-contiguous pieces.',
          type: 'concept'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Fixed partitioning primarily suffers from which type of fragmentation?',
          options: ['External Fragmentation', 'Internal Fragmentation', 'Virtual Fragmentation', 'No Fragmentation'],
          correctAnswer: 1,
          explanation: 'Because partition sizes are pre-fixed, if a process size is smaller than the partition, the remainder is wasted as internal fragmentation.'
        },
        {
          id: 'q2',
          question: 'What hardware registers are used in simple contiguous allocation for protection?',
          options: ['Base and Limit registers', 'Stack Pointer and Program Counter', 'Page Table Base Register', 'Accumulator'],
          correctAnswer: 0,
          explanation: 'The Base register holds the smallest legal physical address, and the Limit register specifies the size of the range.'
        }
      ]
    }
  },

  // C. Paging
  {
    id: 'paging-and-address-translation',
    title: 'Paging & Address Translation',
    section: 'C. Paging',
    categoryId: 'memory-management',
    shortDescription: 'Master how the MMU converts Logical Addresses (Page + Offset) into Physical Addresses (Frame + Offset) with TLB caching.',
    badge: 'Interactive Tool',
    simulatorType: 'paging-translation',
    content: {
      introduction: 'Paging is a memory management scheme that eliminates the need for contiguous physical memory. The process logical memory is broken into fixed-size blocks called Pages, and physical RAM is broken into equal-sized blocks called Frames.',
      whyUsed: 'Paging prevents external fragmentation, simplifies allocation from the free frame list, and supports virtual memory by allowing processes larger than physical RAM.',
      howItWorks: [
        'Page Size is always a power of 2 (e.g., 4 KB = 2^12 bytes).',
        'Logical Address generated by CPU consists of: Page Number (p) and Page Offset (d).',
        'The MMU uses Page Number (p) as an index into the Page Table to find Frame Number (f).',
        'Physical Address = (Frame Number f * Page Size) + Offset d (or binary concatenation f || d).',
        'TLB (Translation Lookaside Buffer): High-speed associative hardware cache. If p is in TLB (TLB Hit), frame is obtained in 1 cycle without reading RAM.'
      ],
      diagramDescription: 'CPU -> [ Page # p | Offset d ] -> Page Table [p -> f] -> Physical Memory [ Frame # f | Offset d ]',
      example: {
        title: 'Address Translation Calculation',
        scenario: 'Page size = 4 KB (2^12 bytes). Process generates logical address 13320 (decimal). Page 3 maps to Frame 7.',
        solution: '• Page size = 4096 bytes.\n• Page Number p = floor(13320 / 4096) = 3.\n• Offset d = 13320 mod 4096 = 1032.\n• Page Table lookup: Page 3 -> Frame 7.\n• Physical Address = (7 * 4096) + 1032 = 28672 + 1032 = 29704.'
      },
      advantages: [
        'No external fragmentation; any free frame can be allocated to any process.',
        'Easy protection and sharing of code segments.',
        'Swapping is easy because pages and frames are identical in size.'
      ],
      disadvantages: [
        'Internal fragmentation on the last page (on average, half a page per process).',
        'Page tables consume memory space.',
        'Memory access time is doubled without TLB (one access for page table, one for data).'
      ],
      examNotes: [
        'Effective Memory Access Time (EMAT) = Hit_Ratio * (TLB_time + Mem_time) + (1 - Hit_Ratio) * (TLB_time + 2 * Mem_time).',
        'Frame Size MUST equal Page Size in hardware.',
        'If logical address has m bits and page size is 2^n bytes, then n bits represent offset and (m-n) bits represent page number.'
      ],
      practiceQuestions: [
        {
          question: 'If a 32-bit system has a 4 KB page size, how many entries are in the page table?',
          answer: '4 KB = 2^12 bytes. Offset = 12 bits. Page number = 32 - 12 = 20 bits. Total entries = 2^20 = 1,048,576 entries (1 Million).',
          type: 'numerical'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the function of the Translation Lookaside Buffer (TLB)?',
          options: [
            'To store user process data',
            'To cache recent virtual-to-physical address translations for fast lookup',
            'To detect deadlocks in the CPU',
            'To schedule threads'
          ],
          correctAnswer: 1,
          explanation: 'TLB is a fast hardware associative cache that stores recent page-to-frame mappings to avoid extra memory accesses.'
        },
        {
          id: 'q2',
          question: 'If page size is 1 KB (1024 bytes), how many bits are required for the offset?',
          options: ['8 bits', '10 bits', '12 bits', '16 bits'],
          correctAnswer: 1,
          explanation: '1024 = 2^10, so exactly 10 bits are required for the offset.'
        }
      ]
    }
  },

  // D. Segmentation
  {
    id: 'segmentation-concept',
    title: 'Segmentation & Paging vs Segmentation',
    section: 'D. Segmentation',
    categoryId: 'memory-management',
    shortDescription: 'Understand variable-length memory segments mirroring user programmer view (Code, Stack, Heap, Data) vs fixed Paging.',
    badge: 'Comparison',
    simulatorType: 'paging-translation',
    content: {
      introduction: 'Segmentation is a memory-management scheme that supports the programmer’s view of memory. Instead of breaking code into arbitrary fixed pages, memory is divided into variable-length logical units such as Main program, Functions, Stack, and Symbol table.',
      whyUsed: 'Provides natural modular protection (e.g. read-only code segments) and enables simple sharing of procedures and libraries between processes.',
      howItWorks: [
        'Logical address is a two-tuple: <segment-number s, offset d>.',
        'Segment Table contains two critical fields for each segment: Base (starting physical address) and Limit (length of the segment).',
        'Protection check: If offset d >= Limit, CPU raises an Addressing Error / Trap (Segmentation Fault).',
        'Physical Address = Base + d.'
      ],
      diagramDescription: 'CPU -> <s, d> -> Check d < Limit? -> Yes: Physical = Base + d. No: Trap (Segmentation Fault)',
      example: {
        title: 'Segment Address Translation',
        scenario: 'Segment Table: Seg 0 (Base=1400, Limit=1000), Seg 1 (Base=6300, Limit=400). Check address <0, 430> and <1, 500>.',
        solution: '• For <0, 430>: Offset 430 < Limit 1000 (Valid). Physical Address = 1400 + 430 = 1830.\n• For <1, 500>: Offset 500 >= Limit 400 (Invalid!). OS generates a Segmentation Fault.'
      },
      advantages: [
        'Matches user view: Segments correspond to logical program components.',
        'No internal fragmentation because segment is allocated exactly what it needs.',
        'Simplifies protection and code sharing across processes.'
      ],
      disadvantages: [
        'Suffers from External Fragmentation as segments are loaded and unloaded of varying lengths.',
        'Requires compaction to coalesce free segments.',
        'Complex memory allocation algorithms needed.'
      ],
      examNotes: [
        'Key Difference: Paging divides memory into fixed-sized blocks (invisible to user); Segmentation divides into variable-sized logical units (visible to user).',
        'Paging causes internal fragmentation; Segmentation causes external fragmentation.',
        'Modern OSes (like x86 Linux) combine both: Segmented Paging!'
      ],
      practiceQuestions: [
        {
          question: 'Why does segmentation not suffer from internal fragmentation?',
          answer: 'Because segments are dynamically sized to fit the exact size of the user routine or data structure.',
          type: 'concept'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What error occurs if the offset in a logical address exceeds the segment limit?',
          options: ['Page Fault', 'Segmentation Fault (Trap)', 'Deadlock', 'Buffer Overflow'],
          correctAnswer: 1,
          explanation: 'The hardware generates a trap/segmentation fault when offset d >= limit to prevent illegal memory access.'
        },
        {
          id: 'q2',
          question: 'Which of the following is true regarding Paging vs Segmentation?',
          options: [
            'Paging has variable sizes; Segmentation has fixed sizes',
            'Paging suffers from external fragmentation; Segmentation from internal fragmentation',
            'Paging is handled by OS without programmer knowledge; Segmentation aligns with programmer modules',
            'Segmentation does not use tables'
          ],
          correctAnswer: 2,
          explanation: 'Paging is transparent to the programmer, whereas Segmentation directly mirrors programmer modules (code, stack, heap).'
        }
      ]
    }
  },

  // E. Fragmentation
  {
    id: 'fragmentation-and-compaction',
    title: 'Fragmentation & Compaction',
    section: 'E. Fragmentation',
    categoryId: 'memory-management',
    shortDescription: 'Understand Internal vs External Fragmentation, memory Compaction, and the mathematical 50% Rule.',
    badge: 'Core Theory',
    simulatorType: 'memory-allocation',
    content: {
      introduction: 'Fragmentation is the phenomenon where storage space is used inefficiently, reducing capacity and performance. It is categorized into Internal and External fragmentation.',
      whyUsed: 'Understanding fragmentation is the key reason why modern computer architectures transitioned from contiguous allocation to paging and virtual memory.',
      howItWorks: [
        'Internal Fragmentation: Memory that is internal to a partition but is not being used. Occurs when fixed-size allocation units are larger than requested size.',
        'External Fragmentation: Total free memory space exists to satisfy a request, but it is split into scattered non-contiguous fragments.',
        'Compaction: Moving all allocated memory together to one end of RAM to coalesce all scattered free holes into one large contiguous block. Only possible if relocation is dynamic (runtime binding).',
        '50% Rule: For First Fit, if N allocated blocks are in use, approximately 0.5 * N blocks are lost to fragmentation (1/3 of memory unusable).'
      ],
      diagramDescription: '[ Allocated 80KB | Unused 20KB (Internal) ] vs [ Free 30KB ] [ Allocated ] [ Free 40KB ] (Total Free 70KB, but cannot fit 50KB request!)',
      example: {
        title: 'Compaction in Action',
        scenario: 'Memory has: Block A (100KB), Free (50KB), Block B (150KB), Free (50KB). Process C needs 90KB.',
        solution: 'Without compaction: C cannot be loaded because maximum contiguous free block is 50KB.\nWith compaction: Block B is shifted down adjacent to Block A. Total free space = 100KB contiguous. Process C loads successfully!'
      },
      advantages: [
        'Compaction reclaims fragmented memory in contiguous allocation systems.',
        'Paging avoids compaction altogether by removing contiguous placement requirement.'
      ],
      disadvantages: [
        'Compaction requires significant CPU and memory bus overhead as gigabytes of memory are copied.',
        'Only feasible when program addresses can be relocated dynamically at run-time.'
      ],
      examNotes: [
        '50% Rule: Statistical analysis shows that regardless of optimization, First Fit loses 1/3 of memory to external fragmentation.',
        'Paging solves External Fragmentation completely.'
      ],
      practiceQuestions: [
        {
          question: 'When is memory compaction possible?',
          answer: 'Compaction is possible only if address binding is dynamic and done at execution time (using relocation registers).',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the 50% rule in memory allocation?',
          options: [
            'Half of CPU time is wasted on paging',
            'For N allocated blocks, roughly 0.5 N blocks are lost due to fragmentation',
            'Processes cannot exceed 50% of RAM',
            'Compaction can only reclaim 50% of memory'
          ],
          correctAnswer: 1,
          explanation: 'Statistical analysis of First-Fit shows that about 1 block is lost to fragmentation for every 2 allocated blocks.'
        }
      ]
    }
  },

  // F. Virtual Memory
  {
    id: 'page-replacement-algorithms',
    title: 'Page Replacement (FIFO, LRU, Optimal)',
    section: 'F. Virtual Memory',
    categoryId: 'memory-management',
    shortDescription: 'Simulate FIFO, Least Recently Used (LRU), and Optimal page replacement. Explore Belady’s Anomaly and Thrashing.',
    badge: 'Popular Simulator',
    simulatorType: 'page-replacement',
    content: {
      introduction: 'Virtual memory allows execution of processes that are not completely in physical memory. When a referenced page is not in RAM, a Page Fault occurs. If frames are full, the OS must select a victim page to evict using a Page Replacement Algorithm.',
      whyUsed: 'Virtual memory allows programs to be larger than physical RAM, increases degree of multiprogramming, and reduces I/O needed to load programs.',
      howItWorks: [
        'FIFO (First-In, First-Out): The oldest page brought into memory is selected as the victim.',
        'LRU (Least Recently Used): Replaces the page that has not been referenced for the longest period of time (approximates optimal).',
        'Optimal (OPT): Replaces the page that will not be used for the longest period of time in the future. (Theoretical benchmark; cannot be implemented in general OS).',
        'Belady\'s Anomaly: For some algorithms (notably FIFO), adding more physical page frames can paradoxically increase the number of page faults!'
      ],
      diagramDescription: 'Frame slots [F1, F2, F3]. Reference string: 7, 0, 1, 2, 0, 3... Victim selected when page fault occurs on full frames.',
      example: {
        title: 'FIFO with 3 Frames',
        scenario: 'Reference String: 7, 0, 1, 2, 0, 3. Frames: 3.',
        solution: '• 7 -> [7, -, -] Fault\n• 0 -> [7, 0, -] Fault\n• 1 -> [7, 0, 1] Fault\n• 2 -> replaces oldest (7) -> [2, 0, 1] Fault\n• 0 -> already in frame -> [2, 0, 1] Hit!\n• 3 -> replaces oldest (0) -> [2, 3, 1] Fault.'
      },
      advantages: [
        'FIFO: Simplest to implement using a FIFO queue; very low hardware overhead.',
        'LRU: High performance in practice; does not suffer from Belady\'s Anomaly (stack algorithm).',
        'Optimal: Guarantees the lowest possible page fault rate for any given reference string.'
      ],
      disadvantages: [
        'FIFO: Suffers from Belady\'s Anomaly; frequently evicts heavily used initialization pages.',
        'LRU: Requires hardware support (counters or stack) to track access recency; expensive.',
        'Optimal: Requires future knowledge of page references, which is impossible in real-time systems.'
      ],
      examNotes: [
        'Belady\'s Anomaly ONLY happens in non-stack algorithms like FIFO. Stack algorithms (LRU, Optimal) CANNOT suffer Belady\'s Anomaly.',
        'Thrashing: When CPU spends more time swapping pages in/out than executing user instructions (occurs when sum of working sets > RAM).'
      ],
      practiceQuestions: [
        {
          question: 'Why can LRU never suffer from Belady’s Anomaly?',
          answer: 'LRU belongs to the class of "stack algorithms", where the set of pages in an n-frame system is always a subset of pages in an (n+1)-frame system.',
          type: 'exam'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is Belady\'s Anomaly?',
          options: [
            'Increasing CPU cores causes lower throughput',
            'Increasing number of page frames causes more page faults in FIFO',
            'Cache miss rate exceeds 90%',
            'Stack memory overflows into heap'
          ],
          correctAnswer: 1,
          explanation: 'Belady\'s Anomaly is the phenomenon where allocating more page frames leads to an increased number of page faults under certain algorithms like FIFO.'
        },
        {
          id: 'q2',
          question: 'Which page replacement algorithm is used as a theoretical gold standard?',
          options: ['LRU', 'FIFO', 'Optimal Algorithm', 'Clock Algorithm'],
          correctAnswer: 2,
          explanation: 'Optimal Algorithm (OPT) provides the absolute minimum number of page faults, but cannot be implemented because it requires future knowledge.'
        },
        {
          id: 'q3',
          question: 'What is "Thrashing" in an operating system?',
          options: [
            'A security attack that locks RAM',
            'A high page fault rate where the OS spends all its time paging rather than executing instructions',
            'Fast memory allocation using buddy systems',
            'Deleting corrupted files from disk'
          ],
          correctAnswer: 1,
          explanation: 'Thrashing occurs when memory is overcommitted and processes constantly fault, leading to near-zero CPU utilization.'
        }
      ]
    }
  }
];
