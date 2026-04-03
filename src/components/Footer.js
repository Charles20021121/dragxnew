"use client"
import React from 'react';
import { FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion";

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Footer = () => {
  return (
    <div>
      <meta
        name="format-detection"
        content="telephone=no, date=no, email=no, address=no"
      />
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
        className="bg-[#28242c] p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div variants={itemVariants}>
            <FooterLogo />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ContactInfo />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickLinks />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FollowUs />
          </motion.div>
        </div>
        <motion.div
          variants={itemVariants}
          className="h-px bg-white/20 my-6"
        />
        <motion.div variants={itemVariants}>
          <FooterCopyright />
        </motion.div>
      </motion.footer>
    </div>
  );
};

const FooterLogo = () => (
  <div className="flex justify-start items-center">
    <Image
      src="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/zvrfokcnqhxqa8crxgoj.webp"
      alt="Dragx Logo"
      width={300}
      height={95}
      className="h-24 w-auto object-contain"
    />
  </div>
);

const ContactInfo = () => (
  <div className="flex justify-start text-white">
    <div>
      <div className="font-bold py-2 text-base">Contact Info</div>
      <ContactItem text="+60 19-277 6056" />
      <ContactItem text="dragxhq@gmail.com" />
    </div>
  </div>
);

const ContactItem = ({ text }) => (
  <div className="py-1 text-sm text-white/80">
    <span>{text}</span>
  </div>
);

const QuickLinks = () => (
  <div className="flex justify-start text-white">
    <div>
      <QuickLink href="/" text="Home" />
      <QuickLink href="/products" text="Product" />
      <QuickLink href="/gallery" text="Gallery" />
      <QuickLink href="/locations" text="Location" />
    </div>
  </div>
);

const QuickLink = ({ href, text }) => (
  <div className="py-2">
    <span className="relative -bottom-1 mr-1.5 text-[#80bc44] font-bold">•</span>
    <Button 
      variant="link" 
      asChild 
      className="text-white hover:text-white/80 p-0 h-auto font-normal"
    >
      <a href={href}>{text}</a>
    </Button>
  </div>
);

const FollowUs = () => (
  <div className="flex justify-start text-white">
    <div className="flex gap-8">
      <SocialIconLink 
        href="https://www.facebook.com/people/DragX-ZhenZhen/61553220925855/" 
        icon={<FaFacebook style={{ fontSize: '40px' }} />}
      />
      <SocialIconLink 
        href="https://wa.me/60192776056?text=Hi Dragx, Can you recommend a product that suits my needs?" 
        icon={<FaWhatsapp style={{ fontSize: '40px' }} />}
      />
      <SocialIconLink 
        href="https://www.tiktok.com/@yaphongzhen" 
        icon={<FaTiktok style={{ fontSize: '40px' }} />}
      />
    </div>
  </div>
);

const SocialIconLink = ({ href, icon }) => (
  <motion.div
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    className="cursor-pointer"
  >
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-white hover:text-[#80bc44] transition-colors"
    >
      {icon}
    </a>
  </motion.div>
);

const FooterCopyright = () => (
  <div className="flex justify-center items-center pt-4">
    <p className="text-[13px] font-bold text-[#afb1b0]">
      © {new Date().getFullYear()} EXT AUTO SUPPLY SDN BHD 201901034658 &#40;1343988-K&#41; | ALL RIGHTS RESERVED
    </p>
  </div>
);

export default Footer; 