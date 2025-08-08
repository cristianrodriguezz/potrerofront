import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, FlipHorizontal } from "lucide-react";

interface NavBarSelectedElementProps {
    selectedId: string | null;
    handleFlipHorizontal: (id: string) => void;
    handleDelete: (id: string) => void;
    handleDuplicate: (id: string) => void;
}

const NavBarSelectedElement: React.FC<NavBarSelectedElementProps> = ({
    selectedId,
    handleFlipHorizontal,
    handleDelete,
    handleDuplicate,
}) => {
    return (
        <AnimatePresence>
            {selectedId && (
                <motion.div
                    className="extra-clickable fixed bottom-4 inset-x-2 bg-white/80 border border-gray-200 backdrop-blur-sm p-4 rounded-lg shadow-md z-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <Button
                        variant="ghost"
                        onClick={() => handleFlipHorizontal(selectedId)}
                    >
                        <FlipHorizontal className="size-6 text-purple-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => handleDelete(selectedId)}
                    >
                        <Trash2 className="size-6 text-red-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => handleDuplicate(selectedId)}
                    >
                        <Copy className="size-6 text-yellow-600" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavBarSelectedElement;
