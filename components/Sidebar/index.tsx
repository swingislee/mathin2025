
'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Translate } from '@/lib/i18n/client';

import Link from 'next/link';
import { Setlng } from '@/components/setlng';

import { Button } from '@/components/ui/button'
import { BsPersonBoundingBox,BsX } from "react-icons/bs";
import { ModeToggle } from '../ui/mode-toggle';

export const Sidebar = ({ lng }: { lng: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = Translate(lng);
  
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative h-full w-full flex justify-end items-start p-4 overflow-hidden pointer-events-none">
      <div className='fixed flex p-5 space-x-4 flex-row z-50 items-center pointer-events-auto'>
        <div>
          {isOpen ? (
            <></>
          ) : (
            <ModeToggle/>
          )}  
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleDrawer}
        >
          {isOpen ? (
            <BsX  className="h-8 w-8"/>
          ) : (
            <BsPersonBoundingBox className="h-8 w-8" />
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 flex flex-col h-full space-y-2  bg-white dark:bg-slate-600 shadow-lg p-4 pointer-events-auto"
          >
            <div className='h-20'>  </div>
              <Button variant='ghost'  size="lg" asChild>
                <Link href={`/${lng}/dashboard`} > {t("dashboard")} </Link>
              </Button>
              <Button variant="default"  size="lg" asChild>
                <Link href={`/${lng}/login`} > {t("signin")} </Link>
              </Button>
            <Setlng lng={lng}/>
          </motion.div>
        )}
      </AnimatePresence>      
    </div>
  );
}