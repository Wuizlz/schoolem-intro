import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import Spinner from "../ui/Spinner";

export default function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  // Fetch real user data from Supabase
  const { data: profile, isLoading, error } = useProfile();

  // Helper functions to transform data
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading profile</p>
          <p className="text-zinc-400 mb-4">{error.message}</p>
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Transform profile data to match the format expected by components
  const userData = {
    fullName: profile.full_name || "Unknown User",
    username: profile.display_name || profile.email?.split("@")[0],
    bio: profile.bio || "",
    age: calculateAge(profile.b_date),
    birthdate: formatDate(profile.b_date),
    gender: profile.gender || "Prefer not to disclose",
    // university: "Purdue University Northwest - Hammond Campus", // TODO: Join with universities table
    university: profile.uni_id.name,
    profileImage: profile.avatar_url || null,
  };

  const renderContent = () => {
    switch (activeSection) {
      case "edit-profile":
        return <EditProfileContent user={userData} />;
      case "posts-stories":
        return <PlaceholderContent title="Posts & Stories" />;
      case "liked":
        return <PlaceholderContent title="Liked" />;
      case "blocked":
        return <PlaceholderContent title="Blocked" />;
      case "theme":
        return <PlaceholderContent title="Theme" />;
      case "notifications":
        return <PlaceholderContent title="Notifications" />;
      case "accessibility":
        return <PlaceholderContent title="Accessibility" />;
      case "visibility":
        return <PlaceholderContent title="Visibility" />;
      case "other-accounts":
        return <PlaceholderContent title="Other Accounts" />;
      case "password":
        return <PlaceholderContent title="Password" />;
      case "authentication":
        return <PlaceholderContent title="Authentication" />;
      case "account-recovery":
        return <PlaceholderContent title="Account Recovery" />;
      default:
        return <WelcomeContent />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      {/* Left Sidebar */}
      <aside className="w-48 border-r border-zinc-800 p-6 flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="SchoolEm" className="h-12 w-12" />
          <div>
            <div className="text-sm font-serif italic">SchoolEm</div>
            <div className="text-xs text-zinc-400">Purdue Northwest</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/uni")}
            className="flex items-center gap-3 text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <span className="text-2xl">🏛️</span>
            <span className="text-base">Uni</span>
          </button>
          <button className="flex items-center gap-3 text-zinc-300 hover:text-zinc-100 transition-colors">
            <span className="text-2xl">🔔</span>
            <span className="text-base">Alerts</span>
          </button>
          <button className="flex items-center gap-3 text-zinc-300 hover:text-zinc-100 transition-colors">
            <span className="text-2xl">😊</span>
            <span className="text-base">Profile</span>
          </button>
          <button className="flex items-center gap-3 text-zinc-300 hover:text-zinc-100 transition-colors">
            <span className="text-2xl">➕</span>
            <span className="text-base">Create</span>
          </button>
          <button className="flex items-center gap-3 text-zinc-300 hover:text-zinc-100 transition-colors">
            <span className="text-2xl">📊</span>
            <span className="text-base">More</span>
          </button>
        </nav>
      </aside>

      {/* Middle Panel - Settings Menu */}
      <div className="w-80 border-r border-zinc-800 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {/* Profile Info Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Profile Info</h2>
          <button
            onClick={() => setActiveSection("edit-profile")}
            className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
              activeSection === "edit-profile"
                ? "bg-yellow-400 text-black font-medium"
                : "hover:bg-zinc-800 text-zinc-100"
            }`}
          >
            Edit profile
          </button>
        </div>

        {/* Your Activity Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Your Activity</h2>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveSection("posts-stories")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "posts-stories"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Posts & Stories
            </button>
            <button
              onClick={() => setActiveSection("liked")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "liked"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Liked
            </button>
            <button
              onClick={() => setActiveSection("blocked")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "blocked"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Blocked
            </button>
          </div>
        </div>

        {/* App preferences Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">App preferences</h2>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveSection("theme")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "theme"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Theme
            </button>
            <button
              onClick={() => setActiveSection("notifications")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "notifications"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveSection("accessibility")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "accessibility"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Accessibility
            </button>
          </div>
        </div>

        {/* Account preferences Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Account preferences</h2>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveSection("visibility")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "visibility"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Visibility
            </button>
            <button
              onClick={() => setActiveSection("other-accounts")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "other-accounts"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Other Accounts
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Security</h2>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveSection("password")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "password"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setActiveSection("authentication")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "authentication"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Authentication
            </button>
            <button
              onClick={() => setActiveSection("account-recovery")}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-colors ${
                activeSection === "account-recovery"
                  ? "bg-yellow-400 text-black font-medium"
                  : "hover:bg-zinc-800 text-zinc-100"
              }`}
            >
              Account Recovery
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Content Area */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}

// Welcome screen when no section is selected
function WelcomeContent() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to your settings page!</h2>
        <p className="text-zinc-400 text-lg">
          Select an option from the menu to get started
        </p>
      </div>
    </div>
  );
}

// Placeholder for sections not yet implemented
function PlaceholderContent({ title }) {
  return (
    <div className="p-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-zinc-400">This section is coming soon...</p>
    </div>
  );
}

// Edit Profile Content
function EditProfileContent({ user }) {
  return (
    <div className="p-12">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold">Edit Profile</h2>
          <button className="px-6 py-2.5 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-500 transition-colors">
            Change Your Look
          </button>
        </div>

        {/* Profile Picture and Username */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user.fullName}</h3>
            <p className="text-zinc-400">{user.username}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              defaultValue={user.fullName}
              className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-lg font-medium mb-2">Username</label>
            <input
              type="text"
              defaultValue={user.username}
              className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg font-medium mb-2">Bio</label>
            <textarea
              defaultValue={user.bio}
              rows={3}
              className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-3xl text-lg focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
            />
          </div>

          {/* Age and Date of Birth */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-2">Age</label>
              <input
                type="text"
                value={user.age}
                readOnly
                className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="text"
                defaultValue={user.birthdate}
                className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-lg font-medium mb-2">Gender</label>
            <div className="relative">
              <select
                defaultValue={user.gender}
                className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
              >
                <option value="Male" className="bg-zinc-900">
                  Male
                </option>
                <option value="Female" className="bg-zinc-900">
                  Female
                </option>
                <option value="Non-binary" className="bg-zinc-900">
                  Non-binary
                </option>
                <option value="Prefer not to say" className="bg-zinc-900">
                  Prefer not to say
                </option>
                <option value="Other" className="bg-zinc-900">
                  Other
                </option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* University */}
          <div>
            <label className="block text-lg font-medium mb-2">University</label>
            <div className="relative">
              <select
                defaultValue={user.university}
                className="w-full px-6 py-4 bg-transparent border border-zinc-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
              >
                <option
                  value="Purdue University Northwest - Hammond Campus"
                  className="bg-zinc-900"
                >
                  Purdue University Northwest - Hammond Campus
                </option>
                <option
                  value="Purdue University Northwest - Westville Campus"
                  className="bg-zinc-900"
                >
                  Purdue University Northwest - Westville Campus
                </option>
                {/* Add more universities as needed */}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
