const Footer = () => {
    return (
      <footer className="bg-gray-800 p-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CondoMgt. All Rights Reserved.</p>
          <ul className="flex justify-center space-x-4 mt-2">
            <li>
              <a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a>
            </li>
          </ul>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  