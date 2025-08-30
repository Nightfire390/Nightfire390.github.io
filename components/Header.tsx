import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGithub,
  faDiscord,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";

type Props = {};

export default function Header({}: Props) {
  const lenis = useLenis(() => {});

  function handleClick() {
    const navbar = document.getElementById("side-nav");
    const toggle = document.querySelector(".side-nav-toggle");

    const visibility = navbar!.getAttribute("data-visible");
    if (visibility === "false") {
      navbar!.setAttribute("data-visible", "true");
      toggle!.setAttribute("aria-expanded", "true");
    } else {
      navbar!.setAttribute("data-visible", "false");
      toggle!.setAttribute("aria-expanded", "false");
    }
  }

  return (
    <motion.header
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 2,
        ease: "anticipate",
        delay: 1.5,
      }}
      className="fixed top-0 p-5 md:px-24 flex items-center justify-between inset-x-0 z-30 bg-[#090909]"
    >
      <Link
        href="#home"
        className="font-bitcount text-bruh-white hover:text-[#CFDBD5]/90 text-xl transition duration-300 block md:hidden"
        aria-label="Aaditya Kansal"
      >
        <span className="text-bruh-gray">Nightfire:</span> ~#
      </Link>

      <div
        className="my-5 flex md:flex-row flex-col md:static fixed justify-between items-start md:p-0 p-6 pt-16 pb-32 h-screen md:h-auto w-full inset-y-0 inset-x-0 bg-[#090909]/90 z-20 -translate-x-full transition duration-300 ease-in-out md:translate-x-0"
        id="side-nav"
        data-visible="false"
      >
        <div className="flex flex-col md:flex-row underline decoration-transparent text-bruh-white text-2xl md:text-base underline-offset-2 gap-8 md:gap-6">
          <Link
            className="font-bitcount text-xl hidden md:block"
            href="#home"
            onClick={() => {
              lenis?.scrollTo("#home");
              handleClick();
            }}
            aria-label="home"
          >
            <span className="text-bruh-gray">Nightfire:</span> ~#
          </Link>
          <Link
            className="font-bitcount text-xl interactable transition duration-300 decoration-transparent hover:decoration-bruh-gray"
            href="#"
            aria-label="Notes"
          >
            Notes
          </Link>
          <Link
            className="font-bitcount text-xl interactable transition duration-300 decoration-transparent hover:decoration-bruh-gray"
            href="#"
            aria-label="blog"
          >
            Blog
          </Link>
          <Link
            className="font-bitcount text-xl interactable transition duration-300 decoration-transparent hover:decoration-bruh-gray"
            href="#contact"
            onClick={() => {
              lenis?.scrollTo("#contact");
              handleClick();
            }}
            aria-label="contact"
          >
            Contact
          </Link>
          <Link
            className="font-bitcount text-xl interactable transition duration-300 decoration-transparent hover:decoration-bruh-gray"
            href="#rss"
            aria-label="rss"
          >
            RSS
          </Link>
        </div>

      </div>

      <button
        className="side-nav-toggle transition duration-300 ease-in-out md:hidden"
        aria-controls="side-nav"
        aria-expanded="false"
        onClick={handleClick}
      ></button>
    </motion.header>
  );
}
