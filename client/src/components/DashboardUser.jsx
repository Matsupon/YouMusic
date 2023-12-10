import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { MdDelete } from "react-icons/md";

import moment from "moment";
import { changingUserRole, getAllUsers, removeUser } from "../api";
import { actionType } from "../context/reducer";

export const DashboardUserCard = ({ data, index }) => {
  const [{ user, allUsers }, dispatch] = useStateValue();
  const [isUserRoleUpdated, setisUserRoleUpdated] = useState(false);
  const createdAt = moment(new Date(data.createdAt)).format("MMMM Do YYYY");

  const updateUserRole = (userId, role) => {
    setisUserRoleUpdated(false);
    changingUserRole(userId, role).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data.data,
          });
        });
      }
    });
  };

  const deleteUser = (userId) => {
    removeUser(userId).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data.data,
          });
        });
      }
    });
  };

  return (
    <motion.div
      key={index}
      className="relative w-full rounded-md flex items-center justify-between py-4 bg-lightOverlay cursor-pointer hover:bg-card hover:shadow-md"
    >
      {data._id !== user?.user._id && (
        <motion.div
          whileTap={{ scale: 0.75 }}
          className="absolute left-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-200"
          onClick={() => deleteUser(data._id)}
        >
          <MdDelete className="text-xl text-red-400 hover:text-red-500" />
        </motion.div>
      )}

      {/* user image */}
      <div className='w-275 min-w-[160px] flex items-center justify-center'>
        <img
          src={data.imageURL}
          referrerPolicy="no-referrer"
          alt=""
          className="w-10 h-10 object-cover rounded-md min-w-[40px] shadow-md"
        />
      </div>

      {/* user name */}
      <p className='text-base text-textColor w-275 min-w-[160px] text-center'>{data.name}</p>
      <p className='text-base text-textColor w-275 min-w-[160px] text-center'>{data.email}</p>
      <p className='text-base text-textColor w-275 min-w-[160px] text-center'>{createdAt}</p>

      <div className="w-275 min-w-[160px] text-center flex items-center justify-center gap-6 relative">
        <p className="text-base text-textColor text-center"> {data.role} </p>

        {data._id !== user?.user._id && (
          <motion.p
            whileTap={{ scale: 0.7 }}
            className="text-[15px] font-semibold text-black px-1 bg-ioAdd rounded-sm hover:shadow-md"
            onClick={() => setisUserRoleUpdated(true)}
          >
            {data.role === "Admin" ? "Member" : "Admin"}
          </motion.p>
        )}

        {isUserRoleUpdated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute z-10 top-6 left-1/2 -translate-x-1/2 p-4 flex items-start flex-col gap-4 bg-white shadow-xl"
          >
            <p className="text-black text-[15px] font-semibold">
              {" "}
              Are you sure you want to mark the user as
              <span> {data.role === "Admin" ? "Member" : "Admin"} </span> ?{" "}
            </p>

            <motion.button
              whileTap={{ scale: 0.75 }}
              className="outline-non border-non text-sm px-4 py-1 rounded-md bg-green-200 text-black hover:shadow-md"
              onClick={() =>
                updateUserRole(data._id, data.role === "Admin" ? "Member" : "Admin")
              }
            >
              Yes
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.75 }}
              className="outline-non border-non text-sm px-4 py-1 rounded-md bg-pink-200 text-black hover:shadow-md"
              onClick={() => setisUserRoleUpdated(false)}
            >
              No
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const DashboardUser = () => {
  const [{ allUsers }, dispatch] = useStateValue();

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full p-12 min-h-[400px] overflow-x-scroll my-4 flex flex-col items-center
      justify-start border border-gray-300 rounded-md gap-3">
        <div className="absolute top-4 left-4">
          <p className="text-sm font-semibold text-textColor">
            Count : <span className='text-xl font-bold'>{allUsers?.length}</span>
          </p>
        </div>

        <div className="w-full min-w-[750px] flex items-center justify-between">
          <p className="text-lg text-textColor font-semibold w-275 min-w-[160px] text-center">Image</p>
          <p className="text-lg text-textColor font-semibold w-275 min-w-[160px] text-center">Name</p>
          <p className="text-lg text-textColor font-semibold w-275 min-w-[160px] text-center">Email</p>
          <p className="text-lg text-textColor font-semibold w-275 min-w-[160px] text-center">Created</p>
          <p className="text-lg text-textColor font-semibold w-275 min-w-[160px] text-center">Role</p>{" "}
        </div>

        {allUsers &&
          allUsers?.map((data, i) => <DashboardUserCard data={data} key={data._id} index={i} />)}
      </div>
    </div>
  );
};

export default DashboardUser;
