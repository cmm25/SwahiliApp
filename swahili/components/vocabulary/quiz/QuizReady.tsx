 /**
  * QuizReady - Start quiz prompt component
  */
 
 import { Target, Sparkles } from 'lucide-react';
 import { SketchButton } from '@/components/shared/SketchButton';
 
 interface QuizReadyProps {
   totalQuestions: number;
   onStart: () => void;
   onClose: () => void;
 }
 
 export function QuizReady({ totalQuestions, onStart, onClose }: QuizReadyProps) {
   return (
     <div className="p-8 text-center">
       <div className="w-20 h-20 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center animate-pulse">
         <Target className="text-accent" size={40} />
       </div>
       <h3 className="font-hand text-2xl mb-2">Quiz Time! 🌱</h3>
       <p className="font-hand-secondary text-muted-foreground mb-2">
         {totalQuestions} questions about your vocabulary
       </p>
       <p className="font-hand-secondary text-sm text-muted-foreground mb-6">
         Answer carefully to grow your garden!
       </p>
       
       <div className="flex gap-3 justify-center">
         <SketchButton variant="outline" onClick={onClose}>
           Maybe Later
         </SketchButton>
         <SketchButton variant="accent" onClick={onStart}>
           <Sparkles size={16} />
           Start Quiz
         </SketchButton>
       </div>
     </div>
   );
 }