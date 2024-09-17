import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const AddProducts = () => {
  const [files, setFiles] = useState([]);
  const toastCenter = useRef(null);
  const toastTopCenter = useRef(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState([]);
  const [data, setData] = useState({});
  const [activeInput, setActiveInput] = useState("title");
  const token = useSelector(state => state.auth.token);


  const showMessage = (event, ref, severity) => {
    const label = event //.data.message;

    ref.current.show({ severity: severity, summary: label, detail: label, life: 3000 });
};

  const info = [
    { name: "title", type: "text" },
    { name: "price", type: "number", min: 50 },
    { name: "stock", type: "number", min: 1, max: 100 },
    { name: "image", type: "file" },
    { name: "color", type: "text" },
    { name: "size", type: "text" },
    { name: "category", type: "text" },
  ];

  const handleSelectFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const promises = files.map((file) => {
        const formData = new FormData();
        formData.append('my_files', file);
        return axios.post('http://localhost:3001/api/image/upload', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
      });
      const results = await Promise.all(promises);
      setRes(results.map((res) => res.data));
      setData(prevData => ({
        ...prevData,
        image: results.map((res) => res.data[0].secure_url)
      }));
    } catch (error) {
      showMessage(error, toastCenter, "error")
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res);
      if (res.status === 200) {
        showMessage(res.data.message, toastCenter, "success")
        setData({});
        setFiles([]);
        setRes([]);
      }
    } catch (error) {
      console.log(error);
      showMessage("Error durring upload!", toastCenter, "error") //error.response.data.message
    }
  };

  return (
    <form className="px-8 h-[58vh]" onSubmit={handleSubmit}>
      <Toast ref={toastCenter} position="center" />
      <Toast ref={toastTopCenter} position="top-center" />
      <h3>Add Products</h3>
      <div className="flex gap-x-3">
        <div className="flex-1">
          {info.map((info) => (
            <div key={info.name} className="flex flex-col">
              <label
                htmlFor={info.name}
                className={`${
                  activeInput === info.name
                    ? "text-[#FA61D0] font-extrabold"
                    : ""
                }`}
              >
                {info.name.charAt(0).toUpperCase() + info.name.slice(1)}
              </label>
              <input
                className="pl-2 outline-none h-8 rounded-sm  border-gray-300"
                type={info.type}
                multiple={info.name === "image"}
                placeholder={
                  info.name.charAt(0).toUpperCase() + info.name.slice(1)
                }
                min={info.min}
                id={info.name}
                value={info.name === "image" ? "" : data[info.name] || ""}
                onChange={(e) =>
                  info.name !== "image"
                    ? setData({ ...data, [info.name]: e.target.value })
                    : handleSelectFiles(e)
                }
                onClick={() => setActiveInput(info.name)}
              />
            </div>
          ))}
          {activeInput === "image" && files.length > 0 && (
            <button
              onClick={handleUpload}
              className="bg-green-500 py-1 px-2 mt-1 rounded-lg text-white font-extrabold text-xl"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-col w-full">
            <label
              htmlFor="description"
              className={`${
                activeInput === "description"
                  ? "text-[#FA61D0] font-extrabold"
                  : ""
              }`}
            >
              Description
            </label>
            <textarea
              name="description"
              className="outline-none pl-4 h-[158px]"
              id="description"
              placeholder="Add product description"
              value={data.description || ""}
              onChange={(e) => {
                setData({ ...data, description: e.target.value })
                e.target.value =""
              }
              }
              onClick={() => setActiveInput("description")}
            />
            <div className="flex overflow-x-auto gap-x-2 mt-3">
              {res &&
                res.map((res, index) => (
                  <img
                    key={index}
                    src={res[0].secure_url}
                    alt=""
                    className="h-[120px] w-[120px]"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`${
          data.title &&
          data.price &&
          data.stock &&
          data.image &&
          data.category &&
          data.description
            ? "bg-green-500 cursor-pointer"
            : "bg-gray-medium cursor-not-allowed"
        } py-3 px-6 text-white rounded-2xl mt-4`}
        disabled={
          !(
            data.title &&
            data.price &&
            data.stock &&
            data.image &&
            data.category &&
            data.description
          )
        }
      >
        Add
      </button>
    </form>
  );
};

export default AddProducts;
