import { type Task, type InsertTask } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Task methods
  getTasksByDate(date: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  getAllTasks(): Promise<Task[]>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;

  constructor() {
    this.tasks = new Map();
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.date === date);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      completed: insertTask.completed ?? false,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
}

export const storage = new MemStorage();
