"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventsTable } from "@/components/admin/events-table"
import { EventFormDialog } from "@/components/admin/event-form-dialog"
import { DeleteEventDialog } from "@/components/admin/delete-event-dialog"
import {
  getEventsAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from "@/app/admin/events/actions"
import type { Event } from "@/types"
import type { CreateEventInput } from "@/lib/data/events"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Event | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)

  const refresh = () => getEventsAction().then(setEvents).finally(() => setIsLoading(false))

  useEffect(() => { refresh() }, [])

  const handleSave = async (data: CreateEventInput) => {
    if (editTarget) {
      await updateEventAction(editTarget.id, data)
    } else {
      await createEventAction(data)
    }
    await refresh()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteEventAction(deleteTarget.id)
    setDeleteTarget(null)
    await refresh()
  }

  const openCreate = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  const openEdit = (e: Event) => {
    setEditTarget(e)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Heading + action */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[#8B1A1A] font-cairo text-xs font-semibold tracking-widest mb-1 uppercase">
            Events
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1A1714]"
            style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
          >
            إدارة المناسبات
          </h1>
          <p className="font-cairo text-sm text-[#A09080] mt-1">
            {events.length} مناسبة مسجلة
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
      <EventsTable
        events={events}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      {/* Create / Edit dialog */}
      <EventFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditTarget(null)
        }}
        event={editTarget}
        onSave={handleSave}
      />

      {/* Delete confirmation dialog */}
      <DeleteEventDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        event={deleteTarget}
        onConfirm={handleDelete}
      />
    </div>
  )
}
