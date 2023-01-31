import DefaultProfileImage from "../assets/images/default_profile.jpg";

const UserProfile = (props) => {
  const num = props.large ? 14 : 10;

  return (
    <div className="flex flex-col items-center">
      <img
        src={DefaultProfileImage}
        alt="user_profile_image"
        className={`w-${num} h-${num} rounded-full object-cover`}
      />
      <span className="min-w-content max-w-[64px] mt-0.5 text-sm text-center whitespace-nowrap overflow-hidden">
        {props.username}
      </span>
    </div>
  );
};

export default UserProfile;
