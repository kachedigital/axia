import { MetadataRoute } from 'next';
import { getProjects } from '@/services/project-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getProjects();

    const projectEntries = projects.map((project) => ({
        url: `https://staging.kachedigital.com/projects/${project.fields.slug}`,
        lastModified: new Date(project.sys.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: 'https://staging.kachedigital.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://staging.kachedigital.com/contact',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...projectEntries,
    ];
}
