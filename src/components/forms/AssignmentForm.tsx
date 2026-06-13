import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppContext } from '../../context/AppContext'
import { addAssignment, editAssignment } from '../../context/AppContext.actions'
import type { Assignment } from '../../types/completetypes'

const assignmentSchema = z.object({
  fk_consultant_id: z.string().min(1, 'Consultant is required'),
  fk_project_id: z.string().min(1, 'Project is required'),
  allocation_percentage: z.number().min(1).max(100),
  status: z.enum(['Pending', 'Active', 'Completed', 'Cancelled']),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  total_hours: z.number().nullable().optional(),
  is_active: z.boolean().optional(),
})

type AssignmentFormData = z.infer<typeof assignmentSchema>

interface AssignmentFormProps {
  assignment?: Assignment | null
  onSuccess: () => void
}

export function AssignmentForm({ assignment, onSuccess }: AssignmentFormProps) {
  const { state, dispatch } = useAppContext()
  const { consultants, projects } = state
  const isEditing = !!assignment

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: assignment
      ? {
          fk_consultant_id: assignment.fk_consultant_id,
          fk_project_id: assignment.fk_project_id,
          allocation_percentage: assignment.allocation_percentage,
          status: assignment.status,
          start_date: assignment.start_date,
          end_date: assignment.end_date,
          total_hours: assignment.total_hours,
          is_active: assignment.is_active,
        }
      : {
          status: 'Pending',
          allocation_percentage: 50,
          is_active: true,
        },
  })

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      const cleanedData = {
        ...data,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        total_hours: data.total_hours ?? null,
        is_active: data.is_active ?? true,
      }

      if (isEditing && assignment) {
        await editAssignment(dispatch, assignment.assignment_id, cleanedData)
      } else {
        await addAssignment(dispatch, cleanedData)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save assignment:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Consultant */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Consultant
        </label>
        <select
          {...register('fk_consultant_id')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">Select a consultant</option>
          {consultants.map((consultant) => (
            <option key={consultant.consultant_id} value={consultant.consultant_id}>
              {consultant.first_name} {consultant.last_name} ({consultant.position})
            </option>
          ))}
        </select>
        {errors.fk_consultant_id && (
          <p className="text-red-500 text-sm mt-1">{errors.fk_consultant_id.message}</p>
        )}
      </div>

      {/* Project */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project
        </label>
        <select
          {...register('fk_project_id')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name} ({project.status})
            </option>
          ))}
        </select>
        {errors.fk_project_id && (
          <p className="text-red-500 text-sm mt-1">{errors.fk_project_id.message}</p>
        )}
      </div>

      {/* Allocation Percentage */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Allocation Percentage (%)
        </label>
        <input
          {...register('allocation_percentage', { valueAsNumber: true })}
          type="number"
          min={1}
          max={100}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="e.g. 50"
        />
        {errors.allocation_percentage && (
          <p className="text-red-500 text-sm mt-1">{errors.allocation_percentage.message}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          Percentage of the consultant's capacity allocated to this project.
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
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

      {/* Total Hours */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Total Hours (Optional)
        </label>
        <input
          {...register('total_hours', { valueAsNumber: true })}
          type="number"
          min={0}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="e.g. 200"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Assignment' : 'Create Assignment'}
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
