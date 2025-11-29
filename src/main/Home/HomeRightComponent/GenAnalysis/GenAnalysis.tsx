import ExcelJS from "exceljs";
import { useContext, useEffect, useRef, useState } from "react";
import { FcFile, FcPrint } from "react-icons/fc";
import ReactToPrint from "react-to-print";
import LogoCompany from "../../../../assets/images/OnlyLogo.jpg";
import { formatDate } from "../../../../util/helper/helper";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import CompletedByUser, {
  Component,
  convertToDisplayName,
  RawData,
  TransformedData,
} from "./CompletedByUser/CompletedByUser";
import ProjectDetail from "./ProjectDetail/ProjectDetail";
import ProjectOverall from "./ProjectOverall/ProjectOverall";
import ShutterOverall from "./ShutterOverall/ShutterOverall";
import ProjectCsv from "./projectCsv/ProjectCsv";

interface FlattenedItem {
  "Project Code": string;
  Company: string;
  Location: string;
  "Type Of Shutter": string;
  "Shutter Number": string;
  "Opening Width": string;
  "Opening Height": string;
  "Fab List No": string;
  Finishing: string;
  "Serial No": string;
  [key: string]: string; // Add this line to include dynamic keys
}

const GenAnalysis = () => {
  const { dataAnalysis, selectedAnalysis } = useContext(
    AuthContext
  ) as AuthContextType;
  const invoiceContentRef = useRef<any>();
  const { completed_work, user } = dataAnalysis;
  const [convertData, setConvertData] = useState<any>([]);

  const today = new Date();

  const day = today.getDate();
  const month = today.getMonth() + 1; // Tháng bắt đầu từ 0, nên phải cộng thêm 1
  const year = today.getFullYear();

  useEffect(() => {
    if (!completed_work) {
      return;
    }
    const transformData = (data: RawData): TransformedData[] => {
      const result: Record<string, TransformedData> = {};

      const keys = Object.keys(data["Serial No."]);

      // Define the desired order for the components
      const componentOrder = [
        "Shutterhood",
        "Slat And Bottom Bar",
        "Side Guide",
        "Cover",
        "Cabling",
        "Motor",
        "Operation",
        "T And C",
      ];

      keys.forEach((key) => {
        const serialNo = data["Serial No."][key];
        const project_code = data["Project code"][key];
        const company = data["Company"][key];
        const location = data["Location"][key];
        const type_of_shutter = data["Type of Shutter"][key];
        const shutter_number = data["Shutter Number"][key];
        const opening_width = data["Opening width"][key];
        const opening_height = data["Opening height"][key];
        const fab_list_no = data["Fab List No."][key];
        const finishing = data["Finishing"][key];
        const component_date = data["Component"][key];

        if (!result[serialNo]) {
          result[serialNo] = {
            project_code,
            company,
            location,
            type_of_shutter,
            shutter_number,
            opening_width: opening_width.toString(),
            opening_height: opening_height.toString(),
            fab_list_no,
            finishing,
            component_date,
            serial_no: serialNo,
            components: [],
          };
        }

        result[serialNo].components.push({
          component: data["Component"][key] as string,
          componentName: convertToDisplayName(
            data["component_name"][key] as string
          ),
          componentImg: data["Component Img"][key] as string,
          componentBy: data["Component By"][key] as string,
        });

        // Sort components based on the predefined order
        result[serialNo].components.sort((a, b) => {
          return (
            componentOrder.indexOf(a.componentName) -
            componentOrder.indexOf(b.componentName)
          );
        });
      });

      setConvertData(Object.values(result));
      return Object.values(result);
    };

    transformData(completed_work);
  }, [completed_work]);

  const DownloadExcelUser = async () => {
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Dữ liệu đầu vào từ convertData
    const flattenedData = convertData.map((item: any) => {
      const flattenedItem: FlattenedItem = {
        "Project Code": item.project_code,
        Company: item.company,
        Location: item.location,
        "Type Of Shutter": item.type_of_shutter,
        "Shutter Number": item.shutter_number,
        "Opening Width": item.opening_width,
        "Opening Height": item.opening_height,
        "Fab List No": item.fab_list_no,
        Finishing: item.finishing,
        "Serial No": String(item.serial_no),
      };

      const componentOrder = [
        { key: "Shutterhood", by: "Shutterhood By", img: "Shutterhood Img" },
        {
          key: "Slat And Bottom Bar",
          by: "Slat And Bottom Bar By",
          img: "Slat And Bottom Bar Img",
        },
        { key: "Side Guide", by: "Side Guide By", img: "Side Guide Img" },
        { key: "Cover", by: "Cover By", img: "Cover Img" },
        { key: "Cabling", by: "Cabling By", img: "Cabling Img" },
        { key: "Motor", by: "Motor By", img: "Motor Img" },
        { key: "Operation", by: "Operation By", img: "Operation Img" },
        { key: "T And C", by: "T And C By", img: "T And C Img" },
      ];

      componentOrder.forEach(({ key, by, img }) => {
        flattenedItem[key] = "";
        flattenedItem[by] = "";
        flattenedItem[img] = "";
      });

      item.components.forEach((comp: Component) => {
        const componentField = componentOrder.find(
          (field) => field.key === comp.componentName
        );
        if (componentField) {
          flattenedItem[componentField.key] = comp.component;
          flattenedItem[componentField.by] = comp.componentBy;
          flattenedItem[componentField.img] = comp.componentImg;
        }
      });

      return flattenedItem;
    });

    // Định nghĩa các cột dựa trên dữ liệu
    worksheet.columns = Object.keys(flattenedData[0]).map((key) => ({
      header: key,
      key,
      width: 20, // Độ rộng cột có thể điều chỉnh
    }));

    // Thêm dữ liệu vào bảng tính
    flattenedData.forEach((item: any) => {
      worksheet.addRow(item);
    });

    // Định dạng header (hàng đầu tiên)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FF0000" }, size: 12 }; // Chữ đỏ, đậm, cỡ 12
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Nền màu vàng
      };
    });

    // Định dạng nội dung các hàng tiếp theo
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = {
          name: "Times New Roman",
          size: 10,
          color: { argb: "000000" },
        }; // Chữ đen, cỡ 10
        cell.alignment = { horizontal: "center", vertical: "middle" }; // Căn giữa
      });
    });

    // Tạo file Excel và kích hoạt tải xuống
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user}-ReportUser.xlsx`;
    link.click();
  };

  // Download Excel Project
  const DownloadExcelProject = async () => {
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Lấy danh sách key từ object đầu tiên
    const headers = Object.keys(dataAnalysis?.installations[0]);

    // Thêm headers vào hàng đầu tiên
    worksheet.addRow(headers);

    // Định cấu hình chiều rộng cột
    worksheet.columns = headers.map((header) => ({
      header: header,
      key: header,
      width: 20, // Đặt chiều rộng là 20
    }));

    // Thêm dữ liệu
    dataAnalysis?.installations.forEach((row: any) => {
      worksheet.addRow(Object.values(row));
    });

    // Định dạng header (hàng đầu tiên)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FF0000" }, size: 12 }; // Chữ đỏ, đậm, cỡ 12
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Nền màu vàng
      };
    });

    // Định dạng nội dung các hàng tiếp theo
    worksheet.eachRow((row, rowNumber) => {
      // Bỏ qua hàng đầu tiên vì đã định dạng header
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.font = {
            name: "Times New Roman",
            size: 10,
            color: { argb: "000000" },
          }; // Chữ đen, cỡ 10
          cell.alignment = { horizontal: "center", vertical: "middle" }; // Căn giữa
        });
      }
    });

    // Tạo file Excel và kích hoạt tải xuống
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${dataAnalysis?.installations[0].project_code}-ReportProjectCode.xlsx`;
    link.click();
  };

  return (
    <div>
      <div>
        {/* Print Content PDF button */}
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-ghost gap-3 capitalize">
              <FcPrint size={24} />
              Print
            </button>
          )}
          content={() => invoiceContentRef.current}
          documentTitle={dataAnalysis?.report_reference}
          pageStyle={`
          @page { margin: 20mm; size: A4 landscape !important; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .print-content {
              position: relative;
            }
            .page-break {
              margin-top: 30px,
              page-break-before: always;
              page-break-inside: avoid;
            }
            .no-page-break {
              margin-top: 30px,
              page-break-before: auto;
            }
            .page-number {
              position: fixed;
              bottom: 10mm;
              right: 10mm;
              color: black;
            }
          }
        `}
        />
        {/* Print Content Excel button */}
        {selectedAnalysis === "gen-analysis-user-report" && (
          <button
            className="btn btn-ghost gap-3 capitalize"
            onClick={DownloadExcelUser}
          >
            <FcFile size={24} />
            Download Excel
          </button>
        )}

        {selectedAnalysis === "gen-analysis-project-report" && (
          <button
            className="btn btn-ghost gap-3 capitalize"
            onClick={DownloadExcelProject}
          >
            <FcFile size={24} />
            Download Excel
          </button>
        )}
      </div>

      <div className="bg-white p-2 page" ref={invoiceContentRef} id="printable">
        {dataAnalysis?.start_date ||
        dataAnalysis?.user ||
        dataAnalysis?.installations?.length > 0 ? (
          <div>
            {/* Header total */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={LogoCompany}
                  alt="Logo Company"
                  className="w-[35px] h-[60px]"
                />
                <div className="flex flex-col gap-2">
                  <h1
                    className={`${
                      selectedAnalysis === "gen-analysis-user-report"
                        ? "text-3xl"
                        : "text-[22px]"
                    }`}
                  >
                    {selectedAnalysis ===
                      "gen-analysis-project-detail-report" &&
                      "Project Details Components Selection Report"}
                    {selectedAnalysis ===
                      "gen-analysis-project-overall-report" &&
                      "Project Overall Components Selection Report"}
                    {selectedAnalysis ===
                      "gen-analysis-shutter-overall-report" &&
                      "Completed Shutter By User Overivew Report"}
                    {selectedAnalysis === "gen-analysis-user-report" &&
                      "Products that the user has completed"}

                    {selectedAnalysis === "gen-analysis-project-report" &&
                      "Project CSV Report"}
                  </h1>
                  <div>
                    {selectedAnalysis ===
                      "gen-analysis-project-detail-report" && (
                      <p className="flex gap-2 text-base">
                        Project Range:{" "}
                        <span className="font-semibold">
                          {dataAnalysis?.project_code}
                        </span>
                      </p>
                    )}

                    {selectedAnalysis === "gen-analysis-user-report" ? (
                      <p className={`flex gap-2 text-xl`}>
                        User Completed:
                        <span className="font-semibold">
                          {dataAnalysis?.user}
                        </span>
                      </p>
                    ) : (
                      <div>
                        {selectedAnalysis !== "gen-analysis-project-report" ? (
                          <p className="flex gap-2 text-base">
                            Date Range:{" "}
                            <span className="font-semibold">
                              {dataAnalysis?.start_date &&
                                formatDate(dataAnalysis?.start_date)}{" "}
                              to{" "}
                              {dataAnalysis?.end_date &&
                                formatDate(dataAnalysis?.end_date)}
                            </span>
                          </p>
                        ) : (
                          <p className="flex gap-2 text-base">
                            Project Code:{" "}
                            <span className="font-semibold">
                              {dataAnalysis?.installations[0]?.project_code}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p
                  className={`${
                    selectedAnalysis === "gen-analysis-user-report"
                      ? "text-xl"
                      : "text-base"
                  }`}
                >
                  Date Generated:{" "}
                  <span className="font-semibold">
                    {day}-{month}-{year}
                  </span>
                </p>
                {selectedAnalysis !== "gen-analysis-user-report" &&
                  selectedAnalysis !== "gen-analysis-project-report" && (
                    <p className="flex gap-2 text-base">
                      Reference report number:
                      <span className="font-semibold">
                        {dataAnalysis?.report_reference}
                      </span>
                    </p>
                  )}
              </div>
            </div>
            {/* dâta show */}
            <div className="my-5">
              {selectedAnalysis === "gen-analysis-project-detail-report" && (
                <ProjectDetail />
              )}
              {selectedAnalysis === "gen-analysis-project-overall-report" && (
                <ProjectOverall />
              )}
              {selectedAnalysis === "gen-analysis-shutter-overall-report" && (
                <ShutterOverall />
              )}
              {selectedAnalysis === "gen-analysis-user-report" && (
                <CompletedByUser />
              )}

              {selectedAnalysis === "gen-analysis-project-report" && (
                <ProjectCsv />
              )}
            </div>
          </div>
        ) : (
          <p className="text-center">There is no data to display</p>
        )}
      </div>
    </div>
  );
};

export default GenAnalysis;

[
  {
    project_code: "DTPJ220051",
    company: "Lum Chang",
    location: "Mandai ENIA D2, E & F",
    type_of_shutter: "IFSS 120-57",
    shutter_number: "B2-IFSS120-01",
    opening_width: "6000",
    opening_height: "5585",
    serial_no: "240108",
    fab_list_no: "F24S-D0004",
    finishing: "GL",
    shutterhood_assembly: "19/08/2024",
    shutterhood_assembly_by: "Khan1",
    shutterhood_assembly_img: "240108_shutterhood_assembly.jpeg",
    slat_and_bottom_bar: "09/09/2024",
    slat_and_bottom_bar_by: "Khan1",
    slat_and_bottom_bar_img: "240108_slat_and_bottom_bar.jpeg",
    side_guide: "11/09/2024",
    side_guide_by: "Khan1",
    side_guide_img: "240108_side_guide.jpeg",
    cover: "09/09/2024",
    cover_by: "Khan1",
    cover_img: "240108_cover.jpeg",
    cabling: "19/08/2024",
    cabling_by: "Khan1",
    cabling_img: "N",
    motor: "19/08/2024",
    motor_by: "Khan1",
    motor_img: "240108_motor.jpeg",
    operation: "11/09/2024",
    operation_by: "Khan1",
    operation_img: "240108_operation.jpeg",
    t_and_c: "",
    t_and_c_by: "",
    t_and_c_img: "",
  },
  {
    project_code: "DTPJ220051",
    company: "Lum Chang",
    location: "Mandai ENIA D2, E & F",
    type_of_shutter: "FRS 120",
    shutter_number: "B2-FRS120-01",
    opening_width: "11000",
    opening_height: "4580",
    serial_no: "240116",
    fab_list_no: "F24-D0020",
    finishing: "RAL7004(Signal Grey)",
    shutterhood_assembly: "",
    shutterhood_assembly_by: "",
    shutterhood_assembly_img: "",
    slat_and_bottom_bar: "",
    slat_and_bottom_bar_by: "",
    slat_and_bottom_bar_img: "",
    side_guide: "",
    side_guide_by: "",
    side_guide_img: "",
    cover: "",
    cover_by: "",
    cover_img: "",
    cabling: "",
    cabling_by: "",
    cabling_img: "",
    motor: "",
    motor_by: "",
    motor_img: "",
    operation: "",
    operation_by: "",
    operation_img: "",
    t_and_c: "",
    t_and_c_by: "",
    t_and_c_img: "",
  },
];
