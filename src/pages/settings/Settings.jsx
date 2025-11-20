import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { EditProfileContent } from "./EditProfile";
import { updateProfile } from "../../services/apiProfile";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../../ui/ui components/Spinner"
import Button from "../../ui/ui components/Button";

export default function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  // Fetch real user data from Supabase
  const { profile, isLoading, error } = useAuth();

  // Helper functions to transform data
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
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
          <Button onClick={() => navigate("/signin")} type="settingsButton">
            Back to Sign In
          </Button>
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
      <div className="md:w-40 lg:w-80 border-r border-zinc-800 p-8 overflow-y-auto">
        <h1 className="md:2xl lg:text-4xl font-bold mb-8">Settings</h1>

        {/* Profile Info Section */}
        <div className="mb-6 ">
          <h2 className="lg:text-xl font-bold mb-3 ">Profile Info</h2>
          <SettingsNavButton
            id="edit-profile"
            activeSection={activeSection}
            onSelect={setActiveSection}
          >
            Edit profile
          </SettingsNavButton>
        </div>

        {/* Your Activity Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Your Activity</h2>
          <div className="flex flex-col gap-1">
            <SettingsNavButton
              id="posts-stories"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Posts & Stories
            </SettingsNavButton>
            <SettingsNavButton
              id="liked"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Liked
            </SettingsNavButton>
            <SettingsNavButton
              id="blocked"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Blocked
            </SettingsNavButton>
          </div>
        </div>

        {/* App preferences Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">App preferences</h2>
          <div className="flex flex-col gap-1">
            <SettingsNavButton
              id="theme"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Theme
            </SettingsNavButton>
            <SettingsNavButton
              id="notifications"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Notifications
            </SettingsNavButton>
            <SettingsNavButton
              id="accessibility"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Accessibility
            </SettingsNavButton>
          </div>
        </div>

        {/* Account preferences Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Account preferences</h2>
          <div className="flex flex-col gap-1">
            <SettingsNavButton
              id="visibility"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Visibility
            </SettingsNavButton>
            <SettingsNavButton
              id="other-accounts"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Other Accounts
            </SettingsNavButton>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Security</h2>
          <div className="flex flex-col gap-1">
            <SettingsNavButton
              id="password"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Password
            </SettingsNavButton>
            <SettingsNavButton
              id="authentication"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Authentication
            </SettingsNavButton>
            <SettingsNavButton
              id="account-recovery"
              activeSection={activeSection}
              onSelect={setActiveSection}
            >
              Account Recovery
            </SettingsNavButton>
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
        <h2 className="text-4xl font-bold mb-4">
          Welcome to your settings page!
        </h2>
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

function SettingsNavButton({ id, activeSection, onSelect, children }) {
  const isActive = activeSection === id;
  const variant = isActive
    ? "bg-amber-300 text-black font-medium"
    : "hover:bg-zinc-800 text-zinc-100";

  return (
    <Button
      type="settingsButton"
      onClick={() => onSelect(id)}
      className={variant}
    >
      {children}
    </Button>
  );
}
