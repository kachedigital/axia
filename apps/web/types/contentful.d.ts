import { EntryFieldTypes } from 'contentful';

export interface ProjectSkeleton {
    contentTypeId: 'project';
    fields: {
        title: EntryFieldTypes.Text;
        slug: EntryFieldTypes.Text;
        description: EntryFieldTypes.RichText;
        summary: EntryFieldTypes.Text;
        image: EntryFieldTypes.AssetLink;
        tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        githubUrl: EntryFieldTypes.Text;
        liveUrl: EntryFieldTypes.Text;
        featured: EntryFieldTypes.Boolean;
        type: EntryFieldTypes.Text;
        impactStat: EntryFieldTypes.Text;
    };
}

export interface Project {
    title: string;
    slug: string;
    description: any; // Contentful Rich Text
    summary: string;
    image: {
        url: string;
        title: string;
    };
    tags: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
}
