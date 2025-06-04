import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OutlinedButton from '@/components/OutlinedButton/OutlinedButton';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-mainbg p-6 rounded-xl max-w-md w-full mx-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4">{title}</h3>
                        <p className="text-muted mb-6">{message}</p>
                        <div className="flex justify-end gap-4">
                            <OutlinedButton
                                onClick={onClose}
                                className="hover:text-red-500 hover:border-red-500"
                            >
                                Скасувати
                            </OutlinedButton>
                            <OutlinedButton
                                onClick={onConfirm}
                                className="hover:text-emerald-400 hover:border-emerald-400"
                            >
                                Підтвердити
                            </OutlinedButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal; 