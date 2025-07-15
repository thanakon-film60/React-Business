"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import Image from "next/image";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import CartButton from "@/components/CartButton";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false);
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

    useEffect(() => {
      // @ts-ignore
  import("bootstrap/dist/js/bootstrap.bundle.min.js");
}, []);
   const menu1 = headerData.slice(0, 3); 
   const menu2 = headerData.slice(3);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 border-b border-black/60 
      }`}
      style={{ backgroundColor:  "#fff" }}
    >
      <div className="lg:py-0 py-2">
        <div className="flex items-center justify-between px-4 w-full h-[110px]">

      <nav className="hidden lg:flex grow items-center gap-20 justify-center d-flex">
        {menu1.map((item, i) =>
          item.submenu ? (
            <div className="menu-item-wrapper" key={i}>
              <div className="dropdown w-full h-full">
                <button
                  className="btn btn-link dropdown-toggle text-gray-979797 w-full h-full"
                  type="button"
                  id={`dropdownMenuButton-${i}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderRadius: "0.75rem",
                    fontWeight: 500,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {item.label}
                </button>
                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${i}`}>
                  {item.submenu.map((sub, j) => (
                    <li key={j}>
                      <Link className="dropdown-item" href={sub.href}>
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="menu-item-wrapper" key={i}>
              <HeaderLink item={item} />
            </div>
          )
        )}

        <Logo />

        {menu2.map((item, i) =>
          item.submenu ? (
            <div className="menu-item-wrapper" key={menu1.length + i}>
              <div className="dropdown w-full h-full">
                <button
                  className="btn btn-link dropdown-toggle text-gray-979797 w-full h-full"
                  type="button"
                  id={`dropdownMenuButton-${menu1.length + i}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderRadius: "0.75rem",
                    fontWeight: 500,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {item.label}
                </button>
                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${menu1.length + i}`}>
                  {item.submenu.map((sub, j) => (
                    <li key={j}>
                      <Link className="dropdown-item" href={sub.href}>
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="menu-item-wrapper" key={menu1.length + i}>
              <HeaderLink item={item} />
            </div>
          )
        )}
      </nav>



                    
            <div className="flex flex-col items-end gap-2 pl-16 ">
              {/* Row 1: CartButton */}
              {/* <div>
                <CartButton />
              </div> */}
              {/* Row 2: Language Switcher */}
              <div className="flex items-center gap-4">
                {/* English */}
                <Link href="/en" className="flex items-center gap-2 hover:opacity-80">
                  <Image
                    src="/images/icons/us.svg"
                    alt="US Flag"
                    width={24}
                    height={16}
                    style={{ borderRadius: '2px' }}
                  />
                  <span>English</span>
                </Link>
                {/* Thai */}
                <Link href="/th" className="flex items-center gap-2 hover:opacity-80">
                  <Image
                    src="/images/icons/th.svg"
                    alt="TH Flag"
                    width={24}
                    height={16}
                    style={{ borderRadius: '2px' }}
                  />
                  <span>Thai</span>
                </Link>
              </div>
            </div>


        </div>

        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-midnight_text dark:text-midnight_text">
              <Logo />
            </h2>

            {/*  */}
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
              aria-label="Close menu Modal"
            ></button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
