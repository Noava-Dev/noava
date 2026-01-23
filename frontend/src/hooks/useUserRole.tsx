import { UserRoleContext } from "../contexts/UserRoleContext";
import { useContext } from 'react';

export const useUserRole = () => useContext(UserRoleContext);