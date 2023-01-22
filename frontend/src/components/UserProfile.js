import React, { Fragment } from "react";
import DefaultProfileImage from "../assets/images/default_profile.jpg";



const UserProfile = ({ src, username, large }) => {
  return (
    <div className="flex flex-col items-center">
      {large ? (
        <img src={DefaultProfileImage} alt="user_profile_image" className="w-14 h-14 rounded-full object-cover" />
      ) : (
        <img src={DefaultProfileImage} alt="user_profile_image" className="w-10 h-10 rounded-full object-cover" />
      )}
      {username ? <div className="w-10 mt-0.5 text-sm text-center whitespace-nowrap overflow-hidden">{username}</div> : <Fragment />}
    </div>
  );
};

export default UserProfile;
