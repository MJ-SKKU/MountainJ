import DefaultProfileImage from "../assets/images/default_profile.jpg";

const UserProfile = ({ username, large }) => {
  const num = large ? 14 : 10;

  return (
    <div className="flex flex-col items-center">
      <img
        src={DefaultProfileImage}
        alt="user_profile_image"
        className={`w-${num} h-${num} rounded-full object-cover`}
      />
      <span className="min-w-content mt-0.5 text-sm text-center whitespace-nowrap overflow-hidden">
        {username}
      </span>
    </div>
  );
};

export default UserProfile;
