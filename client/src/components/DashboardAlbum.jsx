import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { actionType } from "../context/reducer";
import { getAllAlbums, deleteAlbumById } from "../api";

const DashboardAlbum = () => {
  const [{ allAlbums }, dispatch] = useStateValue();
  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
      });
    }
  }, []);

  const handleDeleteAlbum = async (id) => {
    try {
      const res = await deleteAlbumById(id);
      if (res && res.status === 200) {
        // Handle success
        const updatedAlbums = allAlbums.filter((album) => album._id !== id);
        dispatch({
          type: actionType.SET_ALL_ALBUMNS,
          allAlbums: updatedAlbums,
        });
      } else {
        // Handle error
        console.error("Failed to delete album");
      }
    } catch (error) {
      // Handle error
      console.error("Error while deleting album", error);
    }
  };

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full gap-3  my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold text-textColor">
            <span className="text-sm font-semibold">Count : </span>
            {allAlbums ? allAlbums.length : 0}
          </p>
        </div>
        {allAlbums &&
          allAlbums.map((data, index) => (
            <AlbumCard key={index} data={data} index={index} onDelete={handleDeleteAlbum} />
          ))}
      </div>
    </div>
  );
};


export const AlbumCard = ({ data, index, onDelete }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = () => {
    setIsDelete(true);
  };

  const confirmDelete = (id) => {
    onDelete(id);
    setIsDelete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative  overflow-hidden w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-songContainer shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.imageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />

      <p className="text-base text-textColor">{data.name}</p>

      <motion.i
        className="absolute bottom-2 right-2"
        whileTap={{ scale: 0.75 }}
        onClick={handleDelete}
      >
        <MdDelete className=" text-gray-400 hover:text-red-400 text-xl cursor-pointer" />
      </motion.i>

      {isDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 p-2 bg-darkOverlay  backdrop-blur-md flex flex-col items-center justify-center gap-4"
        >
          <p className="text-gray-100 text-base text-center">
            Are you sure do you want to delete this?
          </p>
          <div className="flex items-center w-full justify-center gap-3">
            <div className="bg-red-300 px-3 rounded-md">
              <p
                className="text-headingColor text-sm"
                onClick={() => confirmDelete(data._id)}
              >
                Yes
              </p>
            </div>
            <div
              className="bg-green-300 px-3 rounded-md"
              onClick={() => setIsDelete(false)}
            >
              <p className="text-headingColor text-sm">No</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardAlbum;
