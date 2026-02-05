 /**
  * QuizQuestion - Active question component
  */
 
 import { useState, useEffect } from 'react';
 import { cn } from '@/lib/utils';
 import { 
   X, 
   ChevronRight, 
   Check, 
   Target,
   Trophy,
   Lightbulb
 } from 'lucide-react';
 import { SketchButton } from '@/components/shared/SketchButton';
 import { QuizQuestion as QuizQuestionType, QuizAnswer } from '@/lib/agents/quiz';
 
 interface QuizQuestionProps {
   question: QuizQuestionType;
   questionIndex: number;
   totalQuestions: number;
   correctCount: number;
   progress: number;
   isSubmitted: boolean;
   lastAnswer: QuizAnswer | undefined;
   isLastQuestion: boolean;
   onSubmit: (answer: string) => void;
   onNext: () => void;
   onFinish: () => Promise<void>;
   onClose: () => void;
 }
 
 export function QuizQuestionView({
   question,
   questionIndex,
   totalQuestions,
   correctCount,
   progress,
   isSubmitted,
   lastAnswer,
   isLastQuestion,
   onSubmit,
   onNext,
   onFinish,
   onClose,
 }: QuizQuestionProps) {
   const [selectedAnswer, setSelectedAnswer] = useState('');
   const [inputAnswer, setInputAnswer] = useState('');
   const [showHint, setShowHint] = useState(false);
 
   // Reset state when question changes
   useEffect(() => {
     setSelectedAnswer('');
     setInputAnswer('');
     setShowHint(false);
   }, [questionIndex]);
 
   const wasCorrect = lastAnswer?.isCorrect;
 
   const handleSubmit = () => {
     const answer = question.type === 'multiple_choice' 
       ? selectedAnswer 
       : inputAnswer;
     if (answer) {
       onSubmit(answer);
     }
   };
 
   const formatQuestionType = (type: string): string => {
     const labels: Record<string, string> = {
       swahili_to_english: 'Swahili → English',
       english_to_swahili: 'English → Swahili',
       multiple_choice: 'Multiple Choice',
       fill_blank: 'Fill in the Blank',
     };
     return labels[type] || type;
   };
 
   return (
     <>
       {/* Header */}
       <div className="bg-gradient-to-r from-accent/20 via-success/10 to-warning/10 p-4 border-b border-border/20">
         <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
             <div className="p-2 bg-accent/20 rounded-full">
               <Target className="text-accent" size={18} />
             </div>
             <span className="font-hand text-lg">Quiz</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 px-2 py-1 bg-success/20 rounded-full">
               <Check size={12} className="text-success" />
               <span className="font-hand-secondary text-xs text-success">{correctCount} correct</span>
             </div>
             <button 
               onClick={onClose}
               className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
             >
               <X size={18} />
             </button>
           </div>
         </div>
         
         {/* Progress bar */}
         <div className="flex items-center gap-3">
           <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-accent via-success to-warning rounded-full transition-all duration-500"
               style={{ width: `${progress}%` }}
             />
           </div>
           <span className="font-hand-secondary text-sm text-muted-foreground whitespace-nowrap">
             {questionIndex + 1}/{totalQuestions}
           </span>
         </div>
       </div>
 
       {/* Question Content */}
       <div className="p-6 md:p-8">
         {/* Question Type Badge */}
         <div className="flex justify-center mb-4">
           <div className="px-3 py-1 bg-muted/30 rounded-full border border-border/30">
             <span className="font-hand-secondary text-xs text-muted-foreground">
               {formatQuestionType(question.type)}
             </span>
           </div>
         </div>
 
         {/* Question */}
         <div className="text-center mb-6">
           <h3 className="font-hand text-xl md:text-2xl mb-4">{question.prompt}</h3>
           
           {/* Hint Button */}
           {question.hint && !isSubmitted && (
             <button
               onClick={() => setShowHint(!showHint)}
               className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
             >
               <Lightbulb size={14} />
               {showHint ? 'Hide hint' : 'Show hint'}
             </button>
           )}
           
           {showHint && question.hint && (
             <p className="mt-2 text-sm text-accent/80 bg-accent/10 rounded-lg p-3 animate-fade-in">
               💡 {question.hint}
             </p>
           )}
         </div>
 
         {/* Answer Input */}
         {!isSubmitted && (
           <div className="space-y-4">
             {question.type === 'multiple_choice' && question.options ? (
               <div className="grid grid-cols-2 gap-3">
                 {question.options.map((option, idx) => (
                   <button
                     key={idx}
                     onClick={() => setSelectedAnswer(option)}
                     className={cn(
                       "p-4 rounded-xl border-2 transition-all text-left font-hand-secondary",
                       selectedAnswer === option
                         ? "border-accent bg-accent/10 text-accent"
                         : "border-border/30 hover:border-accent/50 hover:bg-accent/5"
                     )}
                   >
                     {option}
                   </button>
                 ))}
               </div>
             ) : (
               <input
                 type="text"
                 value={inputAnswer}
                 onChange={(e) => setInputAnswer(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                 placeholder="Type your answer..."
                 className="w-full p-4 rounded-xl border-2 border-border/30 bg-background focus:border-accent focus:outline-none font-hand-secondary text-center text-lg"
                 autoFocus
               />
             )}
 
             <SketchButton
               variant="accent"
               className="w-full"
               onClick={handleSubmit}
               disabled={!selectedAnswer && !inputAnswer}
             >
               Submit Answer
               <ChevronRight size={16} />
             </SketchButton>
           </div>
         )}
 
         {/* Answer Feedback */}
         {isSubmitted && lastAnswer && (
           <div className="animate-fade-in-up">
             <div className={cn(
               "p-5 rounded-xl border-2 mb-4 text-center",
               wasCorrect 
                 ? "bg-success/10 border-success/30" 
                 : "bg-destructive/10 border-destructive/30"
             )}>
               <div className="flex justify-center mb-2">
                 {wasCorrect ? (
                   <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                     <Check className="text-success" size={24} />
                   </div>
                 ) : (
                   <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                     <X className="text-destructive" size={24} />
                   </div>
                 )}
               </div>
               <p className={cn(
                 "font-hand text-lg",
                 wasCorrect ? "text-success" : "text-destructive"
               )}>
                 {wasCorrect ? 'Correct! 🎉' : 'Not quite...'}
               </p>
               {!wasCorrect && (
                 <p className="font-hand-secondary text-sm text-muted-foreground mt-2">
                   The answer was: <span className="text-foreground font-medium">{question.correctAnswer}</span>
                 </p>
               )}
             </div>
 
             <SketchButton
               variant={isLastQuestion ? "accent" : "default"}
               className="w-full"
               onClick={isLastQuestion ? onFinish : onNext}
             >
               {isLastQuestion ? (
                 <>
                   <Trophy size={16} />
                   See Results
                 </>
               ) : (
                 <>
                   Next Question
                   <ChevronRight size={16} />
                 </>
               )}
             </SketchButton>
           </div>
         )}
       </div>
     </>
   );
 }