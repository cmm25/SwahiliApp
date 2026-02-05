 /**
  * QuizError - Error state component
  */
 
 import { X, RefreshCw } from 'lucide-react';
 import { SketchButton } from '@/components/shared/SketchButton';
 
 interface QuizErrorProps {
   error: string | null;
   onClose: () => void;
   onRetry: () => void;
 }
 
 export function QuizError({ error, onClose, onRetry }: QuizErrorProps) {
   return (
     <div className="p-8 text-center">
       <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
         <X className="text-destructive" size={32} />
       </div>
       <h3 className="font-hand text-xl mb-2">Oops!</h3>
       <p className="font-hand-secondary text-muted-foreground mb-6">{error}</p>
       <div className="flex gap-3 justify-center">
         <SketchButton variant="outline" onClick={onClose}>
           Close
         </SketchButton>
         <SketchButton variant="accent" onClick={onRetry}>
           <RefreshCw size={16} />
           Try Again
         </SketchButton>
       </div>
     </div>
   );
 }