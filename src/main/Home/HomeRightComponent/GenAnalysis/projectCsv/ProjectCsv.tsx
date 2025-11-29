import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../../context/AuthProvider";

function ProjectCsv() {
  const { dataAnalysis } = useContext(AuthContext) as AuthContextType;

  return (
    <table className="w-full bg-white border-collapse">
      <thead>
        <tr>
          <th>Project Code</th>
          <th>Company</th>
          <th>Location</th>

          <th>
            <ul>
              <li className="w-max">Type of Shutter</li>
            </ul>
          </th>
          <th>Shutter Number</th>
          <th>Opening Width</th>
          <th>Opening Height</th>

          <th>
            <ul>
              <li className="w-max">Serial No.</li>
            </ul>
          </th>
          <th>
            <ul>
              <li className="w-max">Fab List No.</li>
            </ul>
          </th>
          <th>Finishing</th>

          <th>Component</th>
        </tr>
      </thead>
      <tbody>
        {dataAnalysis?.installations?.map((item: any) => (
          <tr key={item.serial_no}>
            <td>{item.project_code}</td>
            <td>{item.company}</td>

            <td>
              <ul>
                <li className="w-max inline-block">{item.location}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li className="w-max inline-block">{item.type_of_shutter}</li>
              </ul>
            </td>

            <td>{item.shutter_number}</td>
            <td>{item.opening_width}</td>
            <td>{item.opening_height}</td>
            <td>{item.serial_no}</td>
            <td>
              <ul>
                <li className="w-max inline-block">{item.fab_list_no}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li className=" inline-block">{item.finishing}</li>
              </ul>
            </td>
            <td>
              <ul>
                {item?.shutterhood_assembly && (
                  <li className="font-bold w-max">
                    Shutterhood: {item.shutterhood_assembly} -{" "}
                    {item.shutterhood_assembly_by}
                  </li>
                )}

                {item?.slat_and_bottom_bar && (
                  <li className="font-bold w-max">
                    Slat And Bottom Bar: {item.slat_and_bottom_bar} -{" "}
                    {item.slat_and_bottom_bar_by}
                  </li>
                )}

                {item?.side_guide && (
                  <li className="font-bold w-max">
                    Side Guide: {item.side_guide} - {item.side_guide_by}
                  </li>
                )}

                {item?.cover && (
                  <li className="font-bold w-max">
                    Cover: {item.cover} - {item.cover_by}
                  </li>
                )}

                {item?.cabling && (
                  <li className="font-bold w-max">
                    Cabling: {item.cabling} - {item.cabling_by}
                  </li>
                )}

                {item?.motor && (
                  <li className="font-bold w-max">
                    Motor: {item.motor} - {item.motor_by}
                  </li>
                )}

                {item?.operation && (
                  <li className="font-bold w-max">
                    Operation: {item.operation} - {item.operation_by}
                  </li>
                )}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProjectCsv;
