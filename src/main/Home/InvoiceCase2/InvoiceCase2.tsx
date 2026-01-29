import React, { useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import logo2 from "../../../assets/images/logo2.png";

interface InstallationData {
  Cabling: string;
  "Cabling By": string;
  "Cabling Img": string;
  Company: string;
  Cover: string;
  "Cover By": string;
  "Cover Img": string;
  "Fab List No.": string;
  Finishing: string;
  Location: string;
  Motor: string;
  "Motor By": string;
  "Motor Img": string;
  "Opening height": number;
  "Opening width": number;
  Operation: string;
  "Operation By": string;
  "Operation Img": string;
  "Project code": string;
  "Serial No.": number;
  "Shutter Number": string;
  "Shutterhood Assembly": string;
  "Shutterhood Assembly By": string;
  "Shutterhood Assembly Img": string;
  "Side Guide": string;
  "Side Guide By": string;
  "Side Guide Img": string;
  "Slat And Bottom Bar": string;
  "Slat And Bottom Bar By": string;
  "Slat And Bottom Bar Img": string;
  "T And C": string;
  "T And C By": string;
  "T And C Img": string;
  "Type of Shutter": string;
}

function InvoiceCase2() {
  const data = useLocation().state;
  const invoiceContentRef = useRef<any>();
  const getUsername = localStorage.getItem("username");

  // const _handlePrint = useReactToPrint({
  //   content: () => invoiceContentRef.current,
  //   documentTitle: "Statement",
  // });

  const currentDate = new Date().toISOString().slice(0, 10);
  const [year, month, day] = currentDate.split("-");
  // reverse date
  const newDate = `${day}-${month}-${year}`;

  const {
    filterDateEndForInvoice,
    filterDateStartForInvoice,
    dataDetailGenerateInvoice,
    isShowImage,
  } = data;

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return ""; // Trả về chuỗi rỗng nếu dateString là chuỗi rỗng hoặc undefined
    }

    const [year, month, day] = dateString.split("-");

    // Kiểm tra nếu year, month, hoặc day không tồn tại hoặc không hợp lệ
    if (!year || !month || !day) {
      return "";
    }

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-[1300px] mx-auto p-10">
      <div className="flex justify-between items-center">
        <div className="text-center mb-5">
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost gap-3 capitalize">
                <FcPrint size={24} />
                Print
              </button>
            )}
            documentTitle={dataDetailGenerateInvoice?.report_reference}
            content={() => invoiceContentRef.current}
            pageStyle={`
          @page { margin: 20mm; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .print-content {
              position: relative;
            }
            .page-break {
                page-break-before: always;
            }
            .no-page-break {
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
        </div>
      </div>
      <div>
        <div
          id="capture"
          className="invoice-container page"
          ref={invoiceContentRef}
        >
          {dataDetailGenerateInvoice?.details.map(
            (item: InstallationData, index: number) => {
              return (
                <div
                  key={index}
                  className={index === 0 ? "no-page-break" : "page-break"}
                >
                  <div className="flex gap-10 justify-between items-center mt-10 border-b border-solid border-gray-400 pb-3 w-5/6 mx-auto">
                    <img src={logo2} alt="logo" className="w-[300px]" />

                    <div className="text-right text-sm">
                      <p className="font-bold text-blue-600">
                        No.34 Loyang Crescent <br /> Singapore 508993
                      </p>
                      <p>
                        <strong>T:</strong>{" "}
                        <a href="tel:+6562857813">+65 6285 7813</a>
                      </p>
                      <p>
                        <strong>E:</strong>{" "}
                        <a href="mailto:enquiry@deltatech.com.sg">
                          enquiry@deltatech.com.sg
                        </a>
                      </p>
                      <p>
                        <strong>W:</strong>{" "}
                        <a target="_black" href="www.deltatech.com.sg">
                          www.deltatech.com.sg
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-solid border-black flex justify-between px-4 items-center">
                    {/* Project Code */}
                    <div className="flex flex-col gap-2 mt-3">
                      <p className="font-bold text-black">
                        Project Code:{" "}
                        <span className="font-normal pl-2">
                          {item?.["Project code"]}
                        </span>
                      </p>
                      <p className="font-bold text-black">
                        Company:{" "}
                        <span className="font-normal pl-2">
                          {item?.Company}
                        </span>
                      </p>
                      <p className="font-bold text-black">
                        Location/Project:{" "}
                        <span className="font-normal pl-2">
                          {item?.Location}
                        </span>
                      </p>
                      <p className="font-bold text-black">
                        Project Installation Report:
                        <span className="font-normal pl-2">
                          {dataDetailGenerateInvoice?.report_reference}
                        </span>
                      </p>
                      <p className="font-bold text-black">
                        Date Range:
                        <span className="font-normal pl-2">
                          {filterDateStartForInvoice} to{" "}
                          {filterDateEndForInvoice}
                        </span>
                      </p>
                    </div>
                    {/* Generated Date */}
                    <div>
                      <p className="font-bold text-black">
                        Date:{" "}
                        <span className="font-normal pl-2">{newDate}</span>
                      </p>

                      <p className="font-bold text-black">
                        Requestor:{" "}
                        <span className="font-normal pl-2">{getUsername}</span>
                      </p>

                      <p className="font-bold text-black">
                        Number of page:{" "}
                        <span className="font-normal pl-2">
                          {dataDetailGenerateInvoice?.details?.length}
                        </span>
                      </p>
                    </div>
                  </div>
                  <table className="mt-7 w-full">
                    <table border={1} width={"100%"} className="w-full">
                      <thead></thead>
                      <tbody>
                        <tr>
                          <td>Serial no</td>
                          <td colSpan={2} width={"200px"} align="center">
                            {item?.["Serial No."]}
                          </td>
                          <td width={"150px"}>Type of Shutter</td>
                          <td colSpan={2} width={"200px"} align="center">
                            {item?.["Type of Shutter"]}
                          </td>
                        </tr>

                        <tr>
                          <td>Shutter no</td>
                          <td colSpan={2} align="center">
                            {item?.["Shutter Number"]}
                          </td>
                          <td rowSpan={2} align="center">
                            Size
                          </td>
                          <td align="center">width</td>
                          <td align="center">Height</td>
                        </tr>

                        <tr>
                          <td></td>
                          <td colSpan={2}></td>
                          <td align="center">{item?.["Opening width"]}</td>
                          <td align="center">{item?.["Opening height"]}</td>
                        </tr>
                        <tr>
                          <td>Work done</td>
                          <td>Date installed</td>
                          <td>Technician in Charge</td>
                          <td colSpan={3}>Photo</td>
                        </tr>
                        {/* {item.components.map(
                          (item: Component, index: number) => (
                          )
                        )} */}
                        <React.Fragment>
                          {/* Shtterhood Assembly */}
                          {item?.["Shutterhood Assembly By"] && (
                            <tr>
                              <td className="min-w-[100px] ">
                                Shutterhood Assembly
                              </td>
                              <td>
                                {formatDate(
                                  item?.["Shutterhood Assembly"] || "",
                                )}
                              </td>
                              <td>{item?.["Shutterhood Assembly By"] || ""}</td>
                              <td colSpan={3}>
                                {isShowImage ? (
                                  item?.["Shutterhood Assembly Img"] && (
                                    <img
                                      src={`${item?.["Shutterhood Assembly Img"]}`}
                                      alt="Shutterhood Assembly"
                                      style={{
                                        minWidth: "150px",
                                        height: "85px",
                                        objectFit: "cover",
                                        display: "inline-block",
                                      }}
                                    />
                                  )
                                ) : (
                                  <p>Not display the picture</p>
                                )}
                              </td>
                            </tr>
                          )}
                          {/* Motor */}
                          {item?.["Motor Img"] !== "N" &&
                            item?.["Motor By"] && (
                              <tr>
                                <td className="min-w-[100px]">Motor</td>
                                <td>{formatDate(item?.["Motor"] || "")}</td>
                                <td>{item["Motor By"]}</td>
                                <td colSpan={3}>
                                  {isShowImage ? (
                                    item["Motor Img"] && (
                                      <img
                                        src={`${item["Motor Img"]}`}
                                        alt="Motor Img"
                                        style={{
                                          minWidth: "150px",
                                          height: "85px",
                                          objectFit: "cover",
                                          display: "inline-block",
                                        }}
                                      />
                                    )
                                  ) : (
                                    <p>Not display the picture</p>
                                  )}
                                </td>
                              </tr>
                            )}
                          {/* Slat & Bottom Bar */}
                          {item?.["Slat And Bottom Bar By"] && (
                            <tr>
                              <td className="min-w-[100px]">
                                Slat & Bottom Bar
                              </td>
                              <td>
                                {formatDate(item["Slat And Bottom Bar"] || "")}
                              </td>
                              <td>{item["Slat And Bottom Bar By"]}</td>
                              <td colSpan={3}>
                                {isShowImage ? (
                                  item["Slat And Bottom Bar Img"] && (
                                    <img
                                      src={`${item["Slat And Bottom Bar Img"]}`}
                                      alt="Slat And Bottom Bar Img"
                                      style={{
                                        minWidth: "150px",
                                        height: "85px",
                                        objectFit: "cover",
                                        display: "inline-block",
                                      }}
                                    />
                                  )
                                ) : (
                                  <p>Not display the picture</p>
                                )}
                              </td>
                            </tr>
                          )}
                          {/* Side Guide */}
                          {item?.["Side Guide By"] && (
                            <tr>
                              <td className="min-w-[100px]">Side Guide</td>
                              <td>{formatDate(item["Side Guide"] || "")}</td>
                              <td>{item["Side Guide By"]}</td>
                              <td colSpan={3}>
                                {isShowImage ? (
                                  item["Side Guide Img"] && (
                                    <img
                                      src={`${item["Side Guide Img"]}`}
                                      alt="Side Guide Img"
                                      style={{
                                        minWidth: "150px",
                                        height: "85px",
                                        objectFit: "cover",
                                        display: "inline-block",
                                      }}
                                    />
                                  )
                                ) : (
                                  <p>Not display the picture</p>
                                )}
                              </td>
                            </tr>
                          )}
                          {/* Cover */}
                          {item?.["Cover By"] && (
                            <tr>
                              <td className="min-w-[100px]">Cover</td>
                              <td>{formatDate(item["Cover"] || "")}</td>
                              <td>{item["Cover By"]}</td>
                              <td colSpan={3}>
                                {isShowImage ? (
                                  item["Cover Img"] && (
                                    <img
                                      src={`${item["Cover Img"]}`}
                                      alt="Cover Img"
                                      style={{
                                        minWidth: "150px",
                                        height: "85px",
                                        objectFit: "cover",
                                        display: "inline-block",
                                      }}
                                    />
                                  )
                                ) : (
                                  <p>Not display the picture</p>
                                )}
                              </td>
                            </tr>
                          )}
                          {/* Cabling works */}
                          {item["Cabling Img"] !== "N" &&
                            item["Cabling By"] && (
                              <tr>
                                <td className="min-w-[100px]">Cabling </td>
                                <td>{formatDate(item["Cabling"] || "")}</td>
                                <td>{item["Cabling By"]}</td>
                                <td colSpan={3}>
                                  {isShowImage ? (
                                    item["Cabling Img"] && (
                                      <img
                                        src={`${item["Cabling Img"]}`}
                                        alt="Cabling Img"
                                        style={{
                                          minWidth: "150px",
                                          height: "85px",
                                          objectFit: "cover",
                                          display: "inline-block",
                                        }}
                                      />
                                    )
                                  ) : (
                                    <p>Not display the picture</p>
                                  )}
                                </td>
                              </tr>
                            )}
                          {/* OPERATION TEST */}
                          {item["Operation By"] && (
                            <tr>
                              <td className="min-w-[100px]">Operation</td>
                              <td>{formatDate(item["Operation"]) || ""}</td>
                              <td>{item["Operation By"]}</td>
                              <td colSpan={3}>
                                {isShowImage ? (
                                  item["Operation Img"] && (
                                    <img
                                      src={`${item["Operation Img"]}`}
                                      alt="Operation Img"
                                      style={{
                                        minWidth: "150px",
                                        height: "85px",
                                        objectFit: "cover",
                                        display: "inline-block",
                                      }}
                                    />
                                  )
                                ) : (
                                  <p>Not display the picture</p>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      </tbody>
                    </table>
                  </table>
                  <div className="flex justify-end mt-5 mr-10">{index + 1}</div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceCase2;
