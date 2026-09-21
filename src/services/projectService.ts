import { Project } from '../types';
import { StorageService } from './storageService';

export class ProjectService {
  static getProjects(): Project[] {
    return StorageService.getProjects();
  }

  static createProject(name: string, description: string = '', color: string = '#00f0ff', icon: string = 'Folder'): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      createdAt: Date.now(),
    };
    projects.push(newProject);
    StorageService.saveProjects(projects);
    return newProject;
  }

  static updateProject(id: string, updates: Partial<Project>): void {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...updates };
      StorageService.saveProjects(projects);
    }
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    StorageService.saveProjects(projects);
  }
}
