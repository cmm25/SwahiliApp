import { Skeleton } from "@/components/ui/skeleton";
import { SketchCard } from "@/components/shared/SketchCard";

export function ProfileSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <SketchCard className="md:col-span-1 text-center relative">
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32 mx-auto mt-4" />
        <Skeleton className="h-4 w-48 mx-auto mt-2" />
        
        <div className="flex justify-center gap-4 mt-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </SketchCard>

      <SketchCard className="md:col-span-2">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </SketchCard>

      <SketchCard className="md:col-span-3">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <Skeleton className="h-16 w-16 rounded-md" />
          <Skeleton className="h-16 w-16 rounded-md" />
          <Skeleton className="h-16 w-16 rounded-md" />
        </div>
      </SketchCard>
    </div>
  );
}
