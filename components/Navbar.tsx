import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
      <Link href="/"><div className="text-white text-2xl font-bold">Properly</div></Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
