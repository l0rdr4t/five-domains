'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Question } from '@/components/Question'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

const questions = [
  {
    id: 1,
    text: "What's your favorite way to spend a weekend?",
    answers: [
      { id: 'a1', text: 'Reading a book' },
      { id: 'a2', text: 'Watching movies' },
      { id: 'a3', text: 'Outdoor activities' },
      { id: 'a4', text: 'Cooking' },
      { id: 'a5', text: 'Spending time with friends' },
    ],
  },
  {
    id: 2,
    text: "Which trait do you value most in a friend?",
    answers: [
      { id: 'b1', text: 'Honesty' },
      { id: 'b2', text: 'Sense of humor' },
      { id: 'b3', text: 'Loyalty' },
      { id: 'b4', text: 'Intelligence' },
      { id: 'b5', text: 'Empathy' },
    ],
  },
  // Add more questions here
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(questions.map(q => q.answers))
  const [isComplete, setIsComplete] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setAnswers((items) => {
        const oldIndex = items[currentQuestion].findIndex((item) => item.id === active.id)
        const newIndex = items[currentQuestion].findIndex((item) => item.id === over?.id)

        return items.map((item, index) => {
          if (index === currentQuestion) {
            return arrayMove(item, oldIndex, newIndex)
          }
          return item
        })
      })
    }
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsComplete(true)
    }
  }

  if (isComplete) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
        {questions.map((question, index) => (
          <div key={question.id} className="mb-4">
            <h2 className="text-xl font-semibold">{question.text}</h2>
            <ol className="list-decimal pl-6">
              {answers[index].map((answer, i) => (
                <li key={answer.id}>{answer.text} | {i.toString()}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4" />
      <h1 className="text-2xl font-bold mb-4">{questions[currentQuestion].text}</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={answers[currentQuestion]} strategy={verticalListSortingStrategy}>
          <Question answers={answers[currentQuestion]} />
        </SortableContext>
      </DndContext>
      <Button onClick={handleNext} className="mt-4">
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </div>
  )
}

