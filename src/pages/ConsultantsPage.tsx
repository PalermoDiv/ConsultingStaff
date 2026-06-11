import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { removeConsultant } from '../context/AppContext.actions'
import { ConsultantsTable } from '../components/tables/ConsultantsTable'
import { ConsultantForm } from '../components/forms/ConsultantForm'
import { Modal } from '../components/ui/Modal'
import type { Consultant } from '../types/completetypes'

export default function ConsultantsPage() {
  const { state, dispatch } = useAppContext()
  const { consultants, loading } = state

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(null)

  const handleEdit = (consultant: Consultant) => {
    setEditingConsultant(consultant)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this consultant?')) {
      await removeConsultant(dispatch, id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingConsultant(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Consultants</h2>
          <p className="text-slate-600 mt-1">
            Manage your consultant team and track their capacity
          </p>
        </div>
        <button
          onClick={() => {
            setEditingConsultant(null)
            setIsModalOpen(true)
          }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <span>+</span>
          Add Consultant
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-slate-900">{consultants.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Junior</div>
          <div className="text-2xl font-bold text-blue-600">
            {consultants.filter((c) => c.position === 'Junior Consultant').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Senior</div>
          <div className="text-2xl font-bold text-purple-600">
            {consultants.filter((c) => c.position === 'Senior Consultant' || c.position === 'Principal').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Avg Rate</div>
          <div className="text-2xl font-bold text-blue-600">
            {consultants.length > 0
              ? `$${Math.round(
                  consultants.reduce((sum, c) => sum + (c.hourly_rate || 0), 0) / consultants.length
                )}`
              : '—'}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-slate-600">Loading consultants...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <ConsultantsTable
          data={consultants}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingConsultant ? 'Edit Consultant' : 'Add Consultant'}
      >
        <ConsultantForm
          consultant={editingConsultant}
          onSuccess={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
