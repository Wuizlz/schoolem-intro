import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateProfile } from "../../services/apiProfile";
import { useAuth } from "../../hooks/useAuth";
import OwnUserCircle from "../../ui/ui components/OwnUserCircle";
import Button from "../../ui/ui components/Button";

// Edit Profile Content
export function EditProfileContent({ user }) {
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.profileImage);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    bio: user.bio || "",
    birthdate: user.birthdate || "",
    gender: user.gender 
      ? (["Male", "Female", "Non-binary", "Prefer not to disclose", "Other"]
          .find(opt => opt.toLowerCase() === user.gender.toLowerCase()) || user.gender)
      : "Prefer not to disclose",
  });

  // Track if form has changes
  const [hasChanges, setHasChanges] = useState(false);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle file selection for profile picture
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setHasChanges(true);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Save changes to Supabase
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        birthdate: formData.birthdate,
        gender: formData.gender,
        avatarFile: selectedImage,
      });

      // Invalidate and refetch profile data
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await refreshProfile();
      
      toast.success("Changes saved successfully!");
      setHasChanges(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error(error.message || "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      bio: user.bio || "",
      birthdate: user.birthdate || "",
      gender: user.gender 
        ? (["Male", "Female", "Non-binary", "Prefer not to disclose", "Other"]
            .find(opt => opt.toLowerCase() === user.gender.toLowerCase()) || user.gender)
        : "Prefer not to disclose",
      profileImage: user.profileImage || null,
    });
    setImagePreview(user.profileImage);
    setSelectedImage(null);
    setHasChanges(false);
  };

  return (
    <div className="p-12">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold">Edit Profile</h2>
          <Button 
            onClick={handleChangePhotoClick}
            buttonType="button"
          >
            Change Your Look
          </Button>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Profile Picture and Username */}
        <div className="flex items-center gap-4 mb-8">
          <OwnUserCircle type = "editStyle"/>
          <div>
            <h3 className="text-2xl font-bold">{formData.fullName}</h3>
            <p className="text-[var(--color-grey-500)]">{formData.username}</p>
            {selectedImage && (
              <p className="text-sm text-yellow-400 mt-1">
                New photo selected
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-6 py-4 bg-transparent border border-[var(--color-grey-200)] rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-lg font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-6 py-4 bg-transparent border border-[var(--color-grey-200)] rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full px-6 py-4 bg-transparent border border-[var(--color-grey-200)] rounded-3xl text-lg focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
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
                className="w-full px-6 py-4 bg-[var(--color-grey-0)] border border-[var(--color-grey-200)] rounded-full text-lg text-[var(--color-grey-500)] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="text"
                value={formData.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                className="w-full px-6 py-4 bg-transparent border border-[var(--color-grey-200)] rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-lg font-medium mb-2">Gender</label>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-6 py-4 bg-transparent border border-[var(--color-grey-200)] rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
              >
                <option value="Male" className="bg-[var(--color-grey-0)]">
                  Male
                </option>
                <option value="Female" className="bg-[var(--color-grey-0)]">
                  Female
                </option>
                <option value="Non-binary" className="bg-[var(--color-grey-0)]">
                  Non-binary
                </option>
                <option value="Prefer not to disclose" className="bg-[var(--color-grey-0)]">
                  Prefer not to disclose
                </option>
                <option value="Other" className="bg-[var(--color-grey-0)]">
                  Other
                </option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-[var(--color-grey-500)]"
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
              <input
                type="text"
                value={user.university}
                readOnly
                className="w-full px-6 py-4 bg-[var(--color-grey-0)] border border-[var(--color-grey-200)] rounded-full text-lg text-[var(--color-grey-500)] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons - Only show when there are changes */}
        {hasChanges && (
          <div className="mt-8 flex items-center justify-end gap-4 border-t border-[var(--color-grey-200)] pt-6">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2.5 border border-zinc-600 text-[var(--color-grey-600)] font-medium rounded-full hover:bg-[var(--color-grey-100)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-6 py-2.5 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
