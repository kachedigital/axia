'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Optimistic UI/Immediate state change for Slow-Net fix
        setStatus('submitting');
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            setStatus('success');
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }

    return (
        <div aria-live="polite" className="relative">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: 0 }}
                        className="rounded-[2rem] border border-brand/20 bg-brand/5 p-12 text-center"
                    >
                        {/* Hidden announcement for screen readers */}
                        <span className="sr-only">Systems Aligned. Message Received.</span>

                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand">
                            <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white">Handshake Established</h2>
                        <p className="text-gray-400">Your signal has been received. Expect a response within one business cycle.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-8 text-xs font-black uppercase tracking-widest text-brand hover:underline"
                        >
                            Send Another Signal
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Refined Honeypot - Hidden from humans & AOM, enticing to bots */}
                        <div aria-hidden="true" className="sr-only">
                            <label htmlFor="website_url">Website URL (Ignore this field)</label>
                            <input
                                id="website_url"
                                type="text"
                                name="website_url"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Node Identity
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    disabled={status === 'submitting'}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white transition-all focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Access Point
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    disabled={status === 'submitting'}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white transition-all focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Data Payload
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                placeholder="What are we building?"
                                disabled={status === 'submitting'}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white transition-all focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-50 resize-none"
                            />
                        </div>

                        <AnimatePresence>
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-bold text-red-500"
                                >
                                    Signal Interrupted: {errorMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-brand py-4 px-8 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {status === 'submitting' ? (
                                    <>
                                        Establishing Link
                                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
                                    </>
                                ) : (
                                    'Initiate Handshake'
                                )}
                            </span>
                            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
