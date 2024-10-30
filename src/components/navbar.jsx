const Navbar = () => {
  return (
    <nav className="bg-zinc-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <a href="/">DisasterRelief.info</a>
        </div>
        <div className="space-x-4">
          <a href="/upload" className="text-white hover:text-gray-300">Upload</a>
          <a href="/verify" className="text-white hover:text-gray-300">Verify</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar