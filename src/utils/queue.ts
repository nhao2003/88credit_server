/**
 * A task to be executed by a ConcurrentQueue.
 * @typedef {Object} Task
 * @property {Function} execute The function to execute.
 * @property {Function} onError A function to execute if an error occurs.
 * @property {Error} onError.err The error that occurred.
 *
 * @example
 * const task = {
 *  execute: async () => {
 *   await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate an async task
 *  console.log('Task complete');
 * },
 * onError: (err) => {
 * console.error(err);
 * }
 * };
 */
export type Task = {
  execute: (() => void) | (() => Promise<void>);
  onError?: (err: Error) => void | Promise<void>;
};

/**
 * A ConcurrentQueue allows you to execute tasks concurrently with a specified level of concurrency.
 */
class ConcurrentQueue {
  private tasks: Task[] = [];
  private concurrency: number;
  private count: number = 0;

  /**
   * Creates a new ConcurrentQueue with the specified concurrency level.
   * @param concurrency The maximum number of tasks that can run concurrently.
   */
  constructor(concurrency: number = 1) {
    this.concurrency = concurrency;
  }

  /**
   * Adds a task to the queue for concurrent execution.
   * @param task A function that represents the task to be executed.
   */
  add(task: Task) {
    this.tasks.push(task);
    this.next();
  }

  /**
   * Clears all tasks from the queue.
   */
  public clear() {
    this.tasks = [];
  }

  /**
   * Gets the number of tasks remaining in the queue.
   */
  get length() {
    return this.tasks.length;
  }

  /**
   * Checks if the queue is currently executing tasks.
   */
  get isRunning(): boolean {
    return this.count > 0;
  }

  /**
   * Executes the next task in the queue.
   * @private
   * @returns void
   * @memberof ConcurrentQueue
   * @description
   * This method is called recursively to execute tasks in the queue.
   * It will only execute tasks if the number of currently executing tasks is less than the specified concurrency level.
   * If there are no tasks remaining in the queue, this method will do nothing.
   * If there are tasks remaining in the queue, but the concurrency level has been reached, this method will do nothing.
   */
  private next() {
    if (this.count < this.concurrency && this.tasks.length) {
      const task = this.tasks.shift();
      if (task) {
        this.run(task);
      }
    }
  }

  /**
   * Executes a task.
   * @private
   * @param {Task} task The task to execute.
   * @returns {Promise<void>}
   * @memberof ConcurrentQueue
   * @description
   * This method will execute the specified task and handle any errors that occur.
   * If the task is an async function, this method will wait for it to complete before executing the next task.
   * If the task is not an async function, this method will execute the next task immediately.
   */
  private async run(task: Task) {
    this.count++;
    try {
      if (task.execute.constructor.name === 'AsyncFunction') {
        await task.execute();
      } else {
        task.execute();
      }
    } catch (err: any) {
      if (task.onError) {
        task.onError(err);
      }
    } finally {
      this.count--;
      this.next();
    }
  }
}

export default ConcurrentQueue;
