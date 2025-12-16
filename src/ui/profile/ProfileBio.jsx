export default function ProfileBio({ bio }) {
  return (
    <div className="sm:w-fit sm:my-auto">
      <p className="text-[var(--color-grey-700)] font-serif my-auto ">{bio}</p>
    </div>
  );
}
