import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

function SortableAnswer({ answer }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: answer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center p-2 mb-2 bg-white border rounded shadow cursor-move"
    >
      <GripVertical className="mr-2" />
      {answer.text}
    </div>
  )
}

export function Question({ answers }) {
  return (
    <div>
      {answers.map((answer) => (
        <SortableAnswer key={answer.id} answer={answer} />
      ))}
    </div>
  )
}

