import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";

const dataSelectOption = [
  "gen-installation",
  "gen-analysis-project-detail-report",
  "gen-analysis-project-overall-report",
  "gen-analysis-shutter-overall-report",
  "gen-analysis-project-report",
  "gen-analysis-user-report",
];

const SelectLayout = () => {
  const { setSelectedAnalysis, selectedAnalysis, setDataAnalysis } = useContext(
    AuthContext
  ) as AuthContextType;

  const handleButtonClick = (value: string) => {
    setSelectedAnalysis(value);
    setDataAnalysis({});
  };

  return (
    <div className="flex flex-wrap gap-2">
      {dataSelectOption.map((item, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(item)}
          className={`btn w-auto text-[15px] capitalize ${
            selectedAnalysis === item
              ? "bg-[#22ABE0] border-[#22ABE0]"
              : "bg-[#27B770] border-[#27B770] hover:bg-[#22ABE0] hover:border-[#22ABE0]"
          }`}
        >
          {item.replace(/-/g, " ")}
        </button>
      ))}
    </div>
  );
};

export default SelectLayout;
