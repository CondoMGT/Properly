import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">CondoMgt</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <a className="text-gray-300 hover:text-white">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              <a className="text-gray-300 hover:text-white">Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a className="text-gray-300 hover:text-white">About</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
