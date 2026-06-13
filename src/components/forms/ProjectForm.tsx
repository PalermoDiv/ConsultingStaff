import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppContext } from '../../context/AppContext'
import { addProject, editProject } from '../../context/AppContext.actions'
import type { Project } from '../../types/completetypes'

const projectSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  description: z.string().nullable().optional(),
  fk_client_id: z.string().nullable().optional(),
  status: z.enum(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  total_estimated_hours: z.number().nullable().optional(),
  fk_project_manager_id: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: Project | null
  onSuccess: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { state, dispatch } = useAppContext()
  const { clients, consultants } = state
  const isEditing = !!project

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          project_name: project.project_name,
          description: project.description,
          fk_client_id: project.fk_client_id,
          status: project.status,
          start_date: project.start_date,
          end_date: project.end_date,
          total_estimated_hours: project.total_estimated_hours,
          fk_project_manager_id: project.fk_project_manager_id,
          is_active: project.is_active,
        }
      : {
          status: 'Planning',
          is_active: true,
        },
  })

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Clean up empty strings into null for nullable fields
      const cleanedData = {
        ...data,
        fk_client_id: data.fk_client_id || null,
        fk_project_manager_id: data.fk_project_manager_id || null,
        description: data.description || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        total_estimated_hours: data.total_estimated_hours ?? null,
        is_active: data.is_active ?? true,
      }

      if (isEditing && project) {
        await editProject(dispatch, project.project_id, cleanedData)
      } else {
        await addProject(dispatch, cleanedData)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project Name
        </label>
        <input
          {...register('project_name')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="e.g. Digital Transformation Initiative"
        />
        {errors.project_name && (
          <p className="text-red-500 text-sm mt-1">{errors.project_name.message}</p>
        )}
      </div>

      {/* Client + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Client
          </label>
          <select
            {...register('fk_client_id')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value="">No Client</option>
            {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.client_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Project Manager */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project Manager
        </label>
        <select
          {...register('fk_project_manager_id')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">Unassigned</option>
          {consultants.map((consultant) => (
            <option key={consultant.consultant_id} value={consultant.consultant_id}>
              {consultant.first_name} {consultant.last_name} ({consultant.position})
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start Date
          </label>
          <input
            {...register('start_date')}
            type="date"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            End Date
          </label>
          <input
            {...register('end_date')}
            type="date"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Estimated Hours */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Total Estimated Hours
        </label>
        <input
          {...register('total_estimated_hours', { valueAsNumber: true })}
          type="number"
          min={0}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="e.g. 1200"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          placeholder="Brief description of the project scope and goals..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={onSuccess}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
