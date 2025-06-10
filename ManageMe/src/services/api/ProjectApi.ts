import type { Project } from '../../types/Project';

export class ProjectApi {
  private storageKey = 'projects';

  getAll(): Project[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  save(projects: Project[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  create(name: string, description: string): Project {
    const projects = this.getAll();
    const newProject = {
      id: Date.now(),
      name,
      description,
    };
    projects.push(newProject);
    this.save(projects);
    return newProject;
  }

  update(id: number, name: string, description: string): void {
    const projects = this.getAll();
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.name = name;
      project.description = description;
      this.save(projects);
    }
  }

  delete(id: number): void {
    const projects = this.getAll();
    const filtered = projects.filter((p) => p.id !== id);
    this.save(filtered);
  }
}

export const projectApi = new ProjectApi();