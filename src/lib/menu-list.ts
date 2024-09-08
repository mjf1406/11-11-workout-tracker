// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  Dumbbell,
  Settings,
  LayoutGrid,
  LucideIcon, 
  Activity
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  under_construction: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  under_construction: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

function sortByLabel<T extends { label: string }>(items: T[]): T[] {
  return items.sort((a, b) => a.label.localeCompare(b.label));
}

export function getMenuList(pathname: string): Group[] {
  const unsortedMenuList: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          under_construction: true,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/exercises",
          label: "Exercises",
          active: pathname.includes("/exercises"),
          icon: Dumbbell,
          under_construction: false,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          under_construction: false,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/workout",
          label: "Workout",
          active: pathname.includes("/workout"),
          icon: Activity,
          under_construction: false,
          submenus: []
        }
      ]
    },
  ];

  // Sort menus and submenus within each group
  const sortedMenuList = unsortedMenuList.map(group => ({
    ...group,
    menus: sortByLabel(group.menus.map(menu => ({
      ...menu,
      submenus: sortByLabel(menu.submenus)
    })))
  }));

  return sortedMenuList;
}
