import { motion } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';
import React from 'react';

type Props = {}

export default function About({}: Props) {
  return (
    <div
        className='py-16 flex relative flex-col text-center gap-6 md:text-left md:flex-row-reverse max-w-7xl px-10 mx-auto items-center overflow-x-hidden'>
        <div 
            className="flex-shrink-0 w-56 h-56 rounded-full md:rounded-lg md:w-64 md:h-95 xl:w-[300px] xl:h-[400px] bg-[url('/hello.jpg')] bg-cover bg-center border-2 border-[#363c3c]"
            ></div>
        <div
            className='space-y-5 px-0 md:px-10 text-gray-300'>
            <h4 className='text-5xl font-bitcount text-bruh-white'># more &quot;<span className='underline decoration-bruh-gray tracking-wide'>Aaditya Kansal.md</span>&quot;</h4>
            <p className='text-s text-gray-400 justify-normal'>
Backend developer with a focus on security and malware research. I spend a good amount of time reverse engineering, studying offensive techniques, and generally trying to understand how digital threats work.<br /><br />
Most comfortable writing Go, Rust, Python, or Node.js, depending on what the problem calls for.<br /><br />
When I'm not writing code or diving into cryptography concepts, you'll probably find me doodling random things or figuring out why some system is behaving weirdly.<br /></p>
            <SocialIcon 
                url="https://github.com/Nightfire390" 
                bgColor='transparent' 
                fgColor='currentColor'
                className='hover:text-bruh-gray h-10 w-10 mr-2 transition duration-200 ease-in-out'
            />
            <SocialIcon
                url='https://www.linkedin.com/in/aaditya-kansal-7011811aa/'
                bgColor='transparent'
                fgColor='currentColor'
                className='hover:text-bruh-gray h-10 w-10 mr-2 transition duration-200 ease-in-out'
            />
            <SocialIcon 
                url="https://twitter.com/AadityaKansal" 
                bgColor='transparent' 
                fgColor='currentColor'
                className='hover:text-bruh-gray h-10 w-10 mr-2 transition duration-200 ease-in-out'
            />
            <SocialIcon
                url='https://discord.com/users/779325697684406312'
                bgColor='#0c0c0c'
                fgColor='currentColor'
                className='hover:text-bruh-gray h-10 w-10 mr-2 transition duration-200 ease-in-out'
            />
        </div>
    </div>
  )
}
