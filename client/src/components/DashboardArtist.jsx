import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";
import { getAllArtist, deleteArtistById } from "../api";
import { actionType } from "../context/reducer";

const DashboardArtist = () => {
  const [{ artists }, dispatch] = useStateValue();

  const handleDeleteArtist = async (id) => {
    try {
      const response = await deleteArtistById(id);

      if (response && response.status === 200) {
        const updatedArtists = artists.filter((artist) => artist._id !== id);
        dispatch({ type: actionType.SET_ARTISTS, artists: updatedArtists, action: 'delete' });
        console.log("State updated");
      } else {
        console.error("Failed to delete artist", response);
      }
    } catch (error) {
      console.error("Error while deleting artist", error);
    }
  };

  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      });
    }
  }, []);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full gap-3  my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold text-textColor">
            <span className="text-sm font-semibold">Count : </span>
            {artists ? artists.length : 0}
          </p>
        </div>
        {artists &&
          artists.map((data, index) => (
            <ArtistCard
              key={index}
              data={data}
              index={index}
              handleDeleteArtist={handleDeleteArtist}
            />
          ))}
      </div>
    </div>
  );
};

const ArtistCard = ({ data, index, handleDeleteArtist }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = () => {
    setIsDelete(true);
  };

  const confirmDelete = (id) => {
    handleDeleteArtist(id);
    setIsDelete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-songContainer shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.imageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />

      <p className="text-base text-textColor">{data.name}</p>
      <div className="flex items-center gap-4">
        <a href={data.instagram} target="_blank">
          <motion.i whileTap={{ scale: 0.75 }}>
            <IoLogoInstagram className="text-gray-500 hover:text-headingColor text-xl" />
          </motion.i>
        </a>
        <a href={data.twitter} target="_blank">
          <motion.i whileTap={{ scale: 0.75 }}>
            <IoLogoTwitter className="text-gray-500 hover:text-headingColor text-xl" />
          </motion.i>
        </a>
      </div>
      <motion.i 
        className="absolute bottom-2 right-2" 
        whileTap={{ scale: 0.75 }} 
        onClick={handleDelete}>
        <IoTrash className="text-base text-red-400 drop-shadow-md hover:text-red-600" />
      </motion.i>

      {isDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 p-2 bg-darkOverlay backdrop-blur-md flex flex-col items-center justify-center gap-4"
        >
          <p className="text-gray-100 text-base text-center">
            Are you sure you want to delete this?
          </p>
          <div className="flex items-center w-full justify-center gap-3">
            <div
              className="bg-red-300 px-3 rounded-md"
              onClick={() => confirmDelete(data._id)}
            >
              <p className="text-headingColor text-sm">Yes</p>
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

export default DashboardArtist;
