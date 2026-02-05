 /**
  * QuizLoading - Loading state component
  */
 
 interface QuizLoadingProps {
   hasSession: boolean;
 }
 
 export function QuizLoading({ hasSession }: QuizLoadingProps) {
   return (
     <div className="p-8 text-center">
       <div className="animate-spin w-12 h-12 mx-auto mb-4 rounded-full border-4 border-accent border-t-transparent" />
       <p className="font-hand text-lg text-muted-foreground">
         {hasSession ? 'Grading your quiz...' : 'Preparing your quiz...'}
       </p>
     </div>
   );
 }