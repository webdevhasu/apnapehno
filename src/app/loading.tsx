import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6 animate-pulse">
        <Image src="/logo.png" alt="Loading..." fill className="object-contain" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-primary-light rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-primary w-1/2 animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
        <p className="font-heading text-xl font-bold text-accent animate-bounce">APNA PEHNOO</p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
}
