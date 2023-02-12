import DefaultProfileImage from "../../assets/images/default_profile.jpg";
import md5 from 'md5-hash'

const UserProfile = (props) => {
  const num = props.large ? 14 : 10;
  var username_hash = ""
  if(props.username !== undefined){
    username_hash = md5(props.username);
  }
  else{
    username_hash = md5('undefined');
  }
  var hue_rotate = parseInt(username_hash.slice(0,4), 16);
  const ProfileStyle={
    filter: `saturate(20) hue-rotate(${hue_rotate}deg)`
  }
  console.log(ProfileStyle)
  return (
    <div className="flex flex-col items-center">
      <img
        src={DefaultProfileImage}
        alt="user_profile_image"
        className={`w-${num} h-${num} rounded-full object-cover`}
        style={ProfileStyle}
      />
      <span className="min-w-content max-w-[64px] mt-0.5 text-sm text-center whitespace-nowrap overflow-hidden">
        {props.username}  {props.is_owner ? "*" : null}
      </span>
    </div>
  );
};

export default UserProfile;
