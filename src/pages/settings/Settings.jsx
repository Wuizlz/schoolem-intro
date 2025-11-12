import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../hooks/useProfile";
import { EditProfileContent } from "./EditProfile";
import { updateProfile } from "../../services/apiProfile";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";

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
      timeZone: "UTC",
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
    university: profile.university_name,
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
