'use client';

import React, { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProjectSkeleton } from '@/types/contentful';
import { Entry } from 'contentful';

interface AssetFields {
    file?: { url?: string };
    title?: string;
}

interface ContentfulAsset {
    fields: AssetFields;
}

interface ProjectCardProps {
    data: Entry<ProjectSkeleton, undefined, string>['fields'];
    index?: number;
    priority?: boolean;
}

// Global Spring Physics: "Professional Snap"
const SPRING_TRANSITION = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
};

export function ProjectCard({ data, index = 0, priority = false }: ProjectCardProps) {
    const { title, slug, summary, image, tags, featured, type, impactStat } = data;
    const titleId = useId();

    // Type-safe extraction for Contentful Asset
    const asset = image as unknown as ContentfulAsset;
    const imageUrl = asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : null;
    const imageAlt = (asset?.fields?.title as string) || (title as unknown as string) || 'Project image';

    const displayTitle = title as unknown as string;
    const displaySummary = summary as unknown as string;
    const displaySlug = slug as unknown as string;
    const displayTags = (tags as unknown as string[]) || [];
    const projectType = (type as unknown as string) || 'SaaS';
    const displayImpact = impactStat as unknown as string;

    // Layout Logic based on Type
    let layoutClasses = "md:col-span-2 md:row-span-1"; // Default/Audit
    let aspectClass = "aspect-video";

    if (projectType === 'SaaS') {
        layoutClasses = "md:col-span-4 md:row-span-1 md:aspect-video";
    } else if (projectType === 'Mobile') {
        layoutClasses = "md:col-span-2 md:row-span-2";
        aspectClass = "aspect-[3/4]";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ ...SPRING_TRANSITION, delay: index * 0.05 }}
            className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface-100 transition-all duration-300 hover:border-brand/50 ${layoutClasses}`}
        >
            {/* Visual Container */}
            <div className={`relative ${aspectClass} w-full overflow-hidden bg-white/5`}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Media Stream Offline</span>
                    </div>
                )}

                {featured && (
                    <div className="absolute left-6 top-6 z-20 rounded-full bg-brand px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                        High Signal
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col h-full justify-between p-8">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand/80">
                        {displayTags.join(' • ')}
                    </span>

                    <h3
                        id={titleId}
                        className="mt-2 text-2xl font-bold text-slate-50 group-hover:text-brand transition-colors leading-tight"
                    >
                        <Link href={`/projects/${displaySlug}`}>
                            {/* Invisible Link Pattern for expanded hit area */}
                            <span className="absolute inset-0 z-10" aria-hidden="true" />
                            {displayTitle}
                        </Link>
                    </h3>

                    <p className="mt-4 text-sm text-slate-400 font-medium leading-relaxed line-clamp-3">
                        {displaySummary}
                    </p>
                </div>

                {/* Impact Stat for SaaS/Performance Metric */}
                {displayImpact && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <span className="text-xs font-bold uppercase tracking-widest text-engineering">
                            {displayImpact}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
