import { Drawer, DrawerItems, Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";
import { LuBell, LuCircleHelp, LuLayers, LuLayoutDashboard, LuSettings, LuUsers } from "react-icons/lu";
import { RiShieldUserLine } from "react-icons/ri";
import { useUserRole } from "../../../hooks/useUserRole";
import { useState } from "react";


function NoavaSidebar() {
    const { userRole } = useUserRole()
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => setIsOpen(false);

    return(
        <Drawer open={isOpen} onClose={handleClose}>
            <DrawerItems>
                <Sidebar aria-label="Noava Sidebar">
                    {/* Logo */}
                    <SidebarItemGroup>
                        <SidebarLogo href="#" img="/src/assets/noava-logo-blue-nobg.png" imgAlt="Noava Logo">
                            Noava
                        </SidebarLogo>
                    </SidebarItemGroup>

                    <SidebarItems>
                        {/* Main Navigation */}
                        <SidebarItemGroup>
                            <SidebarItem icon={LuLayoutDashboard}>
                                Dashboard
                            </SidebarItem>

                            <SidebarItem icon={LuLayers}>
                                Decks
                            </SidebarItem>

                            <SidebarItem icon={LuUsers}>
                                Classrooms
                            </SidebarItem>

                            <SidebarItem icon={LuCircleHelp}>
                                FAQ
                            </SidebarItem>
                        </SidebarItemGroup>

                        {/* Bottom Navigation */}
                        <SidebarItemGroup>
                            <SidebarItem icon={LuBell} label="0" labelColor="indigo">
                                Notifications
                            </SidebarItem>

                            <SidebarItem icon={LuSettings}>
                                Settings
                            </SidebarItem>

                        {userRole === "ADMIN" ? (
                            <SidebarItem icon={RiShieldUserLine}>
                                Admin
                            </SidebarItem>
                        ) : null}
                        </SidebarItemGroup>
                    </SidebarItems>
                </Sidebar>
            </DrawerItems>
        </Drawer>
    )
}

export default NoavaSidebar