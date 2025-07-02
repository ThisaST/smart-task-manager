import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBulkCreateTasks } from '@/shared/hooks/useTaskQueries';
import { generateRandomTasks, TASK_GENERATION_PRESETS, type TaskGenerationPreset } from '@/shared/utils/taskGenerator';

interface TaskDataGeneratorProps {
  className?: string;
}

export function TaskDataGenerator({ className }: TaskDataGeneratorProps) {
  const [selectedPreset, setSelectedPreset] = useState<TaskGenerationPreset>('100');
  const bulkCreateMutation = useBulkCreateTasks();

  const handleGenerateTasks = async () => {
    const count = TASK_GENERATION_PRESETS[selectedPreset];
    const randomTasks = generateRandomTasks(count);
    
    try {
      await bulkCreateMutation.mutateAsync(randomTasks);
    } catch (error) {
      console.error('Failed to generate tasks:', error);
    }
  };

  const isLoading = bulkCreateMutation.isPending;
  const isSuccess = bulkCreateMutation.isSuccess;
  const isError = bulkCreateMutation.isError;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Task Data Generator
        </CardTitle>
        <CardDescription>
          Generate random task data for testing virtualization and performance. 
          This will create realistic tasks with random titles, descriptions, priorities, and due dates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of tasks to generate:</label>
          <Select value={selectedPreset} onValueChange={(value: TaskGenerationPreset) => setSelectedPreset(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select number of tasks" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TASK_GENERATION_PRESETS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.toLocaleString()} tasks
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generation Button */}
        <Button
          onClick={handleGenerateTasks}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading 
            ? `Generating ${TASK_GENERATION_PRESETS[selectedPreset]} tasks...` 
            : `Generate ${TASK_GENERATION_PRESETS[selectedPreset]} Tasks`
          }
        </Button>

        {/* Status Messages */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Creating {TASK_GENERATION_PRESETS[selectedPreset]} random tasks...
            </span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Successfully generated {TASK_GENERATION_PRESETS[selectedPreset]} tasks!
            </span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Failed to generate tasks. Please try again.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 