import { StyledNavLink } from "../MainNav";

export default function ProfileTabsNav() {
  return (
    <ul className="flex flex-row justify-evenly w-full text-amber-50 text-2xl font-extrabold mb-.5 ">
      <li>
        <StyledNavLink to="." end  $compactOnMobile={false} >
          Pubs
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="saved"  $compactOnMobile={false} >
          Saved
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="tagged"  $compactOnMobile={false} >
          Tagged
        </StyledNavLink>
      </li>
    </ul>
  );
}
