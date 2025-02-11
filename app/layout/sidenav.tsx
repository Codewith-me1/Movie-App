import {
  AlarmClock,
  Bell,
  Calendar,
  CassetteTapeIcon,
  Clapperboard,
  Heart,
  Home,
  Inbox,
  PlusSquareIcon,
  Search,
  Settings,
  TvIcon,
  User2Icon,
  Video,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Movie",
    url: "/movie",
    icon: Video,
  },
  {
    title: "Tv Show",
    url: "/tvshow",
    icon: TvIcon,
  },

  {
    title: "Coming Soon",
    url: "/comingsoon",
    icon: AlarmClock,
  },
];

const Library = [
  {
    title: "Playlists",
    url: "/Authenticated/Playlist",
    icon: Heart,
  },
  {
    title: "Watchlists",
    url: "/Authenticated/Watchlist",
    icon: PlusSquareIcon,
  },
];

interface Props {
  loggedIn: boolean;
}
export default function SideNav({ loggedIn }: Props) {
  const groups = { Library };

  return (
    <Sidebar>
      <SidebarContent className="shadow-lg glossy-effect overflow-hidden text-white">
        {/* Application Label */}
        <SidebarGroupLabel className="text-lg my-5 text-white font-sans">
          <Clapperboard className="m-1" />
          Movie Application
        </SidebarGroupLabel>

        {/* Menu Group */}
        <SidebarGroup className="ml-1">
          <SidebarGroupLabel className="text-md my-2 text-zinc-400">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="text-lg" asChild>
                    <a className="text-lg" href={item.url}>
                      <item.icon style={{ width: "24px", height: "20px" }} />
                      <span className="text-[1rem]">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Conditionally Render Library and General Groups */}
        {loggedIn &&
          Object.entries(groups).map(([groupName, items]) => (
            <SidebarGroup className="ml-1" key={groupName}>
              <SidebarGroupLabel className="text-md my-2 text-zinc-400">
                {groupName}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton className="text-lg" asChild>
                        <a className="text-lg" href={item.url}>
                          <item.icon
                            style={{ width: "24px", height: "20px" }}
                          />
                          <span className="text-[1rem]">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
    </Sidebar>
  );
}
