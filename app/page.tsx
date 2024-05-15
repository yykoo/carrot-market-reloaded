import { Input } from "postcss";

export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 h-screen lg:bg-cyan-100 xl:bg-purple-100 2xl:bg-blue-300 flex items-center justify-center p-5">
      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-4">
        {["iksoeb","Me","You","yourself", ""].map((person, index) =>
          // <div key={index} className="flex items-center gap-5 even:bg-cyan-100 odd:bg-gray-100 p-2.5 rounded-xl">
          <div key={index} className="flex items-center group gap-5 border-b-2 pb-5 last:pb-0 last:border-0">
            <div className="size-10 bg-blue-400 rounded-full"/>
            <span className="text-lg font-medium empty:w-24 empty:h-5 empty:rounded-full empty:bg-gray-300 empty:animate-pulse group-hover:text-red-500">{person}</span>
            <div  className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full relative">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
