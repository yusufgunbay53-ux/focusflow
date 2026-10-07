"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Trash2,
  CheckCircle2,
  Circle,
  Pencil,
  X,
} from "lucide-react";
import { Task, TaskStatus, Priority, PRIORITY_LABELS, STATUS_LABELS } from "@/lib/types";

interface Props {
  tasks: Task[];
  onAdd: (title: string, priority: Priority, description?: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
}

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];
const PRIORITIES: Priority[] = ["low", "medium", "high"];

function nextPriority(current: Priority): Priority {
  const index = PRIORITIES.indexOf(current);
  return PRIORITIES[(index + 1) % PRIORITIES.length];
}

function TaskCard({
  task,
  onDelete,
  onUpdate,
  onMove,
  isOverlay = false,
}: {
  task: Task;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onMove?: (id: string, status: TaskStatus) => void;
  isOverlay?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description ?? "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", status: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityClass =
    task.priority === "high"
      ? "priority-high"
      : task.priority === "medium"
      ? "priority-medium"
      : "priority-low";

  const saveEdit = () => {
    if (editTitle.trim() && onUpdate) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
    }
    setEditing(false);
  };

  const toggleDone = () => {
    if (!onMove) return;
    onMove(task.id, task.status === "done" ? "todo" : "done");
  };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      className={`glass rounded-xl p-3 group transition-all duration-200 hover:border-neon/30 hover:-translate-y-0.5 ${
        isOverlay ? "shadow-neon scale-105 rotate-1" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        {!isOverlay && (
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 p-1 rounded text-sky-400/40 hover:text-neon cursor-grab active:cursor-grabbing touch-none"
            aria-label="Sürükle"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}

        {!isOverlay && (
          <button
            onClick={toggleDone}
            className="mt-0.5 p-1 rounded text-sky-400/50 hover:text-emerald-400 transition-colors"
            title={task.status === "done" ? "Geri al" : "Tamamla"}
            aria-label={task.status === "done" ? "Geri al" : "Tamamla"}
          >
            {task.status === "done" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </button>
        )}

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditing(false);
                }}
                className="w-full bg-night/60 border border-neon/30 rounded-lg px-2 py-1 text-sm outline-none focus:border-neon"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                placeholder="Kısa açıklama"
                className="w-full bg-night/60 border border-neon/20 rounded-lg px-2 py-1 text-xs outline-none focus:border-neon resize-none"
              />
              <div className="flex gap-1">
                <button onClick={saveEdit} className="p-1 text-neon" aria-label="Kaydet">
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button onClick={() => setEditing(false)} className="p-1 text-sky-400/60" aria-label="İptal">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-sm leading-snug ${
                task.status === "done" ? "line-through text-sky-400/50" : "text-sky-100"
              }`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-[11px] text-sky-400/60 mt-1 line-clamp-2">{task.description}</p>
              )}
            </>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => onUpdate?.(task.id, { priority: nextPriority(task.priority) })}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityClass}`}
              title="Önceliği değiştir"
            >
              {PRIORITY_LABELS[task.priority]}
            </button>
          </div>
        </div>

        {!isOverlay && !editing && (
          <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setEditTitle(task.title);
                setEditDescription(task.description ?? "");
                setEditing(true);
              }}
              className="p-1 rounded hover:bg-neon/10 text-sky-400/60 hover:text-neon"
              aria-label="Düzenle"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="p-1 rounded hover:bg-rose-500/10 text-sky-400/60 hover:text-rose-400"
              aria-label="Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Column({
  status,
  tasks,
  onDelete,
  onUpdate,
  onMove,
}: {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onMove: (id: string, status: TaskStatus) => void;
}) {
  const columnTasks = tasks.filter((t) => t.status === status);
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[280px] glass rounded-2xl overflow-hidden transition-all ${
        isOver ? "border-neon/40 shadow-neon-sm" : ""
      }`}
    >
      <div className="px-4 py-3 border-b border-neon/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sky-100 flex items-center gap-2">
          {status === "todo" && <Circle className="w-3.5 h-3.5 text-sky-400" />}
          {status === "in_progress" && (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-neon border-t-transparent animate-spin" />
          )}
          {status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-sky-400/50 bg-night/50 px-2 py-0.5 rounded-full">
          {columnTasks.length}
        </span>
      </div>

      <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[520px]">
          {columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onMove={onMove}
            />
          ))}
          {columnTasks.length === 0 && (
            <div className="text-center py-8 text-sky-400/30 text-xs">Görev yok — buraya sürükle</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ tasks, onAdd, onUpdate, onDelete, onMove }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id as string;
    const overId = String(over.id);

    if (COLUMNS.includes(overId as TaskStatus)) {
      onMove(taskId, overId as TaskStatus);
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) onMove(taskId, overTask.status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority, description.trim() || undefined);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setShowForm(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-sky-100">Görev Panosu</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon/10 border border-neon/30 text-neon text-sm font-medium hover:bg-neon/20 hover:shadow-neon-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Görev
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Görev başlığı..."
              className="flex-1 bg-night/50 border border-neon/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neon placeholder:text-sky-400/40"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="bg-night/50 border border-neon/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neon"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-neon text-night font-semibold text-sm hover:bg-neon-dim transition-colors"
            >
              Ekle
            </button>
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="İsteğe bağlı açıklama"
            className="bg-night/50 border border-neon/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neon placeholder:text-sky-400/40"
          />
        </form>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onMove={onMove}
            />
          ))}
        </div>
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>
      </DndContext>
    </section>
  );
}
