export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>

      {/* Actions Skeleton */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex space-x-4 rtl:space-x-reverse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Caption Skeleton */}
      <div className="space-y-2 px-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>

      {/* Comments Skeleton */}
      <div className="mt-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}