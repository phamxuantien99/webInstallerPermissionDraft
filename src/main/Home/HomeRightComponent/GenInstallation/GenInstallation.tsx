import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
// import { toast } from "react-toastify";
import { apiAxiosV2 } from "../../../../api/api";
import { api } from "../../../service/api/endpoint";
import { useDebounce } from "../../../service/hooks/useDebounce";

const headerNew = [
  "Project Code",
  "Company",
  "Location",
  "Type Of Shutter",
  "Shutter Number",
  "Opening Width",
  "Opening Height",
  "Serial No",
  "Fab_List No",
  "Finishing",
];

const headerKeyNew = [
  "project_code",
  "company",
  "location",
  "type_of_shutter",
  "shutter_number",
  "opening_width",
  "opening_height",
  "serial_no",
  "fab_list_no",
  "finishing",
];

const GenInstallation = () => {
  const auth = localStorage.getItem("access_token_installation");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [permissionError, setPermissionError] = useState(false);

  const debouncedSearchValue = useDebounce(searchQuery, 1000);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // const notifyPermission = () =>
  //   toast.error("You don't have permission get data installation!", {
  //     position: "top-left",
  //     className: "min-w-[400px]",
  //   });

  const fetchDataLogistic = async (page?: number, search?: string) => {
    try {
      const res = await apiAxiosV2.get(api.getDataInvoices(page, search));
      setPermissionError(false); // reset lỗi nếu fetch thành công
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        setPermissionError(true); // set state lỗi permission
        // notifyPermission();
      } else {
        alert("Something went wrong, please login again!!");
      }
      throw error; // throw để React Query vẫn nhận biết là lỗi
    }
  };

  const { data: dataTotalProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["dataTotalProduct", currentPage, debouncedSearchValue],
    queryFn: () => fetchDataLogistic(currentPage, debouncedSearchValue),
    enabled: !!auth,
  });

  const totalPages =
    Math.ceil(dataTotalProduct?.search_options?.total_count / 20) || 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="overflow-y-auto" style={{ maxHeight: "84vh" }}>
        <table className="table w-full">
          <thead>
            <tr>
              <th>No.</th>
              {headerNew.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
              <th></th>
            </tr>
            <tr>
              <td colSpan={11}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(event) => handleSearch(event.target.value)}
                  className="input input-bordered w-full"
                />
              </td>
            </tr>
          </thead>

          <tbody className="w-full">
            {isLoadingProduct ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="text-center text-red-600"
                >
                  Loading...
                </td>
              </tr>
            ) : permissionError ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="text-center text-red-600"
                >
                  ❌ You don't have permission to view this data.
                </td>
              </tr>
            ) : !dataTotalProduct?.founds ||
              dataTotalProduct.founds.length === 0 ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="text-center text-red-600"
                >
                  No results
                </td>
              </tr>
            ) : (
              dataTotalProduct.founds.map((item: any, index: number) => (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  {headerKeyNew.map((header, headerIndex) => (
                    <td key={headerIndex}>{item[header]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex bg-white rounded-lg font-[Poppins] align-center items-center mt-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="h-12 border-2 border-r-0 border-indigo-600 px-4 rounded-l-lg hover:bg-indigo-600 hover:text-white"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </button>

        <p className="font-bold mx-2">{`Page ${currentPage} of ${totalPages}`}</p>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-12 border-2 border-indigo-600 px-4 rounded-r-lg hover:bg-indigo-600 hover:text-white"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GenInstallation;
