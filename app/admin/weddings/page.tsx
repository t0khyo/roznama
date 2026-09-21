"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeddingsTable } from "@/components/admin/weddings-table"
import { WeddingFormDialog } from "@/components/admin/wedding-form-dialog"
import { DeleteWeddingDialog } from "@/components/admin/delete-wedding-dialog"
import {
  getWeddings,
  createWedding,
  updateWedding,
  deleteWedding,
} from "@/lib/data/weddings"
import type { Wedding } from "@/types"

export default function AdminWeddingsPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Wedding | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Wedding | null>(null)

  const refresh = () => getWeddings().then(setWeddings)

  useEffect(() => { refresh() }, [])

  const handleSave = async (data: Omit<Wedding, "id">) => {
    if (editTarget) {
      await updateWedding(editTarget.id, data)
    } else {
      await createWedding(data)
    }
    await refresh()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteWedding(deleteTarget.id)
    setDeleteTarget(null)
    await refresh()
  }

  const openCreate = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  const openEdit = (w: Wedding) => {
    setEditTarget(w)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Heading + action */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[#8B1A1A] font-cairo text-xs font-semibold tracking-widest mb-1 uppercase">
            Weddings
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1A1714]"
            style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
          >
            إدارة المناسبات
          </h1>
          <p className="font-cairo text-sm text-[#A09080] mt-1">
            {weddings.length} مناسبة مسجلة
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="font-cairo font-bold bg-[#8B1A1A] text-[#FAF8F3] hover:bg-[#6A1212] h-9 gap-2"
        >
          إضافة مناسبة
          <PlusIcon className="size-4" />
        </Button>
      </div>

      {/* Table */}
      <WeddingsTable
        weddings={weddings}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      {/* Create / Edit dialog */}
      <WeddingFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditTarget(null)
        }}
        wedding={editTarget}
        onSave={handleSave}
      />

      {/* Delete confirmation dialog */}
      <DeleteWeddingDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        wedding={deleteTarget}
        onConfirm={handleDelete}
      />
    </div>
  )
}
