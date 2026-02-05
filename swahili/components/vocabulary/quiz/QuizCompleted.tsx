 /**
  * QuizCompleted - Results display component
  */
 
 import { cn } from '@/lib/utils';
 import { Zap, RefreshCw } from 'lucide-react';
 import { SketchButton } from '@/components/shared/SketchButton';
 
 interface QuizCompletedProps {
   score: number;
   totalQuestions: number;
   xpEarned: number;
   feedback: string | null;
   onClose: () => void;
   onRetry: () => void;
 }
 
 export function QuizCompleted({ 
   score, 
   totalQuestions, 
   xpEarned, 
   feedback, 
   onClose, 
   onRetry 
 }: QuizCompletedProps) {
   const percentage = score / totalQuestions;
   
   return (
     <div className="p-8 text-center">
       {/* Score Circle */}
       <div className="relative w-32 h-32 mx-auto mb-6">
         <svg className="w-full h-full transform -rotate-90">
           <circle
             cx="64"
             cy="64"
             r="56"
             stroke="currentColor"
             strokeWidth="12"
             fill="none"
             className="text-muted/30"
           />
           <circle
             cx="64"
             cy="64"
             r="56"
             stroke="currentColor"
             strokeWidth="12"
             fill="none"
             strokeDasharray={`${percentage * 352} 352`}
             strokeLinecap="round"
             className={cn(
               "transition-all duration-1000",
               score === totalQuestions ? "text-warning" :
               score >= 8 ? "text-success" :
               score >= 6 ? "text-accent" : "text-muted-foreground"
             )}
           />
         </svg>
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="text-center">
             <span className="font-hand text-3xl">{score}</span>
             <span className="font-hand-secondary text-muted-foreground">/{totalQuestions}</span>
           </div>
         </div>
       </div>
 
       {/* Result Title */}
       <h3 className="font-hand text-2xl mb-2">
         {score === totalQuestions ? '🏆 Perfect!' :
          score >= 8 ? '🌟 Excellent!' :
          score >= 6 ? '🌱 Good job!' : '💪 Keep practicing!'}
       </h3>
 
       {/* XP Earned */}
       <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/20 rounded-full mb-4">
         <Zap size={16} className="text-warning" />
         <span className="font-hand text-warning">+{xpEarned} XP earned!</span>
       </div>
 
       {/* AI Feedback */}
       {feedback && (
         <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
           <p className="font-hand-secondary text-sm text-muted-foreground">{feedback}</p>
         </div>
       )}
 
       {/* Actions */}
       <div className="flex gap-3 justify-center">
         <SketchButton variant="outline" onClick={onClose}>
           Done
         </SketchButton>
         <SketchButton variant="accent" onClick={onRetry}>
           <RefreshCw size={16} />
           Take Another Quiz
         </SketchButton>
       </div>
     </div>
   );
 }