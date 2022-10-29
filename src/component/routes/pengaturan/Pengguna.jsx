import { Link } from "react-router-dom";

function Pengguna(props) {
  return (
    <div
      id={props.isfull ? "maincontent" : "maincontent1"}
      className="absolute content flex flex-row gap-y-4 gap-x-6 top-[64px] md:p-8 p-4 flex flex-col"
    >
      <div className=" overflow-x-auto min-w-full  border shadow-md rounded-md">
        <table className="min-w-screen table overflow-x-auto min-w-full ">
          <thead className="bg-white">
            <tr className="bg-white border-b">
              <th className="bg-white"></th>
              <th className="bg-white">Nama</th>
              <th className="bg-white">Unit Kerja</th>
              <th className="bg-white">Role</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Michael Schott</td>
              <td>BPS Kabupaten Serang</td>
              <td>Approval</td>
              <td className="">
                <button
                  // onClick={() => handleDelete(item.username)}
                  className="btn btn-error rounded btn-sm  text-white"
                >
                  Ubah Role
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pengguna;
