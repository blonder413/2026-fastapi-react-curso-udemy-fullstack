import { findAll } from "../services/user.api";
import { findAll as findAllProfiles } from "../services/profile.api";
import { findAll as findAllStates } from "../services/state.api";

export const loader = async () => {
  const data = await findAll();
  const profiles = await findAllProfiles();
  const states = await findAllStates();
  return { data, profiles, states };
};
