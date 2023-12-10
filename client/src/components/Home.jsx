import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { SongCard } from "./DashboardSongs";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

const Home = () => {
  const [
    {
      searchTerm,
      allSongs,
      artistFilter,
      filterTerm,
      albumFilter,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  const [filteredSongs, setFilteredSongs] = useState(null);

  useEffect(() => {
    if(!allSongs) {
     getAllSongs().then((data) => {
      console.log('All Songs:', data.songs);
       dispatch({
         type: actionType.SET_ALL_SONGS,
         allSongs: data.songs,
       });
     })
 };
}, [allSongs, dispatch]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allSongs.filter(
        (data) =>
          data.artist.toLowerCase().includes(searchTerm) ||
          data.language.toLowerCase().includes(searchTerm) ||
          data.name.toLowerCase().includes(searchTerm) ||
          data.artist.includes(artistFilter)
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    const filtered = allSongs?.filter((data) => data.artist === artistFilter);
    if (filtered) {
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [artistFilter]);

  useEffect(() => {
    const filtered = allSongs?.filter(
      (data) => data.category.toLowerCase() === filterTerm
    );
    if (filtered) {
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [filterTerm]);

  useEffect(() => {
    const filtered = allSongs?.filter((data) => data.album === albumFilter);
    if (filtered) {
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [albumFilter]);

  useEffect(() => {
    const filtered = allSongs?.filter(
      (data) => data.language === languageFilter
    );
    if (filtered) {
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [languageFilter]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <SearchBar />

      {searchTerm.length > 0 && (
        <p className="my-4 text-base text-textColor">
          Searched for :
          <span className="text-xl text-textColor font-semibold">
            {searchTerm}
          </span>
        </p>
      )}

      <Filter setFilteredSongs={setFilteredSongs} />

      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
         <HomeSongContainer musics={filteredSongs ? filteredSongs : allSongs} />
      </div>
    </div>
  );
};

export const HomeSongContainer = ({ musics }) => {
  const [{ isSongPlaying, song, filteredSongs, allSongs }, dispatch] = useStateValue();

  const addSongToContext = (songId) => {
    const songIndex = allSongs.findIndex((song) => song._id === songId);
  
    console.log('allSongs:', allSongs);
    console.log('songId:', songId);
  
    if (!isSongPlaying) {
      dispatch({ type: actionType.SET_SONG_PLAYING, isSongPlaying: true });
    }
  
    if (song !== songIndex) {
      dispatch({ 
        type: actionType.SET_SONG, 
        song: songIndex 
      });
    }
  };

  return (
    <>
      {musics?.sort((a, b) => a.name.localeCompare(b.name)) 
  .map((data, index) => (
        <motion.div
        key={data._id}
        whileTap={{ scale: 0.8 }}
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-songContainer shadow-md rounded-lg flex flex-col items-center"
        onClick={() => addSongToContext(data._id)} 
      >
          <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.imageURL}
              alt=""
              className=" w-full h-full rounded-lg object-cover"
            />
          </div>

          <p className="text-base text-headingColor font-semibold my-2">
            {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
            <span className="block text-sm text-gray-400 my-1">
              {data.artist}
            </span>
          </p>
        </motion.div>
      ))}
    </>
  );
};

export default Home;
