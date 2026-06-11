import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppContext } from '../../context/AppContext'
import { addConsultant, editConsultant } from '../../context/AppContext.actions'
import type { Consultant } from '../../types/completetypes'

const consultantSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  position: z.enum(['Junior Consultant', 'Consultant', 'Senior Consultant', 'Principal', 'Partner', 'Project Manager']),
  capacity_hours_per_week: z.number().min(1).max(168),
  hourly_rate: z.number().min(0).nullable(),
  is_active: z.boolean(),
})

type ConsultantFormData = z.infer<typeof consultantSchema>

interface ConsultantFormProps {
  consultant?: Consultant | null
  onSuccess: () => void
}

export function ConsultantForm({ consultant, onSuccess }: ConsultantFormProps) {
  const { dispatch } = useAppContext()
  const isEditing = !!consultant

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
    defaultValues: consultant
      ? {
          first_name: consultant.first_name,
          last_name: consultant.last_name,
          email: consultant.email,
          position: consultant.position,
          capacity_hours_per_week: consultant.capacity_hours_per_week,
          hourly_rate: consultant.hourly_rate,
          is_active: consultant.is_active,
        }
      : {
          position: 'Junior Consultant',
          capacity_hours_per_week: 40,
          is_active: true,
          hourly_rate: null,
        },
  })

  const onSubmit = async (data: ConsultantFormData) => {
    try {
      if (isEditing && consultant) {
        await editConsultant(dispatch, consultant.consultant_id, data)
      } else {
        await addConsultant(dispatch, data)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save consultant:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First Name
          </label>
          <input
            {...register('first_name')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="John"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Last Name
          </label>
          <input
            {...register('last_name')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Doe"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="john.doe@company.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Position
          </label>
          <select
            {...register('position')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value="Junior Consultant">Junior Consultant</option>
            <option value="Consultant">Consultant</option>
            <option value="Senior Consultant">Senior Consultant</option>
            <option value="Principal">Principal</option>
            <option value="Partner">Partner</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Capacity (hours/week)
          </label>
          <input
            {...register('capacity_hours_per_week', { valueAsNumber: true })}
            type="number"
            min={1}
            max={168}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Hourly Rate ($)
        </label>
        <input
          {...register('hourly_rate', { valueAsNumber: true })}
          type="number"
          min={0}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="150"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Consultant' : 'Create Consultant'}
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
