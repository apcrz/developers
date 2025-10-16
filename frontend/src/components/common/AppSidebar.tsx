"use client";

import { Home, Layers, Users } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Níveis",
        url: "/levels",
        icon: Layers,
    },
    {
        title: "Desenvolvedores",
        url: "/developers",
        icon: Users,
    },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar className={`fixed top-0 left-0 h-screen z-40 ${isCollapsed ? "w-14" : "w-64"} transition-all duration-300`} collapsible="icon">
            <SidebarContent>
                <div className="p-2 pt-4 border-b border-sidebar-border">
                    {isCollapsed ? (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                            <Users className="h-4 w-4 text-primary-foreground" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Users className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-semibold text-sidebar-foreground">DevSystem</span>
                        </div>
                    )}
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}