"use client";

import { Link } from "@/i18n/routing";
import { Page } from "@/types/pages";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { BiMenu, BiX } from "react-icons/bi";

const pages: Page[] = [
  {
    href: "/student",
    key: "student",
    pages: [{ href: "/incommings", key: "incommings" }],
  },
  { href: "/company", key: "company" },
];

const HeaderItem = ({ page }: { page: Page }) => {
  const t = useTranslations("header.pages");

  const renderMenuItems = (pages: Page[]) => (
    <ul className="grid gap-3 p-4">
      {pages.map((p, index) => (
        <ListItem key={index} href={p.href} title={t(`${p.key}.name`)}>
          {p.pages ? t(`${page.key}.description`) : ""}
        </ListItem>
      ))}
    </ul>
  );

  if (!page.pages || page.pages.length === 0) {
    return (
      <NavigationMenuItem>
        <Link href={page.href} legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {t(`${page.key}.name`)}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{t(`${page.key}.name`)}</NavigationMenuTrigger>
      <NavigationMenuContent>
        {renderMenuItems(page.pages)}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const MobileMenu = ({ toggleOpen }: { toggleOpen: () => void }) => {
  const t = useTranslations("header.pages");

  function renderPages(page: Page): React.ReactNode {
    return (
      <React.Fragment key={page.href}>
        <div className="relative">
          <Link
            href={page.href}
            onClick={toggleOpen}
            className="text-3xl"
          >
            {t(`${page.key}.name`).toUpperCase()}
          </Link>
          <div className="relative bottom-0 left-0 w-6 h-1 bg-white"/>
        </div>

        {page.pages && page.pages.length > 0
          ? page.pages.map((p) => renderPages(p))
          : null}
      </React.Fragment>
    );
  }
  return (
    <div className="fixed w-screen h-screen text-white z-[100]">
      <div className="w-full h-full flex items-center justify-center bg-primary">
        <div className="flex flex-col gap-2">
          {pages.map((p) => renderPages(p))}
        </div>
      </div>
      <button
        className="absolute top-10 right-6 text-white"
        onClick={toggleOpen}
      >
        <BiX size={33} />
      </button>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {" "}
      <header
        className={`
        fixed top-0 w-full flex justify-between items-center 
        transition-all duration-300 z-50 px-screen  
        ${isScrolled ? "py-2 bg-primary shadow-lg" : "py-10"}
      `}
      >
        <Link href={"/"}>
          <Image
            src={"/logos/horizontal.png"}
            alt={"Logo"}
            width={isScrolled ? 160 : 255}
            height={isScrolled ? 40 : 75}
            className="transition-all duration-300 h-[45px] w-[160px] md:w-auto md:h-auto"
          />
        </Link>
        <button className="text-white block md:hidden" onClick={toggleMenu}>
          <BiMenu size={26} />
        </button>
        <NavigationMenu
          className={`
          text-white hidden md:flex 
          ${isScrolled ? "text-white" : "text-white"}
        `}
        >
          <NavigationMenuList>
            {pages.map((p, i) => (
              <HeaderItem page={p} key={i} />
            ))}
            <NavigationMenuItem>
              <Button
                className="ml-3"
                variant={isScrolled ? "secondary" : "default"}
                asChild
              >
                <Link href={"#contact"}>Contact</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      {isMenuOpen ? <MobileMenu toggleOpen={toggleMenu} /> : null}
    </>
  );
};

export default Header;
