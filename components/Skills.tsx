import React from "react";
import { motion } from "framer-motion";
import Skill from "./Skill";

type Props = {};

export default function Skills({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex relative flex-col text-center my-auto md:text-left xl:px-10 items-center mx-auto justify-between py-16"
    >
      <h3 className="text-5xl font-bitcount">Toolkit</h3>
      <div className="flex flex-col">
        <div className="flex flex-row md:mr-44">
          <div className="flex flex-row">
            <div className="border-r border-r-[#354545] font-space_light text-s text-gray-500 px-5 pt-3 mt-14 py-2 my-auto">
              <p className="justify-self-end">Languages</p>
              [<span className="text-bruh-white text-s"> For Programming </span>]
            </div>
            <div className="border-t border-t-[#354545] mt-16 px-2" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5 mt-10 px-10">
            <Skill imgUrl="./skills/rust.png" name="rust" />
            <Skill imgUrl="./skills/go.png" name="golang" />
            <Skill imgUrl="./skills/ruby.png" name="ruby" />
            <Skill imgUrl="./skills/py.png" name="python" />
            <Skill imgUrl="./skills/js.png" name="javascript" />
            <Skill imgUrl="./skills/ts.png" name="typescript" />
          </div>
        </div>
        <div className="flex flex-row md:ml-48">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5 mt-10 px-10">
            <Skill imgUrl="./skills/mysql.png" name="SQL" />
            <Skill imgUrl="./skills/node.png" name="node.js" />
            <Skill imgUrl="./skills/flask.png" name="flask" />
            <Skill imgUrl="./skills/firebase.png" name="firebase" />
            <Skill imgUrl="./skills/mongodb.png" name="mongodb" />
            <Skill imgUrl="./skills/git.png" name="git" />
          </div>
          <div className="flex flex-row">
            <div className="border-t border-t-[#354545] mt-16 px-2 mx-0" />
            <div className="border-l border-l-[#354545] font-space_light text-s text-gray-500 px-5 pt-3 mt-14 py-2 my-auto">
              <p>Frameworks</p>
              [<span className="text-bruh-white text-s"> For Development </span>]
            </div>
          </div>
        </div>
        <div className="flex flex-row md:ml-9">
          <div className="flex flex-row">
            <div className="border-r border-r-[#354545] font-space_light text-s text-gray-500 px-5 pt-3 mt-14 py-2 my-auto">
              <p>Tools</p>
              [<span className="text-bruh-white text-s"> For Security </span>]
            </div>
            <div className="border-t border-t-[#354545] mt-16 px-2 mx-0" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5 mt-10 px-10">
            <Skill imgUrl="./skills/wireshark.png" name="wireshark" />
            <Skill imgUrl="./skills/ghidra.png" name="ghidra" />
            <Skill imgUrl="./skills/qemu.png" name="qemu/KVM" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
