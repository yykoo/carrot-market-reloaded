import { Input } from "postcss";

export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 h-screen lg:bg-cyan-100 xl:bg-purple-100 2xl:bg-blue-300 flex items-center justify-center p-5">
      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col md:flex-row gap-2">
        <input type="text" className="w-full rounded-full h-12 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow" placeholder="Search here.." />
        <button className="text-white py-2 rounded-full active:scale-90 transition-transform font-medium outline-none md:px-10 bg-gradient-to-tr from-cyan-500 via-yellow-100 to-purple-600">Search</button>
      </div>
    </main>
  );
}
