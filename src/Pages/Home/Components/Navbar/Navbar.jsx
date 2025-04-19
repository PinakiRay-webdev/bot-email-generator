import { navItems } from "../../../../Utils/Utils";
const Navbar = () => {
  return (
    <section className="h-fit" >
    <nav className="px-12 flex h-[10vh] justify-between items-center" >
      <h1 className="text-3xl font-semibold cursor-pointer" >
        Smart<span className="text-purple-900" >Draft</span>
      </h1>
      <div className="flex gap-5" >
        {navItems.map((item) => (
          <p className="capitalize cursor-pointer font-semibold" >{item}</p>
        ))}
      </div>
      <button className="bg-purple-900 px-5 py-2 rounded-2xl text-white cursor-pointer" >Get started</button>
    </nav>
    </section>
  );
};

export default Navbar;
