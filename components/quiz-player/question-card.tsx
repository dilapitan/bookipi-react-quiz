'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { questionType, type Question } from '@/schema/questionSchema'

interface QuestionCardProps {
  question: Question
  answer: string
  onAnswerChange: (answer: string) => void
  onPaste?: () => void
}

export default function QuestionCard({
  question,
  answer,
  onAnswerChange,
  onPaste,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {question.prompt}
          </ReactMarkdown>
        </div>
        <div className="flex gap-2 mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
              question.type === questionType.enum.mcq
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : question.type === questionType.enum.short
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            }`}
          >
            {question.type === questionType.enum.mcq
              ? 'Multiple Choice'
              : question.type === questionType.enum.short
                ? 'Short Answer'
                : 'Code'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multiple Choice Question */}
        {question.type === questionType.enum.mcq && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  answer === option
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onAnswerChange(option)}
              >
                <input
                  type="radio"
                  id={`option-${question.id}-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer === option}
                  onChange={e => onAnswerChange(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <Label
                  htmlFor={`option-${question.id}-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* Short Answer Question */}
        {question.type === questionType.enum.short && (
          <div className="space-y-2">
            <Label htmlFor={`answer-${question.id}`}>Your Answer</Label>
            <Input
              id={`answer-${question.id}`}
              type="text"
              placeholder="Type your answer here..."
              value={answer}
              onChange={e => onAnswerChange(e.target.value)}
              onPaste={onPaste}
              autoComplete="off"
            />
          </div>
        )}

        {/* Code Question */}
        {question.type === questionType.enum.code && (
          <div className="space-y-2">
            <Label htmlFor={`answer-${question.id}`}>Your Code</Label>
            <Textarea
              id={`answer-${question.id}`}
              placeholder="Write your code here..."
              value={answer}
              onChange={e => onAnswerChange(e.target.value)}
              onPaste={onPaste}
              className="font-mono min-h-50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
