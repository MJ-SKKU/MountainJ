import DefaultProfileImage from "../../assets/images/default_profile.jpg";
import md5 from 'md5-hash'
import axios from "axios";
import {API} from "../../config";
import { useState, Fragment, useEffect } from "react";
import { RiVipCrownFill } from "react-icons/ri";


// import axios from "axios";

const UserProfile = (props) => {
  const num = props.large ? 14 : 10;
  const size = props.large ? 56 : 40;
  // console.log(size);

  const [profileImg, setProfileImg] = useState(DefaultProfileImage);


  // console.log(".....");
  // console.log(props.user_id);

  useEffect(()=>{
      if(props.user_id) {

      axios.get(
          `${API.USERS}/${props.user_id}`,
      ).then((res) => {
          let profile_img;
          profile_img = res.data.k_img;
          // console.log('p');
          //   console.log(props.p ? props.p : null);
          // console.log(props.user_id);
          // console.log(props.username);
          // console.log(profile_img);
          if(profile_img)
            setProfileImg(res.data.k_img);
      });
  }
  },[props]);

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
  // console.log(props)
  return (
    <div className="flex flex-col items-center relative">
      {props.is_owner ? <RiVipCrownFill className={`absolute w-${num/4} min-w-[${size/4}] h-${num/4}`} style={{top:-size*0.25}} />:null}
      <img
        src={profileImg}
        ff={props.username}
        alt="user_profile_image"
        className={`w-${num} min-w-[${size}px] h-${num} rounded-full object-cover`}
        style={{minWidth: `${size}px`}}
        // style={ProfileStyle}
      />
      <span className={`min-w-[40px] max-w-[64px] mt-0.5 text-sm text-center whitespace-nowrap overflow-hidden`}>
        {props.username} {props.is_me ? "(나)" : null} 
      </span>
    </div>
  );
};

export default UserProfile;
