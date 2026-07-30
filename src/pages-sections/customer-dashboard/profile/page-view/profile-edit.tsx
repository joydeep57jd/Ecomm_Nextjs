import { Fragment } from "react"
// LOCAL CUSTOM COMPONENT
// CUSTOM DATA MODEL

import ProfileEditForm from "../edit-form"
import { UserProfile } from "@/models/User.model"

// ===========================================================
type Props = { user: UserProfile };
// ===========================================================

export function ProfileEditPageView({ user }: Props) {
  // THE FORM OWNS ITS OWN SECTION CARDS — NO OUTER CARD HERE
  return <Fragment>{user && <ProfileEditForm user={user} />}</Fragment>
}
