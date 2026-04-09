import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="bg-zinc-900 border-white/10 overflow-hidden h-full flex flex-col">
      <Skeleton className="aspect-square w-full rounded-none" />
      <CardContent className="p-3 sm:p-5 flex-1 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
      <CardFooter className="p-3 pt-0 sm:p-5 sm:pt-0">
        <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />
      </CardFooter>
    </Card>
  )
}

export function StoreCardSkeleton() {
  return (
    <Card className="bg-zinc-900 border-white/5 rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-7 w-1/2 mb-4" />
        <div className="space-y-3 mb-8">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-24 h-24 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <Card className="bg-zinc-900 border-white/5 rounded-3xl">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
