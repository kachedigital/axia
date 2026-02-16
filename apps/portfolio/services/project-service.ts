import { cache } from 'react';
import { client } from '@/lib/contentful-client';
import { ProjectSkeleton } from '@/types/contentful';
import { Entry } from 'contentful';

export const getProjects = cache(async (): Promise<Entry<ProjectSkeleton, undefined, string>[]> => {
    const response = await client.getEntries<ProjectSkeleton>({
        content_type: 'project',
        order: ['-sys.createdAt'],
    });

    return response.items;
});

export const getProjectBySlug = cache(async (slug: string): Promise<Entry<ProjectSkeleton, undefined, string> | null> => {
    const response = await client.getEntries<ProjectSkeleton>({
        content_type: 'project',
        'fields.slug': slug,
        limit: 1,
    });

    return response.items[0] || null;
});
