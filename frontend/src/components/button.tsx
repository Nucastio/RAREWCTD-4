import { type ButtonHTMLAttributes } from 'react';
import { motion, type MotionProps } from "framer-motion";

// Merge ButtonHTMLAttributes<HTMLButtonElement> with MotionProps
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>, MotionProps {
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            // whileTap={{ background: "#2cb9c3" }}
            className={`ripple hover:!text-black text-secondary transition-[color] w-auto duration-200 py-3 px-10 text-base rounded-[10px] font-inter font-bold uppercase  tracking-wider bg-black/50 ${className}`}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;