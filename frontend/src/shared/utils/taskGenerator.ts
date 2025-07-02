import type { CreateTaskInput } from '@/modules/tasks/types/task.types';

/**
 * Sample task titles for random generation
 */
const SAMPLE_TITLES = [
  // Development Tasks
  'Implement user authentication system',
  'Fix responsive design issues',
  'Add search functionality',
  'Optimize database queries',
  'Update API documentation',
  'Create unit tests for login module',
  'Refactor legacy code',
  'Implement real-time notifications',
  'Add file upload feature',
  'Fix memory leak in dashboard',
  'Update dependencies to latest versions',
  'Implement data caching',
  'Add error logging',
  'Create admin dashboard',
  'Implement password reset functionality',
  
  // Business Tasks
  'Review quarterly reports',
  'Schedule team meeting',
  'Update project timeline',
  'Prepare client presentation',
  'Conduct user interview',
  'Analyze competitor research',
  'Write blog post about new features',
  'Update marketing materials',
  'Review budget allocation',
  'Plan product roadmap',
  'Create onboarding documentation',
  'Update privacy policy',
  'Conduct performance review',
  'Prepare monthly newsletter',
  'Review contract terms',
  
  // Design Tasks
  'Design new landing page',
  'Create wireframes for mobile app',
  'Update brand guidelines',
  'Design email templates',
  'Create icon set',
  'Redesign navigation menu',
  'Create style guide',
  'Design loading animations',
  'Update color palette',
  'Create illustration for homepage',
  'Design dashboard widgets',
  'Create prototype for new feature',
  'Update typography system',
  'Design error pages',
  'Create onboarding flow',
  
  // Operations
  'Deploy to production',
  'Set up monitoring alerts',
  'Backup database',
  'Update security certificates',
  'Configure load balancer',
  'Monitor system performance',
  'Update server configuration',
  'Implement CI/CD pipeline',
  'Set up staging environment',
  'Review security audit',
  'Update backup procedures',
  'Configure CDN',
  'Monitor API rate limits',
  'Update firewall rules',
  'Set up disaster recovery'
];

/**
 * Sample task descriptions for random generation
 */
const SAMPLE_DESCRIPTIONS = [
  'Set up user authentication with JWT tokens and secure password hashing',
  'Add search capabilities to the application with filters and sorting',
  'Implement API rate limiting and throttling to prevent abuse',
  'Add file upload functionality with validation and security checks',
  'Build admin interface for system management and user control',
  'Create comprehensive test coverage for critical application components',
  'Optimize application performance and reduce loading times',
  'Set up monitoring and alerting for production systems',
  'Implement responsive design that works across all device sizes',
  'Add real-time features using WebSocket connections',
  'Create detailed documentation for developers and end users',
  'Integrate with third-party services and APIs',
  'Set up automated deployment pipeline for faster releases',
  'Implement data analytics and reporting features',
  'Add internationalization support for multiple languages',
  'Create backup and disaster recovery procedures',
  'Implement security best practices and vulnerability fixes',
  'Add advanced filtering and search capabilities',
  'Create mobile-first design approach',
  'Set up development and testing environments',
  null, // Some tasks won't have descriptions
  null,
  null
];

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random date between now and maxDaysFromNow
 */
function randomFutureDate(maxDaysFromNow: number = 60): Date {
  const now = new Date();
  const futureDate = new Date(now.getTime() + randomInt(1, maxDaysFromNow) * 24 * 60 * 60 * 1000);
  return futureDate;
}

/**
 * Generate a single random task
 */
export function generateRandomTask(): CreateTaskInput {
  const title = randomItem(SAMPLE_TITLES);
  const description = randomItem(SAMPLE_DESCRIPTIONS);
  const priority = randomInt(1, 3); // 1=Low, 2=Medium, 3=High
  
  // Business rule: High priority tasks (3) must have due dates
  // For other priorities, 70% chance of having a due date
  const mustHaveDueDate = priority === 3; // High priority
  const hasDueDate = mustHaveDueDate || Math.random() > 0.3;
  const dueDate = hasDueDate ? randomFutureDate().toISOString() : undefined;
  
  return {
    title,
    description: description || undefined,
    priority,
    dueDate
  };
}

/**
 * Generate multiple random tasks
 */
export function generateRandomTasks(count: number): CreateTaskInput[] {
  const tasks: CreateTaskInput[] = [];
  
  for (let i = 0; i < count; i++) {
    tasks.push(generateRandomTask());
  }
  
  return tasks;
}

/**
 * Predefined task generation presets
 */
export const TASK_GENERATION_PRESETS = {
  '100': 100,
  '500': 500,
  '1000': 1000,
} as const;

export type TaskGenerationPreset = keyof typeof TASK_GENERATION_PRESETS; 