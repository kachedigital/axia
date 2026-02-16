import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProjectBySlug, getProjects } from '@/services/project-service';

interface AssetFields {
    file?: { url?: string };
    title?: string;
}

interface ContentfulAsset {
    fields: AssetFields;
}
import { RichTextRenderer } from '@/components/contentful/rich-text-renderer';
import { Document } from '@contentful/rich-text-types';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const project = await getProjectBySlug(params.slug);

    if (!project) {
        return {
            title: 'Project Not Found | Kache Digital',
        };
    }

    const title = (project.fields.title as unknown as string);
    const summary = (project.fields.summary as unknown as string);
    const image = project.fields.image as unknown as ContentfulAsset;
    const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '';

    return {
        title: `${title} | Kache Digital`,
        description: summary,
        openGraph: {
            title: `${title} | Kache Digital`,
            description: summary,
            images: imageUrl ? [imageUrl] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Kache Digital`,
            description: summary,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((project) => ({
        slug: (project.fields.slug as unknown as string),
    }));
}

export default async function ProjectPage({ params }: Props) {
    const project = await getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    const { title, description, image, tags, githubUrl, liveUrl, featured } = project.fields;

    // Data Extraction
    const displayTitle = title as unknown as string;
    const displayDescription = description as unknown as Document;
    const displayTags = (tags as unknown as string[]) || [];
    const asset = image as unknown as ContentfulAsset;
    const imageUrl = asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : null;
    const imageAlt = (asset?.fields?.title as string) || displayTitle;

    return (
        <article className="min-h-screen pb-24">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden bg-white/5">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-cover opacity-60 transition-transform duration-1000 hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-12">
                    <div className="max-w-4xl">
                        <div className="mb-6 flex flex-wrap gap-2">
                            {featured && (
                                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
                                    High Signal Case Study
                                </span>
                            )}
                            {displayTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="mb-6 text-5xl font-black tracking-tighter md:text-7xl">
                            {displayTitle}
                        </h1>

                        <div className="flex flex-wrap gap-6">
                            {liveUrl && (
                                <a
                                    href={liveUrl as unknown as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
                                >
                                    Visit Live Project
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                                </a>
                            )}
                            {githubUrl && (
                                <a
                                    href={githubUrl as unknown as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                                >
                                    View Repository
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto mt-20 px-4">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_300px]">
                    <div className="max-w-prose">
                        <h2 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-primary">
                            Analysis & Implementation
                        </h2>
                        <RichTextRenderer content={displayDescription} />
                    </div>

                    <aside className="space-y-12">
                        <div>
                            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                                Tech Stack
                            </h3>
                            <ul className="flex flex-wrap gap-2">
                                {displayTags.map((tag) => (
                                    <li
                                        key={tag}
                                        className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
                                    >
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                            <h3 className="mb-4 text-sm font-bold">Interested in the process?</h3>
                            <p className="mb-6 text-xs leading-relaxed text-gray-400">
                                Every project is a deep dive into problem-solving. Let&apos;s discuss how we can apply these patterns to your workspace.
                            </p>
                            <a
                                href="/contact"
                                className="block w-full rounded-2xl bg-white/10 py-3 text-center text-xs font-black uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                Initiate Handshake
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
