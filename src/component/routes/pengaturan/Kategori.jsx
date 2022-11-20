// Page Untuk Melihat Status Konten Yang telah

import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import searchIcon from "../../../assets/icon/search.svg";
import httpClient from "../../../httpClient.js";
import debounce from "lodash.debounce";
import TablePagination from "@mui/material/TablePagination";
import plusIcon from "../../../assets/icon/plus.svg";
import { useSnackbar } from "notistack";
import { Skeleton } from "@mui/material";

//search bar component
function SearchBar(props) {
  return (
    <div className="flex flex-row w-full justify-center items-center">
      <div className={"z-20"}>
        <img className={"w-4 ml-4"} src={searchIcon} alt="search" />
      </div>
      <input
        onChange={props.debouncedResults}
        className="w-full -ml-8 h-10 p-2 pl-9 px-3 border border-gray-400 rounded-md focus:outline-2 focus:outline-blue-500"
        type="text"
        placeholder="Cari Kategori"
      />
    </div>
  );
}

function Kategori(props) {
  const [data, setData] = useState([]);
  const [clickData, setClick] = useState("");
  const [tambahKategori, setTambahKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleSearch(e) {
    setSearch(e.target.value);
    console.log(e.target.value);
  }

  const debouncedResults = useMemo(() => {
    return debounce(handleSearch, 300);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let data = {
      search: search,
      limit: rowsPerPage,
      page: page + 1,
    };
    httpClient
      .readKategori(data)
      .then((res) => {
        setData(res.data.kategori);
        setCount(res.data.total);
        // console.log(res.data);
      })
      .catch((err) => {
        setError(true);
        enqueueSnackbar("Mohon Maaf, Terjadi Kesalahan", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, page, rowsPerPage]);
  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  function handleClick(id, nama) {
    setClick(id);
    setNamaKategori(nama);
    console.log(e);
  }

  function confirmDelete() {
    httpClient
      .deleteKategori(clickData)
      .then((res) => {
        console.log(res);
        // delete kategori from data state
        setData(data.filter((item) => item.kategoriId !== clickData));
        enqueueSnackbar("Berhasil Menghapus Kategori", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Mohon Maaf, Terjadi Kesalahan", { variant: "error" });
      });
  }

  function confirmSimpan() {
    console.log("simpan");
    let data1 = {
      name: tambahKategori,
    };
    httpClient
      .createKategori(data1)
      .then((res) => {
        console.log(res);
        // push new kategori to data state
        let newData = {
          kategoriId: res.data.messages.id,
          nama_kategori: res.data.messages.name,
        };
        console.log(newData);
        setData([...data, newData]);
        enqueueSnackbar("Berhasil Menambah Kategori", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Mohon Maaf, Terjadi Kesalahan", { variant: "error" });
      })
      .finally(() => {
        setTambahKategori("");
      });
  }

  function confirmEdit() {
    let data1 = {
      name: namaKategori,
    };
    httpClient
      .updateKategori(clickData, data1)
      .then((res) => {
        console.log(res);
        // update kategori from data state
        let newData = data.map((item) => {
          if (item.kategoriId === clickData) {
            item.nama_kategori = namaKategori;
          }
          return item;
        });
        setData(newData);
        enqueueSnackbar("Berhasil Mengubah Kategori", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Mohon Maaf, Terjadi Kesalahan", { variant: "error" });
      });
  }

  function handleTambahKategori(e) {
    setTambahKategori(e.target.value);
    console.log(e.target.value);
  }

  function handleEditKategori(e) {
    setNamaKategori(e.target.value);
    console.log(e.target.value);
  }

  return (
    <div
      id={props.isfull ? "maincontent" : "maincontent1"}
      className="absolute content flex flex-col gap-y-2 gap-x-6 top-[64px] md:p-8 p-4 "
    >
      <div className={"flex gap-2 sm:flex-row flex-col "}>
        <label
          htmlFor="my-modal1"
          className="btn btn-primary rounded-md btn-sm h-[40px] text-white flex justify-center items-center gap-2"
        >
          <img className={"w-5"} src={plusIcon} alt="plus" />
          Tambah Kategori
        </label>
        <SearchBar debouncedResults={debouncedResults} />
      </div>

      <div>
        <input type="checkbox" id="my-modal1" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box sm:rounded">
            <h3 className="font-bold text-lg my-2">Tambah Kategori Baru</h3>
            <label htmlFor="tambahUnit">Nama Kategori</label>
            <input
              onChange={handleTambahKategori}
              value={tambahKategori}
              className=" w-full h-12 p-2 px-3 border border-gray-400 rounded focus:outline-2 focus:outline-blue-500"
              type="text"
              placeholder="Nama Kategori"
            />
            <div className="modal-action">
              <label htmlFor="my-modal1" className="btn rounded btn-sm h-10">
                Batalkan
              </label>
              <label
                onClick={confirmSimpan}
                htmlFor="my-modal1"
                className="btn btn-primary text-white rounded  btn-sm h-10"
              >
                Simpan
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className=" overflow-x-auto min-w-full  border shadow-md rounded-md">
        <table className="min-w-screen table overflow-x-auto min-w-full ">
          <thead className="bg-white">
            <tr className="bg-white border-b">
              <th className="bg-white"></th>
              <th className="bg-white">Nama</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={3} className="text-center">
                  Mohon Maaf, Terjadi Kesalahan
                </td>
              </tr>
            ) : null}
            {loading
              ? [...Array(10)].map((item, index) => (
                  <tr className="bg-white border-b min-h-[65px]">
                    <td className="bg-white">
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </td>
                    <td className="bg-white">
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </td>
                    <td className="bg-white">
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </td>
                  </tr>
                ))
              : null}
            {data.map((item, index) => (
              <tr key={index + 1}>
                <td className={"text-center font-semibold w-[80px]"}>
                  {index + 1 + page * 10}
                </td>
                <td>{item.nama_kategori}</td>
                <td className="w-[260px]">
                  <label
                    htmlFor="my-modal2"
                    onClick={() =>
                      handleClick(item.kategoriId, item.nama_kategori)
                    }
                    className="btn btn-success mx-2 rounded btn-sm text-white"
                  >
                    Edit
                  </label>
                  <label
                    htmlFor="my-modal"
                    onClick={() =>
                      handleClick(item.kategoriId, item.nama_kategori)
                    }
                    className="btn btn-error rounded btn-sm  text-white"
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/*Delete Modal */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:rounded">
          <h3 className="font-bold text-lg mt-2">
            Apakah anda yakin ingin menghapus kategori ini?
          </h3>
          <p className="py-4">"{namaKategori}"</p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn rounded btn-sm h-10">
              Cancel
            </label>
            <label
              onClick={confirmDelete}
              htmlFor="my-modal"
              className="btn btn-error text-white rounded  btn-sm h-10"
            >
              Delete
            </label>
          </div>
        </div>
      </div>
      {/*Edit Modal */}
      <input type="checkbox" id="my-modal2" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:rounded">
          <h3 className="font-bold text-lg my-2">Edit Kategori</h3>
          <label htmlFor="tambahUnit">Nama Kategori</label>
          <input
            onChange={handleEditKategori}
            value={namaKategori}
            className="w-full h-12 p-2 px-3 border border-gray-400 rounded focus:outline-2 focus:outline-blue-500"
            type="text"
            placeholder="Nama Kategori"
          />
          <div className="modal-action">
            <label
              htmlFor="my-modal2"
              className="btn text-white rounded  btn-sm h-10"
            >
              Batalkan
            </label>
            <label
              onClick={confirmEdit}
              htmlFor="my-modal2"
              className="btn btn-primary text-white rounded  btn-sm h-10"
            >
              Simpan
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kategori;
