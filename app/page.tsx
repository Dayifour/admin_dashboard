import Card from "@/components/card/Card";
import SurveyTable from "@/components/surveyTable/SurveyTable";

const page = () => {
  return (
    <div className="flex flex-col gap-10 mx-10 mt-10">
      <h1 className="text-3xl text-black font-semibold">Dashboard</h1>
      <div className="flex gap-5">
        <Card
          img="/usercolor.png"
          text="Total Users"
          number="245"
          color="text-blue-500"
        />
        <Card
          img="/research.png"
          text="Enquêtes actives"
          number="12"
          color="text-green-500"
        />
        <Card
          img="/checked.png"
          text="Enquêtes terminées"
          number="89"
          color="text-orange-400"
        />
      </div>
      <SurveyTable />
    </div>
  );
};

export default page;
