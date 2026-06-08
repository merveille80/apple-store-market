import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="bg-white border-black/5 overflow-hidden h-full flex flex-col rounded-3xl shadow-sm">
      <Skeleton className="aspect-[3/4] w-full rounded-none bg-black/5" />
      <CardContent className="p-4 flex-1 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-2/3 bg-black/5 rounded-full" />
          <Skeleton className="h-4 w-full bg-black/5 rounded-full" />
        </div>
        <Skeleton className="h-5 w-1/3 bg-black/5 rounded-full" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full rounded-full bg-black/5" />
      </CardFooter>
    </Card>
  )
}

export function StoreCardSkeleton() {
  return (
    <Card className="bg-white border-black/5 rounded-3xl overflow-hidden shadow-sm">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <Skeleton className="h-14 w-14 rounded-2xl bg-black/5" />
          <Skeleton className="h-6 w-20 rounded-full bg-black/5" />
        </div>
        <Skeleton className="h-6 w-1/2 mb-4 bg-black/5 rounded-lg" />
        <div className="space-y-3 mb-8">
          <Skeleton className="h-4 w-1/3 bg-black/5 rounded-full" />
          <Skeleton className="h-4 w-1/4 bg-black/5 rounded-full" />
        </div>
        <div className="pt-6 border-t border-black/5 flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-full bg-black/5" />
          <Skeleton className="h-10 w-32 rounded-full bg-black/5" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-[28px] bg-black/5" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black/5" />
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-36 rounded-md bg-black/5" />
          <Skeleton className="h-10 w-3/4 rounded-lg bg-black/5" />
          <Skeleton className="h-4 w-28 rounded-md bg-black/5" />
          <Skeleton className="h-9 w-32 rounded-lg bg-black/5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-2xl bg-black/5" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-36 rounded-md bg-black/5" />
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full bg-black/5" />
            ))}
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-[24px] bg-black/5" />
        <Skeleton className="h-[52px] w-full rounded-full bg-black/5" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <Card className="bg-white border-black/5 rounded-3xl shadow-sm">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-10 w-10 rounded-2xl bg-black/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-black/5 rounded-full" />
          <Skeleton className="h-8 w-16 bg-black/5 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
