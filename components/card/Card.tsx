import Image from "next/image";

const Card = ({
  img,
  text,
  number,
  color,
}: {
  img: string;
  text: string;
  number: string;
  color: string;
}) => {
  return (
    <div className="w-[400px] h-[400px] p-10 flex flex-col bg-gray-100 shadow-2xl justify-center items-center gap-2 rounded-xl">
      <Image src={img} alt="" width={80} height={80} />
      <p className="text-lg font-semibold">{text}</p>
      <h4 className={`${color} text-3xl font-bold`}>{number}</h4>
    </div>
  );
};

export default Card;
