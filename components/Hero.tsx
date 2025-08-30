import React from "react";
import Link from "next/link";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import Background from "./Background";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

type Props = {};

export default function Hero({}: Props) {
  const [text, count] = useTypewriter({
    words: [
      "Backend Developer",
      "Malware Enthusiast",
      "Doodler",
      "Hitman for Hire"
    ],
    loop: true,
    delaySpeed: 4000,
  });
  return (
    <div className="h-screen flex flex-col justify-center relative items-center text-center overflow-hidden bg-[#111]">
      <Background />
      <div className="absolute bg-bruh-black/50 inset-0 z-0"></div>
      <div className="z-20 space-y-3">
        <div>
          <motion.h2
            initial={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
            }}
            animate={{
              clipPath: "polygon(0px 100%, 100% 100%, 100% 0px, 0px 0px)",
            }}
            transition={{
              duration: 2.5,
              ease: "anticipate",
              delay: 0.5,
            }}
            className="text-lg uppercase text-gray-400 opacity-70 tracking-[5px]"
          >
            Hi there, I&apos;m
          </motion.h2>
          <motion.h1
            initial={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
            }}
            animate={{
              clipPath: "polygon(0px 100%, 100% 100%, 100% 0px, 0px 0px)",
            }}
            transition={{
              duration: 2.5,
              ease: "anticipate",
              delay: 0.5,
            }}
            className="text-3xl lg:text-6xl text-bruh-white font-bitcount p-2 px-10"
          >
            Aaditya Kansal
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 2.5,
              ease: "anticipate",
              delay: 1,
            }}
            className="text-lg text-gray-500 opacity-70 pb-4"
          >
            <span>{text}</span>
            <Cursor cursorColor="bruh-gray" />
          </motion.p>
        </div>
      </div>
      <motion.div
        initial={{
          bottom: "-20vh",
        }}
        animate={{
          bottom: 0,
        }}
        transition={{
          duration: 2,
          ease: "anticipate",
          delay: 1.5,
        }}
        className="custom-shape-divider-bottom-1687952567 heroTexture z-0"
      >
      </motion.div>
    </div>
  );
}
