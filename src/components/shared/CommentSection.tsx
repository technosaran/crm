'use client';

import React, { useState } from 'react';
import {
    Send,
    User,
    Clock,
    MessageSquare,
    Hash,
    Smile,
    Paperclip
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useCollaboration } from '@/hooks/useCollaboration';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentSectionProps {
    entityType: string;
    entityId: string;
}

export const CommentSection = ({ entityType, entityId }: CommentSectionProps) => {
    const { comments, loading, addComment } = useCollaboration(entityType, entityId);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const success = await addComment(newComment);
        if (success) {
            setNewComment('');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Internal Thread</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{comments.length} updates logged</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[400px] custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="h-6 w-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-20">
                        <MessageSquare size={48} className="text-slate-200 mb-4" />
                        <p className="text-sm font-bold text-slate-500 tracking-tight">No internal discussions yet</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Start the conversation below</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment, i) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex gap-4 group"
                            >
                                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">{comment.user_profile?.name || 'User'}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50">
                                        <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/10">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your update here... Use @ to mention team members"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 pr-14 min-h-[100px] text-[13px] focus:border-indigo-500 outline-none resize-none transition-all shadow-sm"
                    />
                    <div className="absolute bottom-4 left-4 flex gap-4 text-slate-400">
                        <button type="button" className="hover:text-indigo-600 transition-colors"><Smile size={18} /></button>
                        <button type="button" className="hover:text-indigo-600 transition-colors"><Paperclip size={18} /></button>
                        <button type="button" className="hover:text-indigo-600 transition-colors"><Hash size={18} /></button>
                    </div>
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className={cn(
                            "absolute bottom-4 right-4 h-10 w-10 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20",
                            newComment.trim() ? "bg-indigo-600 text-white hover:scale-105" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        )}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};
