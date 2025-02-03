"use client";
import NavLink from "./navLink/NavLink";

const links = [
  {
    title: "Dashboard",
    path: "/",
    image: "/dashboard.png",
  },
  {
    title: "Enquetes",
    path: "/enquetes",
    image: "/investigation.png",
  },
  {
    title: "Enqueteurs",
    path: "/enqueteurs",
    image: "/users.png",
  },
  {
    title: "Organisations",
    path: "/organisations",
    image: "/office.png",
  },
  {
    title: "Liaison",
    path: "/liaison",
    image: "/liaison.png",
  },
  {
    title: "Questions",
    path: "/questions",
    image: "/question.png",
  },
  {
    title: "Reponses",
    path: "/responses",
    image: "/audition.png",
  },
  {
    title: "Repondre",
    path: "/repondre",
    image: "/correct.png",
  },
];
const Links = () => {
  return (
    <div className="flex flex-col justify-center items-start gap-2">
      {links.map((link) => (
        <NavLink item={link} key={link.title} />
      ))}
    </div>
  );
};

export default Links;
