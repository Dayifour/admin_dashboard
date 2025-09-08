import Links from "../links/Links";

const Sidebar = () => {
  return (
    <div className=" bg-blue-400 h-screen flex flex-col items-center pt-10 gap-8">
      <div className="text-white text-4xl">
        <img src="/doniData.png" />
      </div>
      <div>
        <Links />
      </div>
    </div>
  );
};

export default Sidebar;
