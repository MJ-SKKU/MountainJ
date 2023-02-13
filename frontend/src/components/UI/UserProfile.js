import DefaultProfileImage from "../../assets/images/default_profile.jpg";
import md5 from 'md5-hash'
import axios from "axios";
import {API} from "../../config";
import { useState, Fragment, useEffect } from "react";

// import axios from "axios";

const UserProfile = (props) => {
  const num = props.large ? 14 : 10;
  const size = props.large ? 56 : 40;
  console.log(size);

  const [profileImg, setProfileImg] = useState(DefaultProfileImage);

  let profile_img;
  console.log(".....");
  console.log(props.user_id);
  if(props.user_id) {
      axios.get(
          `${API.USERS}/${props.user_id}`,
      ).then((res) => {
          profile_img = res.data.k_img;
          if(profile_img)
            setProfileImg(res.data.k_img);
      });
  }

  //   const num = 40;
  // var username_hash = ""
  // if(props.username !== undefined){
  //   username_hash = md5(props.username);
  // }
  // else{
  //   username_hash = md5('undefined');
  // }
  // var hue_rotate = parseInt(username_hash.slice(0,4), 16);
  // const ProfileStyle={
  //   filter: `saturate(20) hue-rotate(${hue_rotate}deg)`
  // }
  // console.log(ProfileStyle)

  return (
    <div className="flex flex-col items-center">
      <img
        src={profileImg}
        alt="user_profile_image"
        className={`w-${num} min-w-[${size}px] h-${num} rounded-full object-cover`}
        style={{minWidth: `${size}px`}}
        // style={ProfileStyle}
      />
      <span className="min-w-[40px] max-w-[64px] mt-0.5 text-sm text-center whitespace-nowrap overflow-hidden">
        {props.username}  {props.is_owner ? "*" : null}
      </span>
    </div>
  );
};

export default UserProfile;
