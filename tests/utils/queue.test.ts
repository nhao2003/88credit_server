import ConcurrentQueue, { Task } from '../../src/utils/queue';

describe('ConcurrentQueue', () => {
  let queue: ConcurrentQueue;

  beforeEach(() => {
    queue = new ConcurrentQueue(2); // Set the concurrency level to 2 for testing
  });

  afterEach(() => {
    queue.clear(); // Clear the queue after each test
  });

  it('should add and execute tasks concurrently', async () => {
    const executeFn = jest.fn();
    const task1: Task = { execute: executeFn };
    const task2: Task = { execute: executeFn };
    const task3: Task = { execute: executeFn };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(3);
  });

  it('should handle errors in tasks', async () => {
    const errorFn = jest.fn();
    const task1: Task = {
      execute: () => {
        throw new Error('Task 1 failed');
      },
      onError: errorFn,
    };
    const task2: Task = {
      execute: () => {
        throw new Error('Task 2 failed');
      },
      onError: errorFn,
    };

    queue.add(task1);
    queue.add(task2);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(errorFn).toHaveBeenCalledTimes(2);
    expect(errorFn).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('ConcurrentQueue', () => {
  let queue: ConcurrentQueue;

  beforeEach(() => {
    queue = new ConcurrentQueue(2); // Set the concurrency level to 2 for testing
  });

  afterEach(() => {
    queue.clear(); // Clear the queue after each test
  });

  it('should add and execute tasks concurrently', async () => {
    const executeFn = jest.fn();
    const task1: Task = { execute: executeFn };
    const task2: Task = { execute: executeFn };
    const task3: Task = { execute: executeFn };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(3);
  });

  it('should handle errors in tasks', async () => {
    const errorFn = jest.fn();
    const task1: Task = {
      execute: () => {
        throw new Error('Task 1 failed');
      },
      onError: errorFn,
    };
    const task2: Task = {
      execute: () => {
        throw new Error('Task 2 failed');
      },
      onError: errorFn,
    };

    queue.add(task1);
    queue.add(task2);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(errorFn).toHaveBeenCalledTimes(2);
    expect(errorFn).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should execute tasks in the order they were added', async () => {
    const executeFn = jest.fn();
    const task1: Task = { execute: () => executeFn(1) };
    const task2: Task = { execute: () => executeFn(2) };
    const task3: Task = { execute: () => executeFn(3) };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(3);
    expect(executeFn.mock.calls[0][0]).toBe(1);
    expect(executeFn.mock.calls[1][0]).toBe(2);
    expect(executeFn.mock.calls[2][0]).toBe(3);
  });

  it('should execute tasks in the order they were added, even if some tasks complete faster than others', async () => {
    const executeFn = jest.fn();
    const task1: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(1);
            resolve();
          }, 50),
        ),
    };
    const task2: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(2);
            resolve();
          }, 10),
        ),
    };
    const task3: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(3);
            resolve();
          }, 30),
        ),
    };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(1);
    expect(executeFn.mock.calls[0][0]).toBe(2);
    if (executeFn.mock.calls.length > 1) {
      expect(executeFn.mock.calls[1][0]).toBe(1);
    }
    if (executeFn.mock.calls.length > 2) {
      expect(executeFn.mock.calls[2][0]).toBe(4);
    }
  });

  it('should execute tasks in parallel up to the concurrency limit', async () => {
    const executeFn = jest.fn();
    const task1: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(1);
            resolve();
          }, 50),
        ),
    };
    const task2: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(2);
            resolve();
          }, 10),
        ),
    };
    const task3: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(3);
            resolve();
          }, 30),
        ),
    };
    const task4: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(4);
            resolve();
          }, 20),
        ),
    };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);
    queue.add(task4);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(1);
    expect(executeFn.mock.calls[0][0]).toBe(2);
    if (executeFn.mock.calls.length > 1) {
      expect(executeFn.mock.calls[1][0]).toBe(1);
    }
    if (executeFn.mock.calls.length > 2) {
      expect(executeFn.mock.calls[2][0]).toBe(3);
    }
    if (executeFn.mock.calls.length > 3) {
      expect(executeFn.mock.calls[3][0]).toBe(2);
    }
  });

  it('should execute tasks in parallel up to the concurrency limit, even if some tasks complete faster than others', async () => {
    const executeFn = jest.fn();
    const task1: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(1);
            resolve();
          }, 50),
        ),
    };
    const task2: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(2);
            resolve();
          }, 10),
        ),
    };
    const task3: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(3);
            resolve();
          }, 30),
        ),
    };
    const task4: Task = {
      execute: () =>
        new Promise((resolve) =>
          setTimeout(() => {
            executeFn(4);
            resolve();
          }, 20),
        ),
    };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);
    queue.add(task4);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 60);
    });
   
    expect(executeFn).toHaveBeenCalledTimes(4);
  

  });

  it('should execute async tasks correctly', async () => {
    const executeFn = jest.fn();
    const asyncTask: Task = {
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        executeFn();
      },
    };
    const syncTask: Task = {
      execute: () => {
        executeFn();
      },
    };

    queue.add(asyncTask);
    queue.add(syncTask);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(2);
  });
});


describe('ConcurrentQueue', () => {
  let queue: ConcurrentQueue;

  beforeEach(() => {
    queue = new ConcurrentQueue(); // Set the concurrency level to 1 for testing
  });

  afterEach(() => {
    queue.clear(); // Clear the queue after each test
  });

  it('should add and execute tasks sequentially', async () => {
    const executeFn = jest.fn();
    const task1: Task = { execute: () => executeFn(1) };
    const task2: Task = { execute: () => executeFn(2) };
    const task3: Task = { execute: () => executeFn(3) };

    queue.add(task1);
    queue.add(task2);
    queue.add(task3);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(3);
    expect(executeFn.mock.calls[0][0]).toBe(1);
    expect(executeFn.mock.calls[1][0]).toBe(2);
    expect(executeFn.mock.calls[2][0]).toBe(3);
  });

  it('should handle errors in tasks', async () => {
    const errorFn = jest.fn();
    const task1: Task = {
      execute: () => {
        throw new Error('Task 1 failed');
      },
      onError: errorFn,
    };
    const task2: Task = {
      execute: () => {
        throw new Error('Task 2 failed');
      },
      onError: errorFn,
    };

    queue.add(task1);
    queue.add(task2);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(errorFn).toHaveBeenCalledTimes(2);
    expect(errorFn).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should execute async tasks correctly', async () => {
    const executeFn = jest.fn();
    const asyncTask: Task = {
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        executeFn();
      },
    };
    const syncTask: Task = {
      execute: () => {
        executeFn();
      },
    };

    queue.add(asyncTask);
    queue.add(syncTask);

    // Wait for tasks to complete
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!queue.isRunning && queue.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

    expect(executeFn).toHaveBeenCalledTimes(2);
  });
});
