export function layerLoading(countOfArray) {
  let carton;
  for (let i = 0; i < 10; i++) {
    return Array(countOfArray)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="relative animate-pulse">
          <div className="h-79 md:h-60 lg:h-79 bg-gray-700 rounded-md"></div>
          <div className="h-2 bg-gray-700 mt-3 rounded-md w-3/4"></div>
          <div className="h-2 bg-gray-700 mt-2 rounded-md w-1/2"></div>
        </div>
      ));
  }
  return carton;
}

export function loadingSpan() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
    </div>
  );
}
