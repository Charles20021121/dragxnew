export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f4ec]">
      <div className="relative">
        {/* 主要加載圈 */}
        <div className="w-16 h-16 rounded-full border-4 border-[#1c5434]/20">
          <div className="w-full h-full rounded-full border-4 border-[#88bc04] border-t-transparent animate-[spin_0.8s_linear_infinite]">
          </div>
        </div>

        {/* 脈衝效果 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 rounded-full border-4 border-[#88bc04] opacity-0 animate-[ping_1.5s_ease-out_infinite]">
          </div>
        </div>
      </div>
      
      {/* 加載文字 */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-[#1c5434] font-medium animate-pulse">
          Loading...
        </span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#88bc04] animate-[bounce_0.8s_infinite]"></div>
          <div className="w-2 h-2 rounded-full bg-[#88bc04] animate-[bounce_0.8s_infinite_0.2s]"></div>
          <div className="w-2 h-2 rounded-full bg-[#88bc04] animate-[bounce_0.8s_infinite_0.4s]"></div>
        </div>
      </div>
    </div>
  );
} 