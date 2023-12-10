import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const FilterButtons = ({ filterData, flag }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);

  const [{ artistFilter, albumFilter, filterTerm }, dispatch] = useStateValue();

 
  const updateFilterButton = (name) => {
    setFilterName(name);
    setFilterMenu(false);
    if (flag === "Artist") {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: name });
    } else if (flag === "Language") {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: name });
    } else if (flag === "Albums") {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: name });
    } else if (flag === "Category") {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: name });
    }
  };

  return (
    <div>
      {/* Styles */}
      <style>
        {`
          .filter-buttons {
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            padding: 0.25rem 1rem;
            position: relative;
            cursor: pointer;
            transition: border-color 0.2s ease-in-out;
          }

          .filter-buttons:hover {
            border-color: #e5e7eb;
          }

          .filter-button-text {
            font-size: 1rem;
            line-height: 1.5;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .filter-button-icon {
            font-size: 1rem;
            color: #4b5563;
            transition: transform 0.2s ease-in-out;
          }

          .filter-menu {
            width: 11rem;
            z-index: 50;
            backdrop-filter: blur(8px);
            max-height: 4rem;
            overflow-y: scroll;
            scrollbar-width: thin;
            scrollbar-color: #d1d5db #6b7280;
          }

          .filter-menu::-webkit-scrollbar {
            width: 0.375rem;
          }

          .filter-menu::-webkit-scrollbar-track {
            background: #6b7280;
          }

          .filter-menu::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
          }

          .filter-menu-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 1rem;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
          }

          .filter-menu-item:hover {
            background-color: #3C4059;
          }

          .filter-menu-image {
            width: 2rem;
            height: 2rem;
            border-radius: 9999px;
            object-fit: cover;
          }

          .filter-menu-text {
            flex: 1;
            font-size: 1rem;
            color: #f7f7f7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>

      {/* Component */}
      <div className="filter-buttons">
        <p
          className="filter-button-text"
          onClick={() => setFilterMenu(!filterMenu)}
        >
          {!filterName && flag}
          {filterName && (
            <>
              {filterName.length > 15
                ? `${filterName.slice(0, 14)}...`
                : filterName}
            </>
          )}
          <IoChevronDown
            className={`filter-button-icon ${
              filterMenu ? "rotate-180" : "rotate-0"
            }`}
          />
        </p>
        {filterData && filterMenu && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="filter-menu"
          >
            {filterData?.map((data) => (
              <div
                key={data.name}
                className="filter-menu-item"
                onClick={() => updateFilterButton(data.name)}
              >
                {(flag === "Artist" || flag === "Albums") && (
                  <img
                    src={data.imageURL}
                    className="filter-menu-image"
                    alt=""
                  />
                )}
                <p className="filter-menu-text">
                  {data.name.length > 15
                    ? `${data.name.slice(0, 14)}...`
                    : data.name}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilterButtons;
